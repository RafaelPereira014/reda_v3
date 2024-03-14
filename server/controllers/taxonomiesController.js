const { debug } = require('../utils/dataManipulation');
const models = require('../models/index');
const config = require('../config/config.json');
const dataUtil = require('../utils/dataManipulation');
const messages = require('../config/messages.json');
const validate = require('../utils/validation/validateTaxs').validate;
const { redisClient, getAsync, makeKey } = require('../services/redis');
const consts = require('../config/const');
const Op = models.Sequelize.Op;

exports.list = async function(req, res, next) {
	// Set resource type
	var type = "";
	let queryType = req.query.type;
	if (queryType){
		switch(queryType){
			case "tools":
				type = "TOOLS";
				break;
			case "rec":
				type = "RESOURCES";
				break;
			case "apps":
				type = "APPS";
				break;
			case "feedback":
				type = "FEEDBACK";
				break;
			case "scripts":
				type = "RESOURCES";
				break;
		}
	}

	// Set resources scope
	const scope = req.query.scope || null;

	// SET RESOURCES LIST REDIS KEY
	let taxsListRedisKey = makeKey("TAXONOMIES::LIST", {
		queryType,
		scope,
		terms: req.query.terms,
		isRequired: req.query.required,
		taxs: req.query.taxs,
		exclude: req.query.exclude,
		include: req.query.include
	});

	//	Get data from REDIS if exists
	let taxsListRedisResult = await getAsync(taxsListRedisKey);

	// If there are results to show from cache, just ditch all the other processing and go straight to fetch the data from cache
	if(!taxsListRedisResult){
		// =================================================
		// SET INCLUDES
		// =================================================
		var includes = [];
		var typeWhere = {};

		if(type!==''){
			typeWhere = {
					slug: {
							[Op.eq]: type
					}
			};
		}

		includes = [
			{ 
					model: models.Type,
					where: typeWhere,
					attributes: []
			},
		];
		
		if(req.query.terms){
			let termsLiterals = [];

			termsLiterals.push(
				[models.sequelize.literal('(SELECT IF(COUNT(*) > 0, 1, 0) FROM resource_terms WHERE resource_terms.term_id = Terms.id AND Terms.deleted_at IS NULL)'), 'hasResources'],	
			);

			if(queryType=='rec' || queryType=='scripts'){
				termsLiterals.push(
					[models.sequelize.literal('(SELECT IF(COUNT(*) > 0, 1, 0) FROM script_terms WHERE script_terms.term_id = Terms.id AND Terms.deleted_at IS NULL)'), 'hasScripts'],	
				);
			}

			let isRequired = req.query.required || false;
			let getTerms = {
				model: models.Term,
				attributes: Object.keys(models.Term.attributes).concat(termsLiterals),
				include: [
					{
						model: models.TermRelationship,
						as: 'Relationship',
						required: false,
						attributes: ['id'],
						through: {
							attributes: ['level'],
						}
					}
				]
			}

			if(isRequired && (queryType=='rec' || queryType=='scripts')){
				let scriptInclude = {
					model: models.Script.scope(queryType && queryType=='scripts' && scope ? scope : (queryType!=='scripts' && scope==='pending' ? 'normal' : null)),
					required: true,
					attributes: ['id', 'resource_id'],
					include: [
						{
							model: models.Resource.scope(queryType && queryType=='rec' && scope ? scope : (queryType!=='rec' && scope==='pending' ? 'normal' : null)),
							required: true,
							attributes: []
						}
					]
				}
				getTerms.include.push(scriptInclude);
			}

			if(isRequired && queryType!=='scripts' && queryType!=='rec'){
				getTerms.include.push({
					model: models.Resource.scope([queryType, scope || 'defaultScope']),
					required: true,
					attributes: []
				})
			}

			includes.push(getTerms)
		}
		
		// =================================================
		// SET WHERE
		// =================================================
		var setWhere = {};
		if(req.query.taxs){
			setWhere = {
				slug: {
					[Op.in]: req.query.taxs
				}
			}
		}

		if(req.query.exclude){
			setWhere = {
				slug: {
					[Op.notIn]: req.query.exclude
				}
			}
		}

		if(req.query.include){
			setWhere = {
				slug: {
					[Op.in]: req.query.include
				}
			}
		}

		// =================================================
		// SET ATTRIBUTES AND LITERALS
		// =================================================
		var attributes = [
			"id",	
			"title",
			"slug",
			"created_at",
			"updated_at",
			"type_id",
		];

		var literals = [];
		var order = [
			['title', 'ASC']
		];
		if(req.query.terms){
			order.push([models.sequelize.literal('cast(`Terms`.`title` as unsigned) ASC')]);
			order.push([models.Term, 'title', 'ASC']);
		}
	}

	try{
		let data = null;
		let shouldUpdate = false;

		//	Get list of all resources
		if(taxsListRedisResult){
			data = JSON.parse(taxsListRedisResult);

		}else{
			let taxonomies = await models.Taxonomy.findAll({
				include: includes,
				attributes: attributes.concat(literals),
				where: setWhere,
				order
			});

			data = taxonomies.map(el => {
				let finalRels = [];
				let topRelLevel = null;
				// For each term
				if(el.Terms){
					el.Terms.map( term => {
						// Check if Taxonomy object is already in final array
						// If already exists
						if(term.Relationship){					

							term.Relationship.map( rel => {
								let thisRel = rel.get({plain: true});
								if(thisRel.terms_relation){
									topRelLevel = (!topRelLevel || topRelLevel>thisRel.terms_relation.level) ? thisRel.terms_relation.level : topRelLevel;
								}

								finalRels.push(thisRel);
							})
							term.Relationship.dataValues = [];
						}
					});

					el.dataValues.Relationships = finalRels;
					if(topRelLevel){
						el.dataValues.topRelLevel = topRelLevel;
					}
				}

				return el;			
			});

			data.sort((a, b) => {
				var keyA = a.dataValues.topRelLevel,
				keyB = b.dataValues.topRelLevel;
				// Compare the 2 dates
				if(keyA < keyB) return -1;
				if(keyA > keyB) return 1;
				return 0;
			});

			shouldUpdate = true;
		}

		//	Update key
		if (shouldUpdate){
			// Set redis key
			// SECONDS - MINUTES - HOURS - DAYS
			redisClient.set(taxsListRedisKey, JSON.stringify(data), 'EX', 60 * 60 * 24 * 2);
		}

		return res.json({result: data});
	}catch(err){
		return next(err);
	}
};


exports.listTax = async function(req, res) {


	try{

		let tax = await models.sequelize.query(`SELECT id,title, taxonomy_id FROM Terms where taxonomy_id=5 or taxonomy_id=7`, 
		{
			type: models.sequelize.QueryTypes.SELECT
		}
	);


		return res.json({result: tax});
	}catch(err){
		return next(err);
	}
};
//	Get details (tax and terms)
exports.details = async (req, res) => {

	if(!req.params.slug){
		return res.status(403).send({message: messages.taxonomy.no_exist});
	}

	try{
		let includes = [
			{
				model: models.Type
			}
		];

		var order = [
			['title', 'ASC']		
		];

		if(req.query.terms){
			includes.push({
				model: models.Term
			});

			order.push([models.sequelize.literal('cast(`Terms`.`title` as unsigned) ASC')]);
			order.push([models.Term, 'title', 'ASC']);
		}

		let taxonomies = await models.Taxonomy.findOne({
			include: includes,
			where: {
				slug: {
					[Op.eq]: req.params.slug
				}
			},
			order
		});

		/* if(taxonomies && taxonomies.Terms.length>0){
			//
			//  Get list of slugs
			//
			let titles = taxonomies.Terms.reduce( (acc, cur) => [cur.title, ...acc], []);
			titles.sort(dataUtil.compareLists);

			taxonomies.Terms = dataUtil.mapOrder(taxonomies.Terms, titles, 'title');
		} */
	
	
		// Return final object
		return res.json({
			result: taxonomies
		});
	}catch(err){
		return res.status(403).send({
			message:err.message,
			stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
		})
	}	
}

//	Get terms of taxonomy
exports.terms = async (req, res) => {
	if(!req.params.slug){
		return res.status(403).send({message: messages.taxonomy.no_exist});
	}


	try{
		let terms = null;
		let shouldUpdate = false;
		let finalTerms = null;

		/* let all = req.query.all || false; */
			
		var limit = parseInt(req.query.limit) || config.limit;
		var page = parseInt(req.query.activePage) || 1;

		const tax = await models.Taxonomy.findOne({
			where: {
				slug: {
					[Op.eq]: req.params.slug 
				}
			}
		})

		let redisKeyTemp = {
			tax: tax.id,
			hierarchical: tax.hierarchical,
			all: req.query.all
		}

		if(!tax.hierarchical && !req.query.all){
			redisKeyTemp.page = page,
			redisKeyTemp.limit = limit
		}
		
		// SET RESOURCES LIST REDIS KEY
		let listRedisKey = makeKey("TAXONOMY::TERMS", redisKeyTemp);

		//	Get data from REDIS if exists
		let listResult = await getAsync(listRedisKey);

		if(!listResult){

			var order = [
				[models.sequelize.literal('cast(`Term`.`title` as unsigned) ASC')],
				['title', 'ASC'],
				['parent_id', 'ASC']
			]

			let querySettings = {
				include: [
					{
						model: models.Taxonomy,
						attributes: [],
						where: {
							slug: {
								[Op.eq]: req.params.slug 
							}
						}
					},
					{
						model: models.Image,
						required: false
					}
				],
				order
			}

			if(!tax.hierarchical && !req.query.all){
				querySettings.limit = limit;
				querySettings.offset = ((page-1)*limit);
			}
			
			terms = await models.Term.findAndCountAll(querySettings);
			shouldUpdate = true;

			//  Get terms list with hierarchy levels, but not nested
			finalTerms = terms.rows.map( term => term.get({plain: true}));

			if(tax.hierarchical){
				finalTerms = reorderTerms(finalTerms, false);
			}

		}else{
			terms = JSON.parse(listResult);
			finalTerms = terms.rows;
		}

		let data = {
			count: terms.count, 
			rows: finalTerms
		};

		//	Update key
		if (shouldUpdate){
			// Set redis key
			// SECONDS - MINUTES - HOURS - DAYS
			redisClient.set(listRedisKey, JSON.stringify(data), 'EX', 60 * 60 * 24 * 2);
		}

		if(!req.query.all && tax.hierarchical){
			//  Set search range
			let range = {
				downOffset: ((page-1)*limit),
				upOffset: ((page-1)*limit) + limit,
				totalPages: Math.ceil(data.count/(limit))
			}        

			//  Set terms that are between range
			/* data.rows = data.rows.filter( (term, idx) => {
				return idx>=range.downOffset && idx < range.upOffset;
			}); */

			data.rows = data.rows ? data.rows.slice(range.downOffset, range.upOffset) : null;
		}

		let finalObjReturn = {}

		if(!req.query.all){
			finalObjReturn.page = page;
			finalObjReturn.totalPages = Math.ceil(data.count/limit);
			finalObjReturn.limit = limit;
			finalObjReturn.count = data.rows.length;
		}
		
		finalObjReturn.total = data.count;
		finalObjReturn.result = data.rows;
		
	
		// Return final object
		return res.json(finalObjReturn);
	}catch(err){
		return res.status(403).send({
			message:err.message,
			stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
		})
	}	
}

//	Search Taxonomies
exports.search = async (req, res) => {
	var setWhere = {};
	var includes = [
		{
			model: models.Type
		}
	];
	
	var limit = parseInt(req.query.limit) || config.limit;
	var page = parseInt(req.query.activePage) || 1;

	try{
		if(req.query.exclude){
			setWhere = {
				slug: {
					[Op.notIn]: req.query.exclude
				}
			}
		}

		let taxonomies = await models.Taxonomy.findAndCountAll({
			include: includes,
			where: setWhere,
			limit,
			offset: ((page-1)*limit),
			order: [['title', 'ASC']]
		});
	
		// The fact is that if I use limit and offset in the query, there will be repeated data and will ruin the results
		/* var rows = taxonomies ? taxonomies.rows.slice(((page-1)*limit), limit+((page-1)*limit)) : null; */
	
		let tempData = {
			count: taxonomies.count, 
			rows: taxonomies.rows
		};
	
		// Return final object
		return res.json({
			page,
			totalPages: Math.ceil(tempData.count/limit),
			limit,
			count: taxonomies.rows.length,
			total: tempData.count, 
			result: taxonomies.rows
		});
	}catch(err){
		return res.status(403).send({
            message:err.message,
            stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
        });
	}	
}

exports.createOrUpdate = async (req, res) => {
	var userExists = req.userExists;

	// Check AUTH
	/* if (userExists){ */
		//
		//	Check form validation
		//
		const checkData = validate(req.body);
		if (Object.keys(checkData).length != 0 && checkData.constructor === Object){
			return res.status(403).send({form_errors: checkData});
		}

		//
		//	Create app with everything prepared
		//
		var action = req.params.slug ? 'update' : 'create';

		upsert(req, res, action, userExists);

	/* }else{
		return res.status(401).send({message: messages.taxonomy.create_permission})
	} */
}

async function upsert(req, res, action, userExists){
    // INIT VARS
	let slug = "";
	const type = req.body.type || null;

	//
	//	Create a slug
	//
	try{
		slug = await dataUtil.createSlug(req.body.title, models.Taxonomy, null, false, models)
	}catch(err){
		return res.status(403).send({
			message:err.message,
			stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
		});
	}

	// REMOVE KEYS FROM REDIS
	redisClient.delWildcard(["TAXONOMY::*", "TAXONOMIES::*", "TERMS::*"]);


	if (req.params.slug && action=='update'){

		//
		//	Get instance in order to update
		//
		try{
			if(userExists.Role.type==consts.ADMIN_ROLE){
				const tax = await models.Taxonomy.updateEl({
					title: req.body.title,
					slug: req.params.slug
				},{
					type
				}, models);
				
				return res.status(200).json({result: tax});
			}else{
				res.status(401).send({message: messages.taxonomy.create_permission});
				return
			}
		}catch(err) {
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			});
		}

	}else if(action=='create'){

		try {
			const item = await models.Taxonomy.createEl({
				title: req.body.title,
				slug,
				locked: false,
			},{
				type
			}, models);
	
			return res.status(200).send({result: item});
		}catch(err){
			debug(err);
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			});
		}
	}
}

//
//	Delete Tax
//
exports.deleteEl = async (req, res) => {	
	var userExists = req.userExists;

	// Check AUTH
	if (userExists && req.params.slug){

		const tax = await models.Taxonomy.findOne({
			where: {
				slug: {[Op.eq]: req.params.slug},
				locked: false
			}
		});

		if (!tax){
			return res.status(403).send({message: messages.taxonomy.no_exist});
		}
		
		if(tax && userExists.Role.type==consts.ADMIN_ROLE){

			//
			//	Delete taxonomy
			//
			tax.destroy()
			.then(() => {
				// REMOVE KEYS FROM REDIS
				redisClient.delWildcard(["TAXONOMY::*", "TAXONOMIES::*", "TERMS::*"]);

				return res.status(200).send({});
			})
			.catch(function(err){
				return res.status(403).send({
					message:err.message,
					stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
				});
			});
			
		}else{
			return res.status(401).send({message: messages.taxonomy.del_permission});
		}
		
	}else{
		return res.status(401).send({message: messages.taxonomy.del_permission});
	}
}

//
//	Delete collective taxs
//
exports.deleteCollective = async (req, res) => {	
	var userExists = req.userExists;

	// Check AUTH
	if (userExists){

		if (req.body.taxs){		

			const taxs = await models.Taxonomy.findAll({
				where: {
					id: {
						[Op.in]: req.body.taxs
					}
				}
			})

			if (!taxs || taxs.length==0){
				return res.status(403).send({message: messages.taxonomies.del_no_exist});
			}

			// If user is not admin, check each app owner
			if (userExists.Role.type!=consts.ADMIN_ROLE){
				taxs.forEach(function(item){
					if (item.user_id!=userExists.id){
						return res.status(401).send({message: messages.taxonomies.del_permission});
					}
				})
			}

			// If no error, then destroy all
			models.Taxonomy.destroy({
				where: {
					id: {[Op.in]: req.body.taxs}
				}
			})
			.then(() => {
				// REMOVE KEYS FROM REDIS
				redisClient.delWildcard(["TAXONOMY::*", "TAXONOMIES::*", "TERMS::*"]);

				return res.status(200).send({});
			})
			.catch(function(err){
				return res.status(403).send({
					message:err.message,
					stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
				});
			});
			
		}else{
			return res.status(403).send({message: messages.taxonomies.del_no_exist});
		}
		
	}else{
		return res.status(401).send({message: messages.taxonomies.del_permission});
	}
}

function reorderTerms(terms, hierarchy = true){
	let finalStructure = [];

	let level = 1;

	terms.map(term => {
		let curTerm = Object.assign({}, term);
		
			if(!term.parent_id){
				if (hierarchy){
					curTerm.children = getChildren(terms, term);
					finalStructure.push(curTerm);
				}else{
					finalStructure.push(curTerm);
					finalStructure = finalStructure.concat(getChildren(terms, term, hierarchy, level+1));
				}
			}
		
	})
	return finalStructure;
} 

function getChildren(terms, term, hierarchy = true, level = 0){
	let children = [];

	terms.map( curTerm => {
		let thisChild = Object.assign({}, curTerm);
		thisChild.children = thisChild.children || [];

		if(curTerm.parent_id && curTerm.parent_id == term.id){
			thisChild.hierarchy_level = level;

			if (hierarchy){
				thisChild.children = thisChild.children.concat(getChildren(terms, curTerm));
				children.push(thisChild);
			}else{
				children.push(thisChild);
				children = children.concat(getChildren(terms, curTerm, hierarchy, level+1));
			}
			
		}
	})

	return children;
}