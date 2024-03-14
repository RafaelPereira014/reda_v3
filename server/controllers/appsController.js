const { debug } = require('../utils/dataManipulation');
const { handleError } = require('../utils/handler');
const models = require('../models/index');
const config = require('../config/config.json');
const SqlString = require('sequelize/lib/sql-string');
const dataUtil = require('../utils/dataManipulation');
const appUtils = require('../utils/controllers/apps');
const messages = require('../config/messages.json');
const validate = require('../utils/validation/validateApps').validate;
const { redisClient, getAsync, makeKey } = require('../services/redis');
const consts = require('../config/const');
const Op = models.Sequelize.Op;


exports.list = function(req, res, next) {
	var includes = [];

	// Set includes
	includes = [
		{
			model: models.Image,
			required: false
		},
		{
			model: models.Term,
			required: false,
			attributes: ['id', 'title', 'slug', 'taxonomy_id', 'image_id', 'parent_id'],
			through: {
				'attributes': []
			},
			include: [
				{
					model: models.Taxonomy,
					required: true,
					attributes: ['id', 'title', 'slug', 'locked', 'type_id'],
					include: [
						{
							model: models.Type,
							required: true,
							attributes: ['id', 'title', 'slug'],
							where:{
								slug: {[Op.like]: 'APPS'}
							},
						}
					]
				}
			]
		}
	];
	
	models.Resource.scope('normal', 'apps').findAll({
		include: includes,
		attributes: [
			'id',
			'title',
			'slug',
			'description',
			'link',
		],
		order: [['title','ASC']]
	}).then(function(apps){
		return res.json({result: apps});
	}).catch(function(err){
		return next(err);
	})
	
};

//
//	Return this month apps
//
exports.listNew = async (req, res) => {
	debug("Getting new of this month");
	// Check AUTH

	let today = new Date();
	var lastMonth = new Date();
	lastMonth.setHours(0,0,0,0);
	lastMonth.setDate(1);

	// Options from queryString
	var limit = parseInt(req.query.limit) || config.limit;
	var page = parseInt(req.query.activePage) || 1;

	var attributes = [
		'id',
		'title', 
		'slug', 
		'description', 
		'highlight', 
		'exclusive', 
		'status', 
		'created_at', 
		'updated_at',
		'user_id',
		'image_id',
		'duration'
	]

	try{

		let resources = await models.Resource.scope('apps','all').findAndCountAll({
			distinct: true,
			where: {
				created_at: {
						[Op.between]: [lastMonth, today]
				}
			},
			include: [
				{
					model: models.User,
					attributes: [
						'id',
						'name'
					]
				}
			],
			limit: limit,
			offset: (page-1)*limit,
			attributes: attributes
		});

		return res.status(200).json({
			page,
			totalPages: Math.ceil(parseInt(resources.count)/limit),
			limit,
			count: resources.rows.length,
			total: resources.count, 
			result: resources.rows
		});
	}catch(err){
		return handleError(res, err);
	}
}

// Search apps
exports.search = function(req, res, next) {
	
	var system = req.query.system || null;

	if (system==null){
		models.Term.findAll({
			include: [
				{
					model: models.Taxonomy,
					required: true,
					include: [
						{
							model: models.Type,
							required: true,
							where:{
								slug: {[Op.eq]: 'APPS'}
							},
						}
					],
					where: {
						slug: {
							[Op.like]: '%sistemas%'
						}
					}
				}
			],
			order: [['title','ASC']]
		})
		.then(function(systems){
			if(systems && systems.length>0){
				advanceSearch(req, res, next, [systems[0].id])
			}else{
				return res.status(403).send({message: messages.apps.no_system});
			}
		})
	}else{
		advanceSearch(req, res, next, system)
	}
}

// Search apps logic
async function advanceSearch(req, res, next, givenSystem){
	var userExists = req.userExists;

	var setWhere = "";

	var includes = [
		{
			model: models.Image,
			required: false,
			as: "Thumbnail"
		},
		{
			model: models.User,
			attributes: [
				'id',
				'email',
				'name',
				'organization'
			],
			required: false
		},
	];
	
	var limit = parseInt(req.query.limit) || config.limit;
	var page = parseInt(req.query.activePage) || 1;
	var terms = req.query.terms || [];
	var system = req.query.type && req.query.type==='pending' ? null : givenSystem;
	var order = dataUtil.extractOrder(req.query.order, models) || null;

	// Check if there is a type of resources (if admin, or personal resources, etc)
	var appsType = req.query.type || null;
	var approval = req.query.approval || null;

	var tags = req.query.tags || [];

	let scope = 'normal';

	// SET REDIS KEY
	const redisKey = makeKey("APPS::SEARCH", {
		terms,
		tags,
		system,
		order,
		appsType,
		approval,
		limit,
		page
	});

	let redisResult = await getAsync(redisKey);

	// If there are results to show from cache, just ditch all the other processing and go straight to fetch the data from cache
	if(!redisResult){

		// Set the tags to search for
		if (tags.length>0){
			// Are there any other data? If so, add AND
			if (setWhere.length>0){
				setWhere += ' AND ';
			}

			setWhere += '(';

			var i=0;

			// Build WHERE to search tags in tags and hint title
			for(var tag of tags){
				if (i>0){
					setWhere += ' AND ';
				}
				setWhere += 'Resource.title LIKE '+SqlString.escape("%"+tag+"%");

				i++;
			}	

			setWhere += ')';			
		}

		// Set includes
		// SET REQUIRED FALSE in order to avoid INNERJOIN. Good when there is no value to search for and avoid filtering
		// SET SEPERATE in order to run queries seperatly (M:M associations)
		// Since there is a need to disable subqueries due to the use of LIMIT, required must be TRUE

		if(terms && terms.length>0){
			let termsOperators = [];

			terms.map( term => {
				termsOperators.push({
					id: term
				});
			});

			includes.push({
				model: models.Term,
				as: "TermSearch",
				where: {
					[Op.or]: termsOperators
				},
				attributes: []
			});
		}
		
		if(system){
			includes.push(			
				{
					model: models.Term,
					as: "OtherMeta",
					where: {
						id: system
					},
					attributes: []
				},
			);
		}

		// Dashboard resources types
		if (appsType){
			switch(appsType){
				case 'myapps':
					if (!userExists){
						return res.status(401).send({message: messages.apps.access_permission})
					}

					// Set literally
					if (setWhere.length>0){
						setWhere += ' AND ';
					}
					setWhere += "Resource.user_id = "+userExists.id;
					setWhere += " AND (Resource.status = false OR Resource.status = true)";
					
				break;
				case 'all':
					if (!userExists){
						return res.status(401).send({message: messages.apps.access_permission})
					}

					scope = 'all';					
				break;
				case 'pending':
					if (userExists.Role && userExists.Role.type != consts.ADMIN_ROLE){
						res.status(401).send({message: messages.apps.access_permission});
						return
					}

					// Set literally
					if (setWhere.length>0){
						setWhere += ' AND ';
					}

					setWhere += "Resource.status = true AND Resource.approved=0";

					// Filter approval type if any provided
					var approvalType = approval ? (approval == 'scientific' ? 'Resource.approvedScientific=0 AND Resource.approvedLinguistic=0' : (approval == 'linguistic' ? 'Resource.approvedScientific = 1 AND Resource.approvedLinguistic = 0' : null)) : null;
					if (approvalType!=null){
						setWhere += " AND ("+approvalType+")";
					}
				break;
			}
		}

		// Is there any reference to the status? If not, set only those that are approved
		if (setWhere.indexOf("Resource.status = true")<0 && setWhere.indexOf("Resource.status = false")<0){
			if (setWhere.length>0){
				setWhere += " AND ";
			}
			setWhere += "Resource.status = true AND Resource.approved = 1 AND Resource.approvedScientific=1 AND Resource.approvedLinguistic=1";
		}

		// Since right now, all where clauses are strings, must assign as literal to sequelize recognize
		if (setWhere.length>0){
			setWhere = models.Sequelize.literal(setWhere);
		} 

		debug(scope);
	}

	try{
		let apps = null;
		let shouldUpdate = false;

		if(redisResult){
			apps = JSON.parse(redisResult);

		}else{

			shouldUpdate = true;

			// Set subQuery: false because we have multiple associations, and the limit will give bad results
			// with a DESC ordering.
			// More, it was needed to add require:true to each association that is used while filtering
			apps = await models.Resource.scope([scope, 'apps']).findAndCountAll({
				distinct: true,		
				include: includes,
				limit: limit,
				offset: ((page-1)*limit),
				order: [order],
				where: setWhere,
			});
		}

		var rows = apps.rows;

		if(shouldUpdate && rows.length>0){
			//	=================================================================
			//	Get metadata (terms and taxonomies)
			//	=================================================================
			// 	Get resources ids
			const appsIds = rows ? rows.reduce((acc, cur) => [cur.id, ...acc], []) : null;

			//	Get metadata based on scripts
			let meta = await models.sequelize.query(`SELECT 
				Taxonomies.id as 'Taxonomy_id',
				Taxonomies.title as 'Taxonomy_title',
				Taxonomies.slug as 'Taxonomy_slug',
				Taxonomies.hierarchical as 'Taxonomy_hierarchical',
				Terms.id as 'Term_id',
				Terms.title as 'Term_title',
				Terms.slug as 'Term_slug',
				Terms.icon as 'Term_icon',
				Terms.color as 'Term_color',
				resource_terms.metadata as 'Resource_metadata',
				resource_terms.resource_id as 'Resource_id'

			FROM 
				Terms
					INNER JOIN Taxonomies on (Terms.taxonomy_id = Taxonomies.id)
					INNER JOIN resource_terms on resource_terms.term_id = Terms.id
				WHERE resource_terms.resource_id IN (${appsIds}) AND Terms.taxonomy_id = Taxonomies.id
				ORDER BY 'Resource.id' ASC, Taxonomies.id ASC, Terms.slug+0 ASC
				`, 
				{
					type: models.sequelize.QueryTypes.SELECT
				}
			);

			rows.map(genericRow => {
				// If is a resource to show and doesn't have Taxonomies already
				if((!genericRow.hasOwnProperty("Taxonomies") || (genericRow.dataValues && !genericRow.dataValues.hasOwnProperty("Taxonomies")))){

					let finalMetaData = [];
					meta.map(row => {
						let curFinalEl = null;

						//	Is current term associated with this resource?
						if(row.Resource_id===genericRow.id){

							//	Check if taxonomy is already in object
							//	If not, create that property in final object
							if(!finalMetaData.some(curFinalRow => curFinalRow.slug==row.Taxonomy_slug)){
								finalMetaData.push({
									id: row.Taxonomy_id,
									title: row.Taxonomy_title,
									slug: row.Taxonomy_slug,
									hierarchical: row.Taxonomy_hierarchical,
									Terms: []
								});						
							}

							//	Get taxonomy property
							curFinalEl = finalMetaData.find(curFinalRow => curFinalRow.slug==row.Taxonomy_slug);

							//	Check if term already exists
							if(!curFinalEl.Terms.find(term => term.slug===row.Term_slug)){
								//	Add term
								curFinalEl.Terms.push({
									id: row.Term_id,
									title: row.Term_title,
									slug: row.Term_slug,
									icon: row.Term_icon,
									color: row.Term_color,
									metadata: row.Resource_metadata
								});
							}
							
						}					
					});

					if (genericRow.dataValues){
						genericRow.dataValues.Taxonomies = finalMetaData;
					}else{
						genericRow.Taxonomies = finalMetaData;
					}

					shouldUpdate = true;

					return genericRow;

				}
			})
		}

		let tempData = {
			count: apps.count, 
			rows: apps.rows
		};

		if(shouldUpdate){
			// Set redis key
			// SECONDS - MINUTES - HOURS - DAYS
			redisClient.set(redisKey, JSON.stringify(tempData), 'EX', 60 * 60 * 24 * 2);
		}

		// Return final object
		return res.json({
			page,
			totalPages: Math.ceil(tempData.count/limit),
			limit,
			count: rows.length,
			total: tempData.count, 
			result: rows
		});		

	}catch(err){
		return handleError(res, err);
	}
}

// Get app details
exports.details = function(req, res){
	var slug = req.params.slug;
	var includes = [];

	// Set includes
	includes.push(
		{
			model: models.Image,
			as: "Thumbnail",
			required: false
		},
		{
			model: models.Term,
			required: true
		},		
		{
			model: models.User,
			required: false,
			attributes: ["name","organization","email"]
		}
	);

	models.Resource.scope('normal','apps').findOne({
		group: ['Resource.id'],
		attributes: Object.keys(models.Resource.attributes),
		include: includes,
		where: {slug: {[Op.eq]: slug}}
	})
	.then(async function(app){

		let finalData = app.toJSON();

		finalData.Taxonomies = await appUtils.taxs(app.id, 'APPS');

		return res.json({result: finalData});
	}).catch(function(err){
		return handleError(res, err);
	});
}

// Set status
exports.setApproved = function(req, res){
	var userExists = req.userExists;
	var appId = req.params.id;

	// Status
	var status = req.body.status;

	// Is there any justification message?
	var message = req.body.message || null;

	// Is there any extre messages?
	var messagesList = req.body.messagesList || [];

	// Only admins
	if (userExists && userExists.Role.type==consts.ADMIN_ROLE && appId && status!=null){
		models.Resource.scope('all').findOne({
			where: {
				id: {[Op.eq]: appId}
			},
			include: [
				{
					model: models.User,
					paranoid: false,
					attributes: ['id', 'email']
				}
			]
		})
		.then(function(item){
			debug(item, "Approve application:");
			if (!item){
				res.status(403).send({message: messages.app.no_exist});
				return
			}

			debug(item.approvedScientific);

			// Reprove if status is false
			// Approve scientific if so and set status to false
			// Approve linguistic and set status to true if scientific was already approved
			// Approve for legacy if status is true and approved is false
			var updateAttributes = {};
			if(status==0 || status==false){
				updateAttributes = {
					approvedScientific: 0,
					approvedLinguistic: 0,
					approved: 1,
					status: false
				}
			}else if (item.approvedScientific==0){
				updateAttributes = {
					approvedScientific: 1,
					approvedLinguistic: 0,
					approved: 0,
					status: true
				}
			}else if (item.approvedScientific==1 && item.approvedLinguistic==0){
				updateAttributes = {
					approvedScientific: 1,
					approvedLinguistic: 1,
					approved: 1,
					status: true
				}
			}else if((status==1 || status==true) && (item.approved==false || item.approved==0)){
				updateAttributes = {
					approvedScientific: item.approvedScientific,
					approvedLinguistic: item.approvedLinguistic,
					approved: 1,
					status: status
				}
			}

			debug(updateAttributes);

			// Set item by having a moderation action with a specific status
			return item.updateAttributes(updateAttributes)					
		})
		.then(function(el){
			if (el){
				return models.Message.findAll({
					where: {
						id:{
							[Op.in]: messagesList
						}
					}
				})
				.then(function(queriedMessages){
					// Notify only if last step of validation or was reproved
					if ((el.approvedScientific==1 && el.approvedLinguistic==1) || (el.status==0 || el.status==false)){
						appUtils.notifyStatus({
							user: el.User,
							app: el.title,
							message: message,
							messagesList: queriedMessages && queriedMessages.length>0 ? queriedMessages.map(function(messageEl){ return messageEl.message }) : null,
							status: el.status
						});
					}

					redisClient.delWildcard(["APPS::*"]);
					return res.status(200).json({result: el});
				})
			}
			
		})
		.catch(function(err){
			return handleError(res, err);
		});
	}else{
		return res.status(401).send({message: messages.apps.access_permission})
	}
}

// Undo status
exports.setApprovedUndo = async function(req, res){
	var userExists = req.userExists;
	var appId = req.params.id;
	var prevData = req.body.data;


	// Only admins
	if (userExists && userExists.Role.type==consts.ADMIN_ROLE && appId){
		try{
			const item = await models.Resource.scope('all').findOne({
				where: {
					id: {[Op.eq]: appId}
				},
				include: [
					{
						model: models.User,
						paranoid: false,
						attributes: ['id', 'email']
					}
				]
			})
			if (!item){
				res.status(403).send({message: messages.app.no_exist});
				return
			}
	
			// Reprove if status is false
			// Approve scientific if so and set status to false
			// Approve linguistic and set status to true if scientific was already approved
			// Approve for legacy if status is true and approved is false
			var updateAttributes = {
				approvedScientific: prevData.approvedScientific,
				approvedLinguistic: prevData.approvedLinguistic,
				approved: prevData.approved,
				status: prevData.status
			};			
	
	
			// Set item by having a moderation action with a specific status
			const el = await item.updateAttributes(updateAttributes)
	
			redisClient.delWildcard(["APPS::*"]);
			return res.status(200).json({result: el});
			
		}catch(err){
			return handleError(res, err);
		}
	}

	return res.status(401).send({message: messages.apps.access_permission})
	
}

//
//	Create App
//
exports.createOrUpdate = function(req, res){	
	var userExists = req.userExists;

	// Check AUTH
	if (userExists){
		//
		//	Check form validation
		//
		const checkData = validate(req.body);
		if (Object.keys(checkData).length != 0 && checkData.constructor === Object){
			return res.status(403).send({form_errors: checkData});
		}

		//
		//	Check for existing tags according to provided
		//			
		
		models.Term.findAll({
			include: [
				{
					model: models.Taxonomy,
					where:{
						slug: {
							[Op.like]: '%tags%'
						}
					},
					include: [
						{
							model: models.Type,
							where:{
								slug: {[Op.eq]: 'APPS'}
							},
						}
					],
				}
			],
			where:{
				title: {
					[Op.in]: req.body.tags					
				},
			}
		})
		.then(async function(items){

			var existingTags = [];
			var newTags = req.body.tags;

			//
			//	Replace repeated tags for the ones form DB
			//
			for(var tag of items){
				var index = dataUtil.arrayToLowercase(newTags).indexOf(tag.title.toLowerCase());
				
				if (index>=0){
					newTags.splice(index, 1);
					existingTags.push(tag.id);
				}
			}

			let tagsTax = await models.Taxonomy.findOne({
				where: {
					slug: {
						[Op.like]: '%tags%'
					}
				},
				include: [
					{
						model: models.Type,
						where: {
							slug: {[Op.eq]: 'APPS'}
						}
					}
				]
			});

			//
			//	Prepare new tags to insert
			//
			newTags.forEach(async function(tag, index){
				newTags[index] = {
					title: tag,
					taxonomy_id: tagsTax.id || null,
					slug: await dataUtil.createSlug(tag, models.Resource, 'all', false, models)
				};
			});


			//
			//	Create app with everything prepared
			//
			var action = req.params.slug ? 'update' : 'create';

			// REMOVE KEYS FROM REDIS
			redisClient.delWildcard(["APPS::*"]);

			upsertApp(req, res, newTags, existingTags, action, userExists);
		})
		.catch(function(err){
			debug(err, "Apps","Upsert:error");
			return handleError(res, err);
		});

	}else{
		return res.status(401).send({message: messages.app.create_permission})
	}
}

async function upsertApp(req, res, newTags, existingTags, action, userExists){
	//
	//	Create a slug
	//
	var slug = await dataUtil.createSlug(req.body.title, models.Resource, 'all', false, models);

	// Timestamp to save file
	const timestamp = new Date().getTime();

	// Set systems and links
	const systemsAndLinks = [];
	req.body.links.map(link => {
		if (link.link && link.link.length>0 && req.body.terms.indexOf(link.id)>=0){
			systemsAndLinks.push(
				{
					id: link.id,
					link: link.link
				}
			)
		}
	});

	if (req.params.slug && action=='update'){

		try{
			//
			//	Get instance in order to update
			//
			const app = await models.Resource.scope('normal','apps').findOne({
				where:{
					slug: {[Op.eq]: req.params.slug}
				},
				include: [{
					model: models.Image,
					required: false
				}]
			})
			if(app && (app.user_id==userExists.id || userExists.Role.type==consts.ADMIN_ROLE)){

				let image = null;

				//
				//	Remove all files and insert new ones if there is no ID
				//		    
				if (req.body.image && req.body.image.data && req.body.image.extension && !req.body.image.id){
					const thumbName = slug+"_thumb_"+timestamp;

					//
					//	Save image to FileSys
					// req, res, folder, blob, name, ext, parentId
					dataUtil.saveFile(req, res, "apps/"+app.dataValues.slug, req.body.image.data, thumbName, req.body.image.extension);

					// Create new image and add reference
					image = await models.Image.create({
						name: thumbName,
						extension: req.body.image.extension
					})
				}

				//
				//	Update app
				//
				await app.updateAttributes({
					title: req.body.title,
					description: req.body.description,
					accepted_terms: req.body.accept_terms || 1,
					status: userExists.Role.type==consts.ADMIN_ROLE ? app.status : true,
					approved: userExists.Role.type==consts.ADMIN_ROLE ? app.approved : 0,
					approvedScientific: userExists.Role.type==consts.ADMIN_ROLE ? app.approvedScientific : 0,
					approvedLinguistic: userExists.Role.type==consts.ADMIN_ROLE ? app.approvedLinguistic : 0,
					image_id: req.body.image && req.body.image.id ? req.body.image.id : (image ? image.id : null),
				});
			}else{
				return res.status(401).send({message: messages.apps.create_permission});
			}


			//	Set categories, themes, etc.
			await app.setTerms(req.body.terms);

			//
			//	Set systems
			//
			debug(systemsAndLinks, "Apps", "Systems")
			await Promise.all(systemsAndLinks.map(async sysLink => {
				await app.addTerm(sysLink.id, {through: {metadata: sysLink.link}});
			}))		    

			//
			//	Remove all tags and insert new ones
			//
			app.addTerms(existingTags);

			await Promise.all(newTags.map(async (tag) =>{
				let newTag = await models.Term.create(tag)
				await app.addTerms(newTag);		    	
			}));

			// If no file, delete image
			if (!req.body.image){
				removeFiles(app);
			}

			appUtils.notifyUpdate({user: userExists, slug: app.dataValues.slug, title: app.dataValues.title});

			return res.status(200).json({result: app});
		}catch(err){
			return handleError(res, err);
		}

	}else if(action=='create'){

		//
		//	ADD THUMBNAIL
		//	
		let image = null;	    
		if (req.body.image!=undefined && req.body.image!=null && req.body.image.name!=null && req.body.image.extension!=null){

			const thumbName = slug+"_thumb_"+timestamp;

			//
			//	Save file to FileSys
			// req, res, folder, blob, name, ext, parentId
			dataUtil.saveFile(req, res, "apps/"+slug, req.body.image.data, thumbName, req.body.image.extension);

			// Create new file and add reference
			image = await models.Image.create({
				name: thumbName,
				extension: req.body.thumbnail.extension
			});
		}
		

		try{
			let type = await models.Type.findOne({
				where: {
					slug: {
						[Op.eq]: 'APPS'
					}
				}
			});

			if(!type){
				return res.status(403).send({message: messages.generic.no_type});
			}

			let item = await models.Resource.scope('normal', 'apps').create({
				title: req.body.title,
				slug: slug,
				description: req.body.description,
				user_id: userExists.id,
				accepted_terms: req.body.accept_terms || 1,
				approved: /* userExists.Role.type==consts.ADMIN_ROLE && !adminMustApprove ? 1 : */ 0,
				approvedScientific: /* userExists.Role.type==consts.ADMIN_ROLE ? 1 : */ 0,
				approvedLinguistic: /* userExists.Role.type==consts.ADMIN_ROLE && !adminMustApprove ? 1 : */ 0,
				image_id: image ? image.id : null,
				type_id: type.id
			});

			//	Set categories, themes, etc.
			await item.setTerms(req.body.terms);

			//
			//	Set systems
			//
			await Promise.all(systemsAndLinks.map(async sysLink => {
				await item.addTerm(sysLink.id, {through: {metadata: sysLink.link}});
			}))	

			// Set tags				
			item.addTerms(existingTags);

			await Promise.all(newTags.map(async (tag) =>{
				let newTag = await models.Term.create(tag)
				await item.addTerms(newTag);		    	
			}));

			
			appUtils.notifyNew({user: userExists, slug: slug});
			
			return res.status(200).send({result: item});
		}catch(err){
			return handleError(res, err);
		}
	}
}

//
//	Delete App
//
exports.deleteEl = function(req, res){	
	var userExists = req.userExists;

	// Check AUTH
	if (userExists && req.params.slug){

		models.Resource.scope('normal', 'apps').findOne({
			where: {
				slug: {[Op.eq]: req.params.slug}
			}
		}).then((app) => {

			if (!app){
				return res.status(403).send({message: messages.app.no_exist});
			}
			
			if(app && (app.user_id==userExists.id || userExists.Role.type==consts.ADMIN_ROLE)){

				//
				//	Delete app
				//
				app.destroy()
				.then(() => {
					// REMOVE KEYS FROM REDIS
					redisClient.delWildcard(["APPS::*"]);
					return res.status(200).send({});
				})
				.catch(function(err){
					return handleError(res, err);
				});
				
			}else{
				return res.status(401).send({message: messages.app.del_permission});
			}
		});
		
	}else{
		return res.status(401).send({message: messages.app.del_permission});
	}
}

//
//	Delete collective apps
//
exports.deleteCollective = function(req, res){	
	var userExists = req.userExists;

	// Check AUTH
	if (userExists){

		if (req.body.apps){		

			models.Resource.scope('all', 'apps').findAll({
				where: {
					id: {
						[Op.in]: req.body.apps
					}
				}
			}).then((apps) => {

				if (!apps || apps.length==0){
					return res.status(403).send({message: messages.apps.del_no_exist});
				}

				// If user is not admin, check each app owner
				if (userExists.Role.type!=consts.ADMIN_ROLE){
					apps.forEach(function(item){
						if (item.user_id!=userExists.id){
							return res.status(401).send({message: messages.apps.del_permission});
						}
					})
				}

				// If no error, then destroy all
				models.Resource.scope('all', 'apps').destroy({
					where: {
						id: {[Op.in]: req.body.apps}
					}
				})
				.then(() => {
					// REMOVE KEYS FROM REDIS
					redisClient.delWildcard(["APPS::*"]);
					return res.status(200).send({});
				})
				.catch(function(err){
					return handleError(res, err);
				});
			});
		}else{
			return res.status(403).send({message: messages.apps.del_no_exist});
		}
		
	}else{
		return res.status(401).send({message: messages.apps.del_permission});
	}
}

//
//	Remove a given app files
//
async function removeFiles(appObj){
	if (appObj && appObj.image_id){
		// Delete all files existing
		models.Image.destroy({
			where:{
				id: {[Op.eq]: appObj.image_id}
			}
		});

		//
		//	Delete physical files
		//
		dataUtil.rmDir("apps/"+appObj.slug);
	}
	
}