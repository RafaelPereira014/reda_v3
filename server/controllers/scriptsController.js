const { debug } = require('../utils/dataManipulation');
const { handleError } = require('../utils/handler');
const models = require('../models/index');
const config = require('../config/config.json');
const SqlString = require('sequelize/lib/sql-string');
const messages = require('../config/messages.json');
const dataUtil = require('../utils/dataManipulation');
const scriptUtils = require('../utils/controllers/scripts');
const validate = require('../utils/validation/validateScripts').validate;
const validateSingleScript = require('../utils/validation/validateScripts').singleScript;
const { redisClient, getAsync, makeKey } = require('../services/redis');
const consts = require('../config/const');
const Op = models.Sequelize.Op;

// INIT Includes
function initIncludes(){

	return [
		{
			model: models.Term,
			required:false,
			through: {
				attributes: []
			},		
		},
		{
			model: models.File,
			required: false
		}
	];
}

//
//	Search scripts
//
exports.search = async function(req, res){
	var userExists = req.userExists;
	var includes = initIncludes();	
	var scope = 'defaultScope';

	//	==========================
	//  Set where initial variable
	//	==========================

	var setWhere = {};
	var resourcesWhereString = '';
	var scriptsTagsWhereString = '';
	var termsSetWhere = '';

	//	==========================
	//  END
	//	==========================

	var limit = parseInt(req.query.limit) || config.limit;
	var page = parseInt(req.query.activePage) || 1;
	var order = dataUtil.extractOrder(req.query.order, models) || null;
	var approval = req.query.approval || null;
	var terms = req.query.terms || [];
	var tags = req.query.tags || [];

	let shouldUpdate = false;

	// Check if there is a type of resources (if admin, or personal resources, etc)
	var scriptsType = req.query.type || null;

	try{
		// SET REDIS KEY
		const redisKey = makeKey("SCRIPTS::SEARCH", {
			approval,
			order,
			limit,
			page,
			scriptsType,
			terms,
			tags
		});

		let redisResult = await getAsync(redisKey);
		let scripts = null;

		if(redisResult){
			scripts = JSON.parse(redisResult);

		}else{
			// Set the tags to search for
			if (tags.length>0 || terms.length>0){
				// Are there anything after? If so, add AND
				if (resourcesWhereString.length>0){
					resourcesWhereString += ' AND ';
				}			

				if(tags.length>0){
					resourcesWhereString += '(';
					scriptsTagsWhereString += '(';
				}

				var i=0;

				// Build WHERE to search tags in tags, resource metadata, resource terms title and resource script terms title
				for(var tag of tags){
					if (i>0){
						scriptsTagsWhereString += ' OR ';
						resourcesWhereString += ' OR ';
					}
					resourcesWhereString += 'Resources.title LIKE '+SqlString.escape("%"+tag+"%");
					resourcesWhereString += ' OR ';
					resourcesWhereString += 'Resources.author LIKE '+SqlString.escape("%"+tag+"%");
					resourcesWhereString += ' OR ';
					resourcesWhereString += 'Resources.organization LIKE '+SqlString.escape("%"+tag+"%");
					resourcesWhereString += ' OR ';
					resourcesWhereString += 'Users.name LIKE '+SqlString.escape("%"+tag+"%");

					scriptsTagsWhereString+= 'Terms.title LIKE '+SqlString.escape("%"+tag+"%");

					i++;
				}	

				if(tags.length>0){
					resourcesWhereString += ')';
					scriptsTagsWhereString += ')';				
				}

				// TERMS ARE NOW SEARCHABLE AT THE SCRIPTS TERMS AND RESOURCE TERMS ALSO
				if(terms.length>0){

					let iterable = 0;
					for(var term of terms){
						if(iterable>0){
							termsSetWhere += ' AND '
						}
						termsSetWhere += ' SUM(Terms.id = '+parseInt(term)+')';
						iterable++;
					}
				}

				try{
					redisResult = null;

					//  ======================================================================
					//  Get scripts associated to resources with tags
					//  ======================================================================
					let scriptsWithResourcesTags = null;

					if(resourcesWhereString){
						//	Get data from REDIS if exists
						let resourcesTagsRedisKey = makeKey("SCRIPTS::SEARCH::RESOURCES_TAGS", {
							tags
						});
						redisResult = await getAsync(resourcesTagsRedisKey);

						//	Get list of all resources
						if(redisResult){
							scriptsWithResourcesTags = JSON.parse(redisResult);
							scriptsWithResourcesTags = scriptsWithResourcesTags.rows;
									
						}else{
							scriptsWithResourcesTags = await models.sequelize.query(`SELECT Scripts.id from reda_3.Scripts
							INNER JOIN Resources on Resources.id = Scripts.resource_id
							INNER JOIN Users on Users.id = Scripts.user_id
							WHERE ${resourcesWhereString} AND Scripts.deleted_at IS NULL AND Resources.deleted_at IS NULL
							GROUP BY Scripts.id
							ORDER BY Scripts.id`, 
								{
									type: models.sequelize.QueryTypes.SELECT
								}
							);

							redisClient.set(resourcesTagsRedisKey, JSON.stringify({rows: scriptsWithResourcesTags}), 'EX', 60 * 60 * 24 * 2);
						}

						scriptsWithResourcesTags = scriptsWithResourcesTags ? scriptsWithResourcesTags.reduce( (acc, cur) => [cur.id, ...acc], []) : [];
					}


					//  ======================================================================
					//  Get scripts with tags
					//  ======================================================================	
					let scriptsTagsTitles = null;	
					
					if(scriptsTagsWhereString!==''){			
						//	Get data from REDIS if exists
						let scriptTermsTitlesRedisKey = makeKey("SCRIPTS::SEARCH::SCRIPTS_TAGS", {
							tags
						});
						redisResult = await getAsync(scriptTermsTitlesRedisKey);

						//	Get list of all resources
						if(redisResult){
							scriptsTagsTitles = JSON.parse(redisResult);
							scriptsTagsTitles = scriptsTagsTitles.rows;
									
						}else{
							scriptsTagsTitles = await models.sequelize.query(`SELECT Scripts.id from reda_3.Scripts
							INNER JOIN script_terms on script_terms.script_id = Scripts.id
							INNER JOIN Terms on script_terms.term_id = Terms.id
							WHERE ${scriptsTagsWhereString} AND Scripts.deleted_at IS NULL
							GROUP BY Scripts.id
							ORDER BY Scripts.id`, 
								{
									type: models.sequelize.QueryTypes.SELECT
								}
							);

							redisClient.set(scriptTermsTitlesRedisKey, JSON.stringify({rows: scriptsTagsTitles}), 'EX', 60 * 60 * 24 * 2);
						}

						scriptsTagsTitles = scriptsTagsTitles ? scriptsTagsTitles.reduce( (acc, cur) => [cur.id, ...acc], []) : [];
					}

					//  ======================================================================
					//  Get scripts with terms
					//  ======================================================================
					let scriptsTerms = null;		
					if(termsSetWhere!==''){
						//	Get data from REDIS if exists
						let scriptTermsRedisKey = makeKey("SCRIPTS::SEARCH::SCRIPTS_TERMS", {
							terms					
						});
						redisResult = await getAsync(scriptTermsRedisKey);				

						//	Get list of all resources
						if(redisResult){
							scriptsTerms = JSON.parse(redisResult);
							scriptsTerms = scriptsTerms.rows;
									
						}else{
							scriptsTerms = await models.sequelize.query(`SELECT Scripts.id from reda_3.Scripts
							INNER JOIN script_terms on script_terms.script_id = Scripts.id
							INNER JOIN Terms on script_terms.term_id = Terms.id
							WHERE Scripts.deleted_at IS NULL
							GROUP BY Scripts.id
							HAVING
							${termsSetWhere}
							ORDER BY Scripts.id`, 
								{
									type: models.sequelize.QueryTypes.SELECT
								}
							);

							redisClient.set(scriptTermsRedisKey, JSON.stringify({rows: scripts}), 'EX', 60 * 60 * 24 * 2);
						}

						scriptsTerms = scriptsTerms ? scriptsTerms.reduce( (acc, cur) => [cur.id, ...acc], []) : [];
					}

					/*scriptsIdFilter = scriptsIdFilter.concat(scriptsTerms || []).concat(scriptsTagsTitles || []).concat(scriptsWithResourcesTags || []);

					 if(scriptsIdFilter.length==0){
						scriptsIdFilter = [0];
					} */

					let setWhereIds = [];

					if(scriptsTerms!==null && terms.length>0){
						debug(scriptsTerms,"SCRIPTS SEARCH");
						setWhereIds.push(
							{
								[Op.in]: scriptsTerms
							}
						);
					}

					if(scriptsTagsTitles!==null && scriptsWithResourcesTags!==null){
						let totalTagsIds = (scriptsTagsTitles || []).concat(scriptsWithResourcesTags || []);
						setWhereIds.push(
							{
								[Op.in]: totalTagsIds
							}
						);
					}

					setWhere.id = {
						[Op.and]:  setWhereIds
					}

				}catch(err){
                    return handleError(res, err);
				}			
			}

			// If user exists
			if (userExists){

				// Dashboard resources types
				if (scriptsType){
					switch(scriptsType){
						case 'myscripts':
							if (!userExists){
								res.status(401).send({message: messages.scripts.access_permission});
								return
							}
							setWhere.user_id = {[Op.eq]: userExists.id};
						break;
						case 'pending':
							if (userExists.Role && userExists.Role.type != consts.ADMIN_ROLE){
								res.status(401).send({message: messages.scripts.access_permission});
								return
							}
							scope = approval ? (approval == 'scientific' ? 'toApproveScientific' : (approval == 'linguistic' ? 'toApproveLinguistic' : 'pending')) : 'pending';
						break;
					}
				}

				// Include resource information
				includes.push({
					model: models.Resource.scope('normal','resources'),
					attributes: [
						'title',
						'description',
						'slug'
					],
					where: {
						status: 1
					},
					required: true
				});

				includes.push(
					{
						model: models.User,
						attributes: [					
							'organization', 
							'email', 
							'hidden',
							'name',
						]
					}
				);
				debug(scope);

				// GET SCRIPTS
				scripts = await models.Script.scope(scope).findAndCountAll({
					distinct: true,
					include: includes,
					where: setWhere,
					/* limit: limit,
					offset: ((page-1)*limit), */
					order: [order]
				});

				shouldUpdate = true;
			}else{
				return res.status(401).send({message: messages.scripts.access_permission})
			}
		}

		// Filter for those that are to show
		let rows = scripts.rows ? scripts.rows.slice(((page-1)*limit), limit+((page-1)*limit)) : [];

		let tempData = {
			count: scripts.count, 
			rows: scripts.rows
		};
	
		//	Update key
		if (shouldUpdate){
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

//
//	Get scripts from resource
//
exports.details = async function(req, res){
	var resource = req.params.resource;
	var includes = initIncludes();

	// If no user exists, show scripts that are only from exclusive resources
	/*if (!userExists){
		includes.push({
			model: models.Resource,
			attributes: [],
			where:{
				exclusive: false
			}
		});
	}*/

	includes.push(
		{
			model: models.User,
			attributes: [
				[models.sequelize.literal('IF(User.hidden=1,null,User.name)'), 'name'],
				'organization', 
				'email', 
				'hidden'
			],
			include: [
				{
					model: models.Role,
					attributes: ['id', 'value', 'type']
				}
			]
		}
	)

	try{
		// SET REDIS KEY
		const redisKey = makeKey("SCRIPTS::RESOURCE_SCRIPTS", {
			resource,
		});

		let redisResult = await getAsync(redisKey);

		if(redisResult){
			let data = JSON.parse(redisResult);

			return res.status(200).json(data);

		}else{

			//
			//	Get scripts
			//
			let scripts = await models.Script.findAll({
				include: includes,
				where: {
					resource_id: {[Op.eq]: resource}
				},
				order: [['main', 'DESC'], ['created_at', 'ASC']]
			})

			let finalData = [];

			scripts.map(script => {
				let tempData = script.toJSON();
				finalData.push(tempData);
			})

			await Promise.all(finalData.map(async (curData) => {
				curData.Taxonomies = await scriptUtils.scriptTaxs(curData.id, 'RESOURCES');
				return curData;
			}));

			let tempData = {
				result: finalData
			};


			// Set redis key
			// SECONDS - MINUTES - HOURS - DAYS
			redisClient.set(redisKey, JSON.stringify(tempData), 'EX', 60 * 60 * 24 * 2);

			// Return final object
			return res.status(200).json(tempData);
		}

	}catch(err){
		return handleError(res, err);
	}
}

//
//	Get script details based on script ID
//
exports.singleDetails = function(req, res, next){
	var script = req.params.script;
	var setWhere = {};
	var userExists = req.userExists;
	var includes = initIncludes();

	// Check AUTH
	if (userExists){
		setWhere = {
			id: {[Op.eq]: script}
		}

		includes.push(
			{
				model: models.User,
				attributes: ['id']		
			},
			{
				model: models.Resource
			}
		);

		//
		//	Get scripts
		//
		models.Script.findOne({
			where: setWhere,
			include: includes,
		})
		.then(function(script){
			// Check if is loggedin and user is owner or admin
			if (script && (script.User.id!=userExists.id && userExists.Role.type != consts.ADMIN_ROLE)){
				return res.status(401).send({message: messages.script.access_permission})
			}

			return res.json({result: script});
		}).catch(function(err){
			return next(err);
		});
	}else{
		return res.status(401).send({message: messages.script.access_permission});
	}
}

//
//	Get scripts of a resource that belong to the current user
//
exports.userScripts = function(req, res, next){
	var resource = req.params.resource;
	var setWhere = {};
	var userExists = req.userExists;
	var includes = initIncludes();

	// Check AUTH
	if (userExists){

		// If admin, get all scripts. 
		// If not, only show from the current user
		if(userExists.Role.type == consts.ADMIN_ROLE){
			setWhere = {
				resource_id: {[Op.eq]: resource}
			}
			
		}else{
			setWhere = {
				resource_id: {[Op.eq]: resource},
				user_id: {[Op.eq]: userExists.id}				
			}
		}

		//	Get only those that are not the main script
		setWhere.main = false;

		includes.push(
			{
				model: models.User,
				attributes: [
					[models.sequelize.literal('IF(User.hidden=1,null,User.name)'), 'name'], 
					'organization',
					'email', 
					'hidden'
				],	
			}
		)

		//
		//	Get scripts
		//
		models.Script.scope('active').findAll({
			where: setWhere,
			include: includes,
			order: [['main', 'DESC'], ['created_at', 'ASC']]
		})
		.then(async function(scripts){
			// If reproved
			if (resource.approved && !resource.status){
				return res.json({result: null});
			}

			let finalData = [];

			scripts.map(script => {
				let tempData = script.toJSON();
				finalData.push(tempData);
			})

			await Promise.all(finalData.map(async (curData) => {
				curData.Taxonomies = await scriptUtils.scriptTaxs(curData.id, 'RESOURCES');
				return curData;
			}));

			return res.status(200).json({result: finalData});

		}).catch(function(err){
			return next(err);
		});
	}else{
		return res.status(401).send({message: messages.scripts.resource_access_permission});
	}
}

// Set status
exports.setApproved = function(req, res){
	var userExists = req.userExists;
	var scriptId = req.params.id;

	// Status
	var status = req.body.status;

	// Is there any justification message?
	var message = req.body.message || null;

	// Is there any extre messages?
	var messagesList = req.body.messagesList || [];

	// Only admins
	if (userExists && userExists.Role.type==consts.ADMIN_ROLE && scriptId && status!=null){
		models.Script.scope('all').findOne({
			where: {
				id: {[Op.eq]: scriptId}
			},
			include: [
				{
					model: models.User,
					attributes: ['id', 'email']
				},
				{
					model: models.Resource.scope('all'),
					attributes: ['id', 'title', 'slug']
				}
			]
		})
		.then(function(item){
			if (!item){
				res.status(403).send({message: messages.script.no_exist});
				return
			}

			// REMOVE KEYS FROM REDIS
			redisClient.delWildcard(["SCRIPTS::*", "RESOURCES::*"]);

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
				models.Message.findAll({
					where: {
						id:{
							[Op.in]: messagesList
						}
					}
				})
				.then(function(queriedMessages){
					// Notify only if last step of validation or was reproved
					if ((el.approvedScientific==1 && el.approvedLinguistic==1) || (el.status==0 || el.status==false)){
						scriptUtils.notifyStatus({
							user: el.User,
							resource: el.Resource,
							message: message,
							messagesList: queriedMessages && queriedMessages.length>0 ? queriedMessages.map(function(messageEl){ return messageEl.message }) : null,
							status: el.status,

						});
					}

					return res.status(200).json({result: el});
				})
			}
			
		})
		.catch(function(err){
			return handleError(res, err);
		});
	}else{
		return res.status(401).send({message: messages.resources.access_permission})
	}
}

// Undo status
exports.setApprovedUndo = async function(req, res){
	var userExists = req.userExists;
	var scriptId = req.params.id;
	var prevData = req.body.data;


	// Only admins
	if (userExists && userExists.Role.type==consts.ADMIN_ROLE && scriptId){
		try{
			const item = await models.Script.scope('all').findOne({
				where: {
					id: {[Op.eq]: scriptId}
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
				res.status(403).send({message: messages.script.no_exist});
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
	
			redisClient.delWildcard(["RESOURCES::*", "SCRIPTS::*"]);
			return res.status(200).json({result: el});
			
		}catch(err){
			return handleError(res, err);
		}
	}

	return res.status(401).send({message: messages.scripts.access_permission})
	
}

//
//	Create Script
//
exports.create = function(req, res){	
	var resource = req.params.resource;
	var userExists = req.userExists;

	// Check AUTH
	if (userExists && resource){
		//
		//	Check form validation
		//
		const checkData = validate(req.body);
		
		if (scriptUtils.scriptsHasErrors(checkData.scripts) || checkData.accept_terms){
			return res.status(403).send({form_errors: checkData});
		}

		//
		//	Create script with everything prepared
		//	
		return upsertScript(req, res, userExists, userExists.Role.type);

	}else{
		return res.status(401).send({message: messages.script.create_permission})
	}
}

exports.createSingle = function(req, res){	
	var resource = req.params.resource;
	var script = req.params.script;
	var userExists = req.userExists;
	

	// Check AUTH
	if (userExists && (resource || script)){
		//
		//	Check form validation
		//
		const checkData = validateSingleScript(req.body);
		
		if (Object.keys(checkData).length != 0 && checkData.constructor === Object){
			return res.status(403).send({form_errors: checkData});
		}

		//
		//	Create script with everything prepared
		//
		return upsertSingle(req, res, userExists, userExists.Role.type);

	}else{
		return res.status(401).send({message: messages.script.create_permission})
	}
}

// Upsert multiple
async function upsertScript(req, res, user, userRole){

	// REMOVE KEYS FROM REDIS
	redisClient.delWildcard(["SCRIPTS::*", "RESOURCES::*"]);

	var itemsProcessed = 0;

	var notifyScripts = [];

	try{
		if(req.params.resource){

			const queriedResource = await models.Resource.scope('normal').findOne({
				where: {
					id: {[Op.eq]: req.params.resource}
				}
			});

			debug(req.body, "Upsert Scripts:");
			if(req.body.scripts && req.body.scripts.length>0){
				await Promise.all(req.body.scripts.map(async function(givenScript, idx){			

					// If a resource is given and this script has ID, then it is an update.
					// Else, add new one
					if (req.params.resource && givenScript.id){

						var setWhere = {};

						// If admin, is allowed to update any. 
						// If not, only update those that the user is the owner
						if(userRole == consts.ADMIN_ROLE){
							setWhere = {
								where: {
									id: {[Op.eq]: givenScript.id},
									resource_id: {[Op.eq]: req.params.resource}
								}
							}
						}else{
							setWhere = {
								where: {
									id: {[Op.eq]: givenScript.id},
									user_id: {[Op.eq]: user.id},
									resource_id: {[Op.eq]: req.params.resource}
								}
							}
						}

						//
						//	Get instance in order to update
						//
						const script = await models.Script.scope('active').findOne(setWhere)
						// 
						//	Update script
						//
						await script.updateAttributes({
							operation: givenScript.op_proposal,
							approved: user.Role.type==consts.ADMIN_ROLE ? script.approved : 0,
							approvedScientific: user.Role.type==consts.ADMIN_ROLE ? script.approvedScientific : 0,
							approvedLinguistic: user.Role.type==consts.ADMIN_ROLE ? script.approvedLinguistic : 0,
							accepted_terms: givenScript.accept_terms || 1,
						});

						debug("=== Updating script: "+idx+' ===');	 
						await script.setTerms(givenScript.terms.concat(givenScript.targets || []));
						await models.Script.addTags(script, models, givenScript.tags, dataUtil);

						notifyScripts.push(givenScript);

						debug("=== Creating file in script: "+idx+' ===');
						//debug("=== Script File: ",givenScript.file, " ===")
						var fileName = dataUtil.randomstr();

						// HANDLE FILE UPLOAD
						if ((!givenScript.file || givenScript.file.length==0)){
							removeFiles(script, queriedResource);
						}

						//
						//	Remove all files and insert new ones if there is no ID
						//		    
						if (givenScript.file && givenScript.file.data && givenScript.file.extension && !givenScript.file.id){
							removeFiles(script, queriedResource);

							//
							//	Save file to FileSys
							// req, res, folder, blob, name, ext, parentId
							dataUtil.saveFile(req, res, "scripts/"+queriedResource.dataValues.slug, givenScript.file.data, fileName, givenScript.file.extension);

							// Create new file and add reference
							const newFile = await models.File.create({
								name: fileName,
								extension: givenScript.file.extension
							});

							await script.addFile(newFile);
						}

						itemsProcessed++;
						debug("=== Processed items: "+itemsProcessed+' ===');
						debug("=== Scripts length: "+req.body.scripts.length+' ===');
						debug("=== Can finish?: "+itemsProcessed == req.body.scripts.length+' ===');

						if (itemsProcessed == req.body.scripts.length){
							debug('=== Finished updating ===');
							// Notify admins of new script
							await finishedAll(req, res, {
								user: user,
								scripts: notifyScripts,
								resource: req.params.resource
							});
						}

					}else if(req.params.resource){
						
						const script = await models.Script.create({
							operation: givenScript.op_proposal,
							user_id: user.id,
							resource_id: req.params.resource,
							approved: user.Role.type==consts.ADMIN_ROLE ? 1 : 0,
							approvedScientific: user.Role.type==consts.ADMIN_ROLE ? 1 : 0,
							approvedLinguistic: user.Role.type==consts.ADMIN_ROLE ? 1 : 0,
							accepted_terms: givenScript.accept_terms || 1,
						});

						debug(script, "CREATE NEW");
						await script.setTerms(givenScript.terms.concat(givenScript.targets || []));
						await models.Script.addTags(script, models, givenScript.tags, dataUtil);

		
						var fileToUpload = {};
						fileName = dataUtil.randomstr();

						// Save file?
						if (givenScript.file!=undefined && givenScript.file!=null && givenScript.file.name!=null && givenScript.file.extension!=null){
							fileToUpload = {
								name: fileName,
								extension: givenScript.file.extension				
							}
						}

						//
						//	Save file to FileSys
						//
						if (givenScript.file && givenScript.file.data && givenScript.file.extension){
							// Create new file and add reference
							const newFile = await models.File.create(fileToUpload)
							await script.addFile(newFile);

							// req, res, folder, blob, name, ext, parentId
							dataUtil.saveFile(req, res, "scripts/"+queriedResource.slug, givenScript.file.data, fileName, givenScript.file.extension);	
						}

						itemsProcessed++;
						notifyScripts.push(givenScript);

						if (itemsProcessed == req.body.scripts.length){
							// Notify admins of new script
							await finishedAll(req, res, {
								user: user,
								scripts: notifyScripts,
								resource: req.params.resource
							});
						}
					}			
				}));
			}else{
				return res.status(200).send({message: messages.scripts.created_uploaded});
			}
		}else{
			return res.status(403).send({message: messages.script.need_resource});		
		}
	}catch(err){
		debug("=== Error updating scripts: "+ err.message+ " ===")
		return handleError(res, err);
	}

	
}

// Upsert single
async function upsertSingle(req, res, user, userRole){

	// REMOVE KEYS FROM REDIS
	redisClient.delWildcard(["SCRIPTS::*", "RESOURCES::*"]);


	var fileName = dataUtil.randomstr();

	// If resource given, add new script
	if (req.params.resource){
		models.Resource.scope('all').findOne({
			where: {
				slug: {[Op.eq]: req.params.resource}
			}
		})
		.then(function(resourceItem){
			let resourceId = resourceItem.id;

			if(resourceId){
				var fileToUpload = {};

				// Save file?
				if (req.body.file!=undefined && req.body.file!=null && req.body.file.name!=null && req.body.file.extension!=null){
					fileToUpload = {
						name: fileName,
							extension: req.body.file.extension				
					}
				}		

				return models.Script.create({
						operation: req.body.op_proposal,
						user_id: user.id,
						resource_id: resourceId,
						approved: user.Role.type==consts.ADMIN_ROLE ? 1 : 0,
						approvedScientific: user.Role.type==consts.ADMIN_ROLE ? 1 : 0,
						approvedLinguistic: user.Role.type==consts.ADMIN_ROLE ? 1 : 0 
				}).then(async function(item){
					await item.setTerms(req.body.terms.concat(req.body.targets || []));
					await models.Script.addTags(item, models, req.body.tags, dataUtil);

						//
						//	Save file to FileSys
						//
						if (req.body.file && req.body.file.data && req.body.file.extension){
							// Create new file and add reference
							models.File.create(fileToUpload)
							.then(function(newFile){
								item.addFile(newFile);
							});

							// req, res, folder, blob, name, ext, parentId
							dataUtil.saveFile(req, res, "scripts/"+resourceItem.slug, req.body.file.data, fileName, req.body.file.extension);	
						}

						// Notify admins of new script
						scriptUtils.notify({
							user: user,
							script: {
								operation: item.operation
							},
							resource: {
								slug: req.params.resource,
								title: resourceItem.title
							}
						});
					})
					.then(function(){
						return res.status(200).send({message: messages.scripts.created_uploaded});
					})
					.catch(function(err){
						return handleError(res, err);
					});
			}else{
				return res.status(403).send({message: messages.script.need_resource});
			}

			//return res.status(200).send({message: messages.scripts.created_uploaded});
		})
		.catch(err => {
            return handleError(res, err);
		})

	// If script given, update
	}else if(req.params.script){
		var setWhere = {};

		// If admin, is allowed to update any. 
		// If not, only update those that the user is the owner
		if(userRole == consts.ADMIN_ROLE){
			setWhere = {
				where: {
					id: {[Op.eq]: req.params.script}
				}
			}
		}else{
			setWhere = {
				where: {
					id: {[Op.eq]: req.params.script},
					user_id: {[Op.eq]: user.id}
				}
			}
		}

		//
		//	Get instance in order to update
		//
		models.Script.scope('active').findOne(setWhere)
		.then(function(script){					    

			//
			//	Update script
			//
			return script.updateAttributes({
				operation: req.body.op_proposal,
				approved: user.Role.type==consts.ADMIN_ROLE ? 1 : 0,
				approvedScientific: user.Role.type==consts.ADMIN_ROLE ? 1 : 0,
				approvedLinguistic: user.Role.type==consts.ADMIN_ROLE ? 1 : 0
			}).then(async function(item){			 
				await item.setTerms(req.body.terms.concat(req.body.targets || []));

				await models.Script.addTags(item, models, req.body.tags, dataUtil);

				return {
					script,
					resource: models.Resource.scope('normal').findOne({
						include: [
							{
							model: models.Script,
							as: 'Scripts',
							required: false,
							where: {
								id: {[Op.eq]: item.id}
							}
						}
						]
					})
				};

			});
		})
		.then(function(data){
			// HANDLE FILE UPLOAD
			if ((!req.body.file || req.body.file.length==0)){
				removeFiles(data.script, data.resource);
			}

			//
			//	Remove all files and insert new ones if there is no ID
			//		    
			if (req.body.file && req.body.file.data && req.body.file.extension && !req.body.file.id){
				removeFiles(data.script, data.resource);

				//
				//	Save file to FileSys
				// req, res, folder, blob, name, ext, parentId
				dataUtil.saveFile(req, res, "scripts/"+data.resource.dataValues.slug, req.body.file.data, fileName, req.body.file.extension);

				// Create new file and add reference
				models.File.create({
					name: fileName,
					extension: req.body.file.extension
				})
				.then(function(newFile){
					data.script.addFile(newFile);
				});
			}
		})
		.then(function(){
			return res.status(200).send({message: messages.scripts.created_uploaded});
		})
		.catch(function(err){
			return handleError(res, err);
		});
	}

}

//
//	Delete single scripts
//
exports.delScript = function(req, res){
	var userExists = req.userExists;
	var scripts = req.body.scripts || [req.params.script] || null;
	var setWhere = {};

	// Check AUTH
	if (userExists && scripts){

		if (userExists.Role.type!=consts.ADMIN_ROLE){
			setWhere = {
				id: {
					[Op.in]: scripts
				},
				user_id:{[Op.eq]: userExists.id}
			}
		}else{
			setWhere = {
				id: {
					[Op.in]: scripts
				}
			}
		}

		// If no error, then destroy all
		models.Script.scope('all').destroy({
			where: setWhere
		})
		.then(() => {
			// REMOVE KEYS FROM REDIS
			redisClient.delWildcard(["SCRIPTS::*", "RESOURCES::*"]);

			return res.status(200).send({});
		})
		.catch(function(err){
			return handleError(res, err);
		});
		
	}else{
		return res.status(401).send({message: messages.script.del_permission});
	}
}

// Finished all scripts
async function finishedAll(req, res, data){
	debug('=== Starting finishedAll ===');
	// Only for non admins that are the author
	if (data.scripts && data.scripts.length>0 && (data.user.Role && data.user.Role.type != consts.ADMIN_ROLE)){
		debug('=== Finish ===');
		const resource = await models.Resource.scope('allStatusApprove').findOne({
			where: {
				id: {[Op.eq]: data.resource}
			}
		})
		if (resource){
			var finalData = {
				"user": data.user,
				"scripts": data.scripts,
				"resource": {
					"slug": resource.slug,
					"title": resource.title
				}
			};
			// Notify admins of new script
			scriptUtils.notify(finalData, true);
		}
	}
	res.status(200).send({message: messages.scripts.created_uploaded});
}

//
//	Remove a given resource files
//
function removeFiles(script, resource){
	// REMOVE KEYS FROM REDIS
	redisClient.delWildcard(["SCRIPTS::*"]);

	debug("=== Deleting files... ===")
	script.getFiles()
	.then(function(files){
		files.map(function(file){
			file.destroy();
			debug("=== Deleting file @: scripts/"+resource.dataValues.slug+"/"+file.name+"."+file.extension + " ===")

			//
			//	Delete physical files
			//
			//dataUtil.rmFile("scripts/"+resource.dataValues.slug, file.name+"."+file.extension);
		});
		script.setFiles([]);
	});
}


//
//	Needed exports
//
exports.upsertSingle = upsertSingle;