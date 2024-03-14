const { debug } = require('../utils/dataManipulation');
const models = require('../models/index');
const config = require('../config/config.json');
const SqlString = require('sequelize/lib/sql-string');
const dataUtil = require('../utils/dataManipulation');
const messages = require('../config/messages.json');
const toolUtils = require('../utils/controllers/tools');
const validate = require('../utils/validation/validateTools').validate;
const { redisClient, getAsync, makeKey } = require('../services/redis');
const consts = require('../config/const');
const Op = models.Sequelize.Op;

exports.list = function(req, res, next) {
	var includes = [];

	// Set includes
	includes = [
		{ 
			seperate: true, 
			model: models.Term,
			required: false,
			through: {
				attributes: []
            },
            include: [
                {
                    model: models.Taxonomy,
                    required: true,
                    include: [
                        {
                            model: models.Type,
                            attributes: [],
                            where: {
                                slug: {[Op.eq]: 'TOOLS'}
                            }
                        }
                    ]
                }
            ]
		}
	];
	
	models.Resource.scope('normal', 'tools').findAll({
		include: includes,
		order: [['title','ASC']]
	}).then(function(tools){
		return res.json({result: tools});
	}).catch(function(err){
		return next(err);
	})
	
};

//
//	Return this month tools
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

		let resources = await models.Resource.scope('tools','all').findAndCountAll({
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
		return res.status(403).send({
			message:err.message,
			stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
		})
	}
}

exports.details = async function(req, res){
	var slug = req.params.slug;
	var includes = [];

	try{
		let finalData = null;
	
		let tool = await models.Resource.scope('normal','tools').findOne({
			include: includes,
			where: {slug: {[Op.eq]: slug}}
		});

		if(!tool){
			return res.status(403).send({message: messages.tool.no_exist});
		}

		finalData = tool.toJSON();
		debug(await toolUtils.taxs(tool.id, 'TOOLS'));
		finalData.Taxonomies = await toolUtils.taxs(tool.id, 'TOOLS');
		

		return res.json({result: finalData});

	}catch(err){
		return res.status(403).send({
			message:err.message,
			stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
		})
	}
}


exports.search = async function(req, res) {
	// Check AUTH
	var userExists = req.userExists;
	
	var setWhere = "";
	var includes = [];
	var scope = 'normal';
	
	var limit = parseInt(req.query.limit) || config.limit;
	var page = parseInt(req.query.activePage) || 1;
	var terms = req.query.terms || [];
	var order = dataUtil.extractOrder(req.query.order, models) || null;

	var tags = req.query.tags || [];

	// Check if there is a type of resources (if admin, or personal resources, etc)
	var toolsType = req.query.type || null;
	var approval = req.query.approval || null;


	// SET REDIS KEY
	const redisKey = makeKey("TOOLS::SEARCH", {
		terms,
		tags,
		order,
		limit,
		page,
		toolsType,
		approval
	});

	let redisResult = await getAsync(redisKey);

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
					setWhere += ' OR ';
				}
				setWhere += 'Resource.title LIKE '+SqlString.escape("%"+tag+"%");

				i++;
			}	

			setWhere += ')';	
		}

		// Dashboard resources types
		if (toolsType){
			switch(toolsType){
				case 'mytools':
					if (!userExists){
						return res.status(401).send({message: messages.tools.access_permission})
					}

					// Set literally
					if (setWhere.length>0){
						setWhere += ' AND ';
					}
					setWhere += "Resource.user_id = "+userExists.id;
					setWhere += " AND (Resource.status = false OR Resource.status = true)";
					
				break;
				case 'pending':
					if (userExists.Role && userExists.Role.type != consts.ADMIN_ROLE){
						res.status(401).send({message: messages.tools.access_permission});
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

		// Set includes
		// SET REQUIRED FALSE in order to avoid INNERJOIN. Good when there is no value to search for and avoid filtering
		// SET SEPERATE in order to run queries seperatly (M:M associations)
		// Since there is a need to disable subqueries due to the use of LIMIT, required must be TRUE
		if(terms.length>0){

			includes.push(
				{
					model: models.Term,
					as: "TermSearch",
					where: {
						id: {
							[Op.in]: terms
						}
					},
					attributes: []
				},				
			);
		}
		
		/* includes.push(	
			{
				model: models.Term,
				required: true,
				include: [
					{
						model: models.Taxonomy
					}
				]
			}
		) */
	}


	try{

		let tools = null;
		let shouldUpdate = false;
		

		if(redisResult){
			tools = JSON.parse(redisResult);

		}else{

			shouldUpdate = true;
			// Set subQuery: false because we have multiple associations, and the limit will give bad results
			// with a DESC ordering.
			// More, it was needed to add require:true to each association that is used while filtering
			tools = await models.Resource.scope([scope, 'tools']).findAndCountAll({		
				distinct: true,				
				attributes: [
					'id',
					'slug',
					'title',
					'description',
					'link',
					'created_at'
				],
				include: includes,
				limit: limit,
				offset: ((page-1)*limit),
				order: [order],
				where: setWhere
			})
		}

		// This is the worst!!!!!!
		// The fact is that if I use limit and offset in the query, there will be repeated data and will ruin the results
		var rows = tools.rows ; /* tools.rows.slice(((page-1)*limit), limit+((page-1)*limit)); */
		

		let tempData = {
			count: tools.count, 
			rows: tools.rows
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
		return res.status(403).send({
            message:err.message,
            stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
        });
	}
}

// Set status
exports.setApproved = function(req, res){
	var userExists = req.userExists;
	var toolId = req.params.id;

	// Status
	var status = req.body.status;

	// Is there any justification message?
	var message = req.body.message || null;

	// Is there any extre messages?
	var messagesList = req.body.messagesList || [];

	// Only admins
	if (userExists && userExists.Role.type==consts.ADMIN_ROLE && toolId && status!=null){
		models.Resource.scope('all').findOne({
			where: {
				id: {[Op.eq]: toolId}
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
			debug(item, "Approve tool:");
			if (!item){
				res.status(403).send({message: messages.tool.no_exist});
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
						toolUtils.notifyStatus({
							user: el.User,
							tool: el.title,
							message: message,
							messagesList: queriedMessages && queriedMessages.length>0 ? queriedMessages.map(function(messageEl){ return messageEl.message }) : null,
							status: el.status
						});
					}

					redisClient.delWildcard(["TOOLS::*"]);
					return res.status(200).json({result: el});
				})
			}
			
		})
		.catch(function(err){
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			});
		});
	}else{
		return res.status(401).send({message: messages.tools.access_permission})
	}
}

// Undo status
exports.setApprovedUndo = async function(req, res){
	var userExists = req.userExists;
	var toolId = req.params.id;
	var prevData = req.body.data;


	// Only admins
	if (userExists && userExists.Role.type==consts.ADMIN_ROLE && toolId){
		try{
			const item = await models.Resource.scope('all').findOne({
				where: {
					id: {[Op.eq]: toolId}
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
				res.status(403).send({message: messages.tool.no_exist});
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
	
			redisClient.delWildcard(["TOOLS::*"]);
			return res.status(200).json({result: el});
			
		}catch(err){
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			});
		}
	}

	return res.status(401).send({message: messages.tools.access_permission})
	
}

//
//	Create tool
//
exports.createOrUpdate = function(req, res){	
	var userExists = req.userExists;

	// Check AUTH
	if (userExists && userExists.Role.type==consts.ADMIN_ROLE){
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
								slug: {[Op.eq]: 'TOOLS'}
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
							slug: {[Op.eq]: 'TOOLS'}
						}
					}
				]
			});

			//
			//	Prepare new tags to insert
			//
			await Promise.all(newTags.map(async (tag, index) =>{
				newTags[index] = {
					title: tag,
					taxonomy_id: tagsTax.id || null,
					slug: await dataUtil.createSlug(tag, models.Resource, 'all', false, models)
				};
			}));


			//
			//	Create tool with everything prepared
			//
			var action = req.params.slug ? 'update' : 'create';

			// REMOVE KEYS FROM REDIS
			redisClient.delWildcard(["TOOLS::*"]);

			upsertResource(req, res, newTags, existingTags, action, userExists);
		});


	}else{
		return res.status(401).send({message: messages.tool.create_permission})
	}
}

async function upsertResource(req, res, newTags, existingTags, action, userExists){
    //
    //	Create a slug
    //
	var slug = await dataUtil.createSlug(req.body.title, models.Resource, 'all', false, models)

	if (req.params.slug && action=='update'){

		try{
			//
			//	Get instance in order to update
			//
			const tool = await models.Resource.scope('tools').findOne({
				where:{
					slug: {[Op.eq]: req.params.slug}
				}
			})

			if(tool && (tool.user_id==userExists.id || userExists.Role.type==consts.ADMIN_ROLE)){

				//
				//	Update tool
				//
				await tool.updateAttributes({
					title: req.body.title,
					description: req.body.description,
					link: req.body.link,
					accepted_terms: req.body.accept_terms || 1,
					status: userExists.Role.type==consts.ADMIN_ROLE ? tool.status : true,
					approved: userExists.Role.type==consts.ADMIN_ROLE ? tool.approved : 0,
					approvedScientific: userExists.Role.type==consts.ADMIN_ROLE ? tool.approvedScientific : 0,
					approvedLinguistic: userExists.Role.type==consts.ADMIN_ROLE ? tool.approvedLinguistic : 0,
				})
			}else{
				return res.status(401).send({message: messages.tools.create_permission});
			}

			//	Set categories, cycles, etc
			tool.setTerms(req.body.terms);

			//
			//	Remove all tags and insert new ones
			//
			tool.addTerms(existingTags);

			await Promise.all(newTags.map(async (tag) => {
				let newTag = await models.Term.create(tag);
				await tool.addTerms(newTag);	    	
			}));

			
			toolUtils.notifyUpdate({user: userExists, slug: tool.dataValues.slug, title: tool.dataValues.title});

			return res.status(200).json({result: tool});
		}catch(err){
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			})
		}

	}else if(action=='create'){

		try{

			let type = await models.Type.findOne({
				where: {
					slug: {
						[Op.eq]: 'TOOLS'
					}
				}
			});

			if(!type){
				return res.status(403).send({message: messages.generic.no_type});
			}

			const item = await models.Resource.scope('normal', 'tools').create({
				title: req.body.title,
				slug: slug,
				description: req.body.description,
				link: req.body.link,
				user_id: userExists.id,
				accepted_terms: req.body.accept_terms || 1,
				approved: /* userExists.Role.type==consts.ADMIN_ROLE && !adminMustApprove ? 1 : */ 0,
				approvedScientific: /* userExists.Role.type==consts.ADMIN_ROLE ? 1 : */ 0,
				approvedLinguistic: /* userExists.Role.type==consts.ADMIN_ROLE && !adminMustApprove ? 1 : */ 0,
				type_id: type.id
			})

			//	Set categories, cycles
			item.setTerms(req.body.terms);

			// Set tags				
			item.addTerms(existingTags);

			await Promise.all(newTags.map(async (tag) => {
				let newTag = await models.Term.create(tag)
				await item.addTerms(newTag);	    	
			}));

			toolUtils.notifyNew({user: userExists, slug: slug});

			return res.status(200).send({result: item});
		
		}catch(err){
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			})
		}
	}else{
		return res.status(401).send({message: messages.tools.save_error});
	}
}

//
//	Delete tool
//
exports.deleteEl = function(req, res){	
	var userExists = req.userExists;

	// Check AUTH
	if (userExists && req.params.slug && userExists.Role.type==consts.ADMIN_ROLE){

		models.Resource.scope('allStatusApprove','tools').findOne({
			where: {
				slug: {[Op.eq]: req.params.slug}
			}
		}).then((tool) => {

			if (!tool){
				return res.status(403).send({message: messages.tool.no_exist});
			}

			// REMOVE KEYS FROM REDIS
			redisClient.delWildcard(["TOOLS::*"]);
			
			if(tool && (tool.user_id==userExists.id || userExists.Role.type==consts.ADMIN_ROLE)){

				//
				//	Delete tool
				//
				tool.destroy()
				.then(() => {
					return res.status(200).send({});
				})
				.catch(function(err){
					return res.status(403).send({
						message:err.message,
						stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
					});
				});
				
			}else{
				return res.status(401).send({message: messages.tool.del_permission});
			}
		});
		
	}else{
		return res.status(401).send({message: messages.tool.del_permission});
	}
}

//
//	Delete collective tools
//
exports.deleteCollective = function(req, res){	
	var userExists = req.userExists;

	// Check AUTH
	if (userExists && userExists.Role.type==consts.ADMIN_ROLE){

		if (req.body.tools){		

			models.Resource.scope('all','tools').findAll({
				where: {
					id: {
						[Op.in]: req.body.tools
					}
				}
			}).then((tools) => {

				if (!tools || tools.length==0){
					return res.status(403).send({message: messages.tools.del_no_exist});
				}

				// If user is not admin, check each tool owner
				if (userExists.Role.type!=consts.ADMIN_ROLE){
					tools.forEach(function(item){
						if (item.user_id!=userExists.id){
							return res.status(401).send({message: messages.tools.del_permission});
						}
					})
				}

				// If no error, then destroy all
				models.Resource.scope('all','tools').destroy({
					where: {
						id: {[Op.in]: req.body.tools}
					}
				})
				.then(() => {
					// REMOVE KEYS FROM REDIS
					redisClient.delWildcard(["TOOLS::*"]);

					return res.status(200).send({});
				})
				.catch(function(err){
					return res.status(403).send({
						message:err.message,
						stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
					});
				});
			});
		}else{
			return res.status(403).send({message: messages.tools.del_no_exist});
		}
		
	}else{
		return res.status(401).send({message: messages.tools.del_permission});
	}
}