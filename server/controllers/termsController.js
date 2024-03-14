const { debug } = require('../utils/dataManipulation');
const { handleError } = require('../utils/handler');
const models = require('../models/index');
const dataUtil = require('../utils/dataManipulation');
const messages = require('../config/messages.json');
const validate = require('../utils/validation/validateTerms').validate;
const { redisClient } = require('../services/redis');
const consts = require('../config/const');
const utils = require('../utils/controllers/terms');
const Op = models.Sequelize.Op;

exports.list = function(req, res, next) {
	let type = req.query.type || null;
	let tax = req.query.tax || null;
	let isRequired = req.query.required || false;
	let term = req.query.term || null;

	// Set scope
	let scope = "";
	if (type){
		switch(type){
			case "tools":
				scope = "TOOLS";
				break;
			case "rec":
				scope = "RESOURCES";
				break;
			case "apps":
				scope = "APPS";
				break;
			case "feedback":
				scope = "FEEDBACK";
				break;
		}
	}

	// =================================================
	// SET INCLUDES
	// =================================================
	let includes = [];
	let taxSetWhere = {};
	if(tax){
		taxSetWhere = {
			slug: {
				[Op.eq]: tax
			}
		}
	}

	let taxScopeIncludeWhere = {};	
	if(scope!==""){
		taxScopeIncludeWhere = {
			slug: {
				[Op.eq]: scope
			}
		};
	}

	includes = [
		{ 
			model: models.Taxonomy,
			required: true,
			where: taxSetWhere,
			include: [
				{
					model: models.Type,
					where: taxScopeIncludeWhere
				}
			] 
		}
	];

	if(isRequired){
		includes.push({
			model: models.Resource,
			required: true,
		});
	}

	// =================================================
	// SET WHERE
	// =================================================
	let setWhere = {};
	if(term){
		setWhere = {
			slug: {
				[Op.eq]: term
			}
		}
	}

	// =================================================
	// SET ATTRIBUTES AND LITERALS
	// =================================================
	let attributes = [
		"id",	
		"title",
		"slug",
		"created_at",
		"updated_at",
		"parent_id",
		"image_id",
		"taxonomy_id"
	];

	let literals = [];
	literals.push(
		[models.sequelize.literal('(SELECT IF(COUNT(*) > 0, 1, 0) FROM Terms WHERE Terms.parent_id = Term.id AND Terms.deleted_at IS NULL)'), 'hasChild'],
		[models.sequelize.literal('(SELECT IF(COUNT(*) > 0, 1, 0) FROM terms_relations WHERE terms_relations.term_id = Term.id)'), 'hasRelationship']		
	);

	var order = [
		[models.sequelize.literal('cast(`Term`.`title` as unsigned) ASC')],
		['title', 'ASC']
	]
	
	models.Term.findAll({
		include: includes,
		attributes: attributes.concat(literals),
		where: setWhere,
		order
	}).then(function(categories){
		return res.json({result: categories});
	}).catch(function(err){
		return next(err);
	})
};

// =======================================
// Return all terms, from a given relationship, in a specific level
// E.g.: Get subjects (level 2), based on a year (given set of relationship IDs associated to that year).
// This will return all subjects (level 2), that are associated with those relationship IDs.
// =======================================
exports.relationship = function(req, res, next){
	let level = req.query.level || 1;
	let getlevel = req.query.getlevel || null;
	let rels = req.query.rels || [];
	let includes = [];

	let relsWhere = {};

	if(rels.length>0){
		relsWhere = {
			id:{
				[Op.in]: rels
			}
		}
	}

	includes.push({
		model: models.TermRelationship,
		as: 'Relationship',
		required: true,
		attributes: ['id'],
		where: relsWhere,
		through: {
			attributes: [],
			where: {
				level,
			}
		}
	});
	

	let literals = [];
	literals.push(
		[models.sequelize.literal('(SELECT IF(COUNT(*) > 0, 1, 0) FROM Terms WHERE Terms.parent_id = Term.id AND deleted_at IS NULL)'), 'hasChild'],
	);

	let attributes = [
		'id',
		'title',
		'slug',
		'taxonomy_id',
		'image_id',
		'parent_id'
	];

	models.Term.findAll({
		include: includes,
		attributes: attributes.concat(literals),
		order: [['title','ASC']],
	}).then(async function(categories){
		let catsJson = categories;

		if(getlevel){
			catsJson = await Promise.all(catsJson.map(async el => {
				let curEl = el.toJSON();
				var arrayRels = curEl.Relationship.map(function (obj) {
					return obj.id;
				});
				curEl.Relationship = await utils.getRelatedTerms(arrayRels, getlevel);
				return curEl;
			}));
		}
		return res.json({result: catsJson});
	}).catch(function(err){
		return next(err);
	})
}

exports.createOrUpdate = async (req, res) => {
	var userExists = req.userExists;

	// Check AUTH
	if (userExists){

		//
		//	Create term with everything prepared
		// changed to ID instead of slug
		var action = req.params.id ? 'update' : 'create';


		//
		//	Check form validation
		//
		const checkData = validate(req.body, action);
		if (Object.keys(checkData).length != 0 && checkData.constructor === Object){
			return res.status(403).send({form_errors: checkData});
		}

		upsert(req, res, action, userExists);

	}else{
		return res.status(401).send({message: messages.terms.create_permission})
	}
}

async function upsert(req, res, action){
    // INIT VARS
	let slug = "";

	//
	//	Create a slug
	//
	try{
		slug = await dataUtil.createSlug(req.body.title, models.Term, null, false, models)
	}catch(err){
		return handleError(res, err);
	}

	const timestamp = new Date().getTime();
	const fileName = slug+"_"+timestamp;

	// REMOVE KEYS FROM REDIS
	redisClient.delWildcard(["TAXONOMY::*", "TAXONOMIES::*", "TERMS::*"]);

	// changed to ID instead of slug
	if (req.params.id && action=='update'){

		//
		//	Get instance in order to update
		//
		try{
			const term = await models.Term.findOne({
				where:{
					// changed to ID instead of slug
					id: {[Op.eq]: req.params.id}
				},
			});

			if(term/*  && (userExists.Role.type==consts.ADMIN_ROLE) */){
				//
				//	Update term
				//
				const item = await term.updateAttributes({
					title: req.body.title,
					parent_id: req.body.parent || null,
					color: req.body.color || null,
					icon: req.body.icon || null,
				})

				// If no file, delete image
				if (!req.body.image){
					removeFiles(item);
				}

				//
				//	Remove all files and insert new ones if there is no ID
				//		    
				if (req.body.image && req.body.image.data && req.body.image.extension && !req.body.image.id){
					removeFiles(item);

					//
					//	Save image to FileSys
					// req, res, folder, blob, name, ext, parentId
					dataUtil.saveFile(req, res, "terms/"+item.dataValues.slug, req.body.image.data, fileName, req.body.image.extension);

					// Create new image and add reference
					const newImage = await models.Image.create({
						name: fileName,
						extension: req.body.image.extension
					})
					item.setImage(newImage);
				}
				
				return res.status(200).json({result: term});
			}else{
				res.status(401).send({message: messages.terms.create_permission});
				return
			}
		}catch(err) {
            return handleError(res, err, {message: messages.terms.save_error});
		}

	}else if(action=='create'){
		// console
		console.warn('creatINGGGGGGGGGGGGG');

		var fileToUpload = {};

		// Save file?
		if (req.body.image!=undefined && req.body.image!=null && req.body.image.name!=null && req.body.image.extension!=null){
			fileToUpload = {
				name: fileName,
				extension: req.body.image.extension				
			}
		}	

		try {
			const item = await models.Term.create({
				title: req.body.title,
				slug: slug,
				locked: false,
				parent_id: req.body.parent || null,
				color: req.body.color || null,
				icon: req.body.icon || null,
				taxonomy_id: parseInt(req.body.tax)
			});

			//
			//	Save image to FileSys
			//
			if (req.body.image && req.body.image.data && req.body.image.extension){
				// Create new file and add reference
				models.Image.create(fileToUpload)
				.then(function(newImage){
					item.setImage(newImage);
				});

				// req, res, folder, blob, name, ext, parentId
				dataUtil.saveFile(req, res, "terms/"+slug, req.body.image.data, fileName, req.body.image.extension);	
			}
	
			return res.status(200).send({result: item});
		}catch(err){
			debug(err);
			return handleError(res, err);
		}
	}
}

//
//	Delete Term
//
exports.deleteEl = async (req, res) => {	
	var userExists = req.userExists;

	// Check AUTH
	if (userExists && req.params.slug){

		try{
			const term = await models.Term.findOne({
				where: {
					slug: {[Op.eq]: req.params.slug}
				}
			});

			if (!term){
				return res.status(403).send({message: messages.term.no_exist});
			}
			
			if(term && userExists.Role.type==consts.ADMIN_ROLE){

				//
				//	Delete term
				//
				await term.destroy()
				// REMOVE KEYS FROM REDIS
				redisClient.delWildcard(["TAXONOMY::*", "TAXONOMIES::*", "TERMS::*"]);
				
				return res.status(200).send({});

				
			}else{
				return res.status(401).send({message: messages.term.del_permission});
			}

		}catch(err){
			debug(err);
			return handleError(res, err);
		}
		
	}else{
		return res.status(401).send({message: messages.term.del_permission});
	}
}

//
//	Delete collective terms
//
exports.deleteCollective = async (req, res) => {	
	var userExists = req.userExists;

	// Check AUTH
	if (userExists){

		if (req.body.terms){		

			const terms = await models.Term.findAll({
				where: {
					id: {
						[Op.in]: req.body.terms
					}
				}
			})

			if (!terms || terms.length==0){
				return res.status(403).send({message: messages.terms.del_no_exist});
			}

			// If user is not admin, check each app owner
			if (userExists.Role.type!=consts.ADMIN_ROLE){
				terms.forEach(function(item){
					if (item.user_id!=userExists.id){
						return res.status(401).send({message: messages.terms.del_permission});
					}
				})
			}

			// If no error, then destroy all
			models.Term.destroy({
				where: {
					id: {[Op.in]: req.body.terms}
				}
			})
			.then(() => {

				// REMOVE KEYS FROM REDIS
				redisClient.delWildcard(["TAXONOMY::*", "TAXONOMIES::*", "TERMS::*"]);

				return res.status(200).send({});
			})
			.catch(function(err){
				return handleError(res, err);
			});
			
		}else{
			return res.status(403).send({message: messages.terms.del_no_exist});
		}
		
	}else{
		return res.status(401).send({message: messages.terms.del_permission});
	}
}

//
//	Remove a given term files
//
function removeFiles(obj){
	if (obj && obj.image_id){
		// Delete all files existing
		models.Term.destroy({
			where:{
				id: {[Op.eq]: obj.image_id}
			}
		});

		//
		//	Delete physical files
		//
		dataUtil.rmDir("terms/"+obj.slug);
	}
	
}