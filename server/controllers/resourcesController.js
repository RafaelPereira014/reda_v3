const models = require('../models/index');
const { handleError } = require('../utils/handler');
const SqlString = require('sequelize/lib/sql-string');
const config = require('../config/config.json');
const messages = require('../config/messages.json');
const dataUtil = require('../utils/dataManipulation');
const { debug, stripAllTags } = require('../utils/dataManipulation');
const resourcesUtils = require('../utils/controllers/resources');
const validate = require('../utils/validation/validateResources').validate;
const consts = require('../config/const');
const { redisClient, getAsync, makeKey } = require('../services/redis');
const Op = models.Sequelize.Op;





// Generic Includes
function initIncludes(){

	return [
		{ 
			model: models.Rating,
			required:false,
			attributes: []
		},
		{ 
			model: models.Image,
			required:false,
			as: "Thumbnail"
		},
		{ 
			model: models.Term,
			as: "Formats",
			required:false,
			attributes: ['id', 'title', 'slug', 'taxonomy_id', 'image_id', 'parent_id', 'type', 'color', 'icon'],
			through: {
				'attributes': []
			},
			include: [
				{
					required:false,
					model: models.Image
				},
				{
					model: models.Taxonomy,
					attributes: ['id', 'title', 'slug', 'locked', 'type_id'],
					where: {
						slug: {[Op.like]: '%formato%'}
					},
				}
			]
		}
	];
}

// Set resource as a highlight
exports.setHighlight = function(req, res){
	var userExists = req.userExists;
	var resourceId = req.params.id;

	if (userExists && resourceId && userExists.Role.type==consts.ADMIN_ROLE){
		models.Resource.scope(null).findOne({
			where: {
				id: {[Op.eq]: resourceId}
			}
		})
		.then(function(item){
			if (!item){
				res.status(403).send({message: messages.resource.no_exist});
				return
			}
			return item.updateAttributes({
				highlight: !item.highlight
			})
		})
		.then(function(item){
			return res.status(200).json({result: item});
		})
		.catch(function(err){
			return handleError(res, err, {message: messages.resource.save_error});
		});
	}else{
		return res.status(401).send({message: messages.resources.access_permission})
	}
}

// Set resource as a favorite
exports.setFavorite = function(req, res){
	var userExists = req.userExists;
	var resourceId = req.params.id;
	var includes = [];

	if (userExists && resourceId){
		includes = [
			{
				model: models.User,
				as: 'Favorites',
				required: false,
				where: {
					id: {[Op.eq]: userExists.id}
				},
				attributes: ["id"]
			}
		]

		models.Resource.scope(userExists && userExists.Role.type==consts.ADMIN_ROLE ? null : 'defaultScope').findOne({
			include: includes,
			where: {
				id: {[Op.eq]: resourceId}
			}
		})
		.then(function(item){
			if (!item){
				res.status(403).send({message: messages.resource.no_exist});
				return
			}

			if (item.Favorites.length==0){
				item.addFavorite(userExists.id);
			}else{
				item.removeFavorite(userExists.id);
			}

			return res.status(200).json({result: item});
		})
		.catch(function(err){
			return handleError(res, err);
		});
	}else{
		return res.status(401).send({message: messages.resources.access_permission})
	}
}

// Set rating
exports.setRating = function(req, res){
	var userExists = req.userExists;
	var resourceId = req.params.id;
	var rating = req.body.value;
	var includes = [];

	if (userExists && resourceId && rating){
		includes = [
			{
				model: models.User,
				required: true,
				where: {
					id: {[Op.eq]: userExists.id}
				},
				attributes: ["id"]
			},
			{
				model: models.Resource,
				required: true,
				where: {
					id: {[Op.eq]: resourceId}
				},
				attributes: ["id"]
			}
		]

		models.Rating.findOne({
			include: includes
		})
		.then(function(item){
			if (!item){
				return models.Rating.create({
					value: rating,
					resource_id: resourceId,
					user_id: userExists.id
				})
				.then(function(el){
					return res.status(200).json({result: el});
				})
			}else{
				return item.updateAttributes({
					value: rating
				})
				.then(function(el){
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

// Set status
exports.setApproved = function(req, res){
	var userExists = req.userExists;
	var resourceId = req.params.id;

	// Status
	var status = req.body.status;

	// Is there any justification message?
	var message = req.body.message || null;

	// Is there any extre messages?
	var messagesList = req.body.messagesList || [];

	// Only admins
	if (userExists && userExists.Role.type==consts.ADMIN_ROLE && resourceId && status!=null){
		models.Resource.scope('all').findOne({
			where: {
				id: {[Op.eq]: resourceId}
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
			debug("Approve resource:", item);
			if (!item){
				res.status(403).send({message: messages.resource.no_exist});
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
						resourcesUtils.notifyStatus({
							user: el.User,
							resource: el.title,
							message: message,
							messagesList: queriedMessages && queriedMessages.length>0 ? queriedMessages.map(function(messageEl){ return messageEl.message }) : null,
							status: el.status
						});
					}

					redisClient.delWildcard(["RESOURCES::*", "SCRIPTS::*"]);
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


exports.setHiddenUndo = function(req, res){
	var userExists = req.userExists;
	var resourceId = req.params.id;



	// Only admins
	if (userExists && userExists.Role.type==consts.ADMIN_ROLE && resourceId){
		models.Resource.scope('all').findOne({
			where: {
				id: {[Op.eq]: resourceId}
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
			debug("Approve resource:", item);
			if (!item){
				res.status(403).send({message: messages.resource.no_exist});
				return
			}

			debug(item.approvedScientific);

			// Reprove if status is false
			// Approve scientific if so and set status to false
			// Approve linguistic and set status to true if scientific was already approved
			// Approve for legacy if status is true and approved is false
			var updateAttributes = {};

			updateAttributes = {
				hidden: false

			}


			debug(updateAttributes);

			
			

			item.updateAttributes({
				hidden: 0
			})
			.then(() => {

				// REMOVE KEYS FROM REDIS
				redisClient.delWildcard(["RESOURCES::*"]);
			
				return res.status(200).send({});
			})
			.catch(err => {
				return handleError(res, err);
			}
			)
		})
	
	}else{
		return res.status(401).send({message: messages.resources.access_permission})
	}
}

// Undo status
exports.setApprovedUndo = async function(req, res){
	var userExists = req.userExists;
	var resourceId = req.params.id;
	var prevData = req.body.data;


	// Only admins
	if (userExists && userExists.Role.type==consts.ADMIN_ROLE && resourceId){
		try{
			const item = await models.Resource.scope('all').findOne({
				where: {
					id: {[Op.eq]: resourceId}
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
				res.status(403).send({message: messages.resource.no_exist});
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

	return res.status(401).send({message: messages.resources.access_permission})
	
}

//
//	Return generic lsit of resources
//
exports.list = function(req, res, next) {

	models.Resource.findAll({
		limit: config.limit,
		attributes: [  			
			'title', 
			'slug', 
			'description', 
			'highlight', 
			'exclusive', 
			'link',
			'embed',
			'status', 
			'created_at', 
			'updated_at',
			'user_id'
		]
	})
	.then(function(resources){
		return res.json({result: resources});
	}).catch(function(err){
		return next(err);
	})
};

//
//	Return a list of related
//
exports.related = async (req, res) => {
	debug("Getting related");
	var includes = initIncludes();

	var resourceSlug = req.params.slug;
	var limit = parseInt(req.query.limit) || 3;

	let scriptsTermsTitles = null;

	// SET RESOURCES LIST REDIS KEY
	let relatedRedisKey = makeKey("RESOURCES::RELATED", {
		resourceSlug,
		limit
	});

	//	Get data from REDIS if exists
	let relatedListRedisResult = await getAsync(relatedRedisKey);

	// If there are results to show from cache, just ditch all the other processing and go straight to fetch the data from cache
	if(!relatedListRedisResult){

		try{
			let termsTitleSetWhere = '';
			let tags = await models.sequelize.query(`SELECT Terms.id, Terms.title, Terms.slug from Terms
			INNER JOIN Taxonomies on Terms.taxonomy_id = Taxonomies.id
			INNER JOIN script_terms on Terms.id = script_terms.term_id
			INNER JOIN Scripts on script_terms.script_id = Scripts.id
			INNER JOIN Resources on Scripts.resource_id = Resources.id
			WHERE
				Resources.slug = :slug AND
				Taxonomies.slug = :tax AND
				Terms.deleted_at IS NULL AND
				Scripts.deleted_at IS NULL AND
				Resources.deleted_at IS NULL AND
				Taxonomies.deleted_at IS NULL`, 
					{
						replacements: {
							slug: resourceSlug,
							tax: 'tags_resources'
						},
						type: models.sequelize.QueryTypes.SELECT
					}
				);

			// Set the tags to search for
			if (tags.length>0){
				var i=0;

				// Build WHERE to search tags in tags, resource metadata, resource terms title and resource script terms title
				for(var tag of tags){
					if (i>0){
						termsTitleSetWhere += ' OR ';
					}
					termsTitleSetWhere+= ' SUM(Terms.title LIKE '+SqlString.escape("%"+tag.title+"%")+')';

					i++;
				}
			

				//  ======================================================================
				//  Get scripts with tags
				//  ======================================================================		
				if(termsTitleSetWhere!==''){
					scriptsTermsTitles = await models.sequelize.query(`SELECT Scripts.resource_id from reda_3.Scripts
					INNER JOIN script_terms on script_terms.script_id = Scripts.id
					INNER JOIN Terms on script_terms.term_id = Terms.id
					WHERE Scripts.deleted_at IS NULL AND Terms.deleted_at IS NULL
					GROUP BY Scripts.id
					HAVING
					${termsTitleSetWhere}
					ORDER BY Scripts.id
					LIMIT 0, :limit`, 
						{
							replacements: {
								limit
							},
							type: models.sequelize.QueryTypes.SELECT
						}
					);
				}
			}

			scriptsTermsTitles = scriptsTermsTitles ? scriptsTermsTitles.reduce( (acc, cur) => [cur.resource_id, ...acc], []) : [];

		}catch(err){
			return handleError(res, err);
		}
	}

	try{
		let resources = null;
		let shouldUpdate = false;
	
		//	Get list of all resources
		if(relatedListRedisResult){
			resources = JSON.parse(relatedListRedisResult);
		}else{
			//	Get related
			resources = await models.Resource.scope('defaultScope', 'resources').findAll({
				include: includes,
				limit: limit,
				where: {
					id: {
						[Op.in]: scriptsTermsTitles
					},
					slug: {
						[Op.not]: resourceSlug
					}
				},
				attributes: [
					'id',
					'title', 
					'slug', 
					'link',
					'embed',
					'description', 
					'highlight', 
					'exclusive', 
					'status', 
					'created_at', 
					'updated_at',
					'user_id',
					'image_id'
				],
			});
	
			/**
			 * Get taxonomies for selected rows
			 */		
			if(resources){		
	
				//	=================================================================
				//	Get metadata (terms and taxonomies)
				//	=================================================================
				// 	Get resources ids
				const resourcesIds = resources ? resources.reduce((acc, cur) => [cur.id, ...acc], []) : null;
	
				//	Query all scripts from DB to filter next
				let allScripts = await models.Script.findAll({
					where:{
						resource_id: {
							[Op.in]: resourcesIds
						}
					}
				});
	
				//	Get only scripts ids
				const scriptsIds = allScripts ? allScripts.reduce((acc, cur) => [cur.id, ...acc], []) : null;
	
				if (scriptsIds && scriptsIds.length>0){
					//	Prepare for querying
					let scripts = scriptsIds.reduce((acc, cur) => {
						let data = acc;
						if(data!==''){
							data+=',';
						}
	
						data+=cur;
	
						return data;
					}, '');
	
					//	Get metadata based on scripts
					let meta = await models.sequelize.query(`SELECT Terms.title as TermTitle,
					Terms.color as TermColor,
					Taxonomies.slug as TaxSlug,
					Scripts.id as ScriptId,
					Scripts.resource_id as ResourceId
					
					FROM 
						Terms
						INNER JOIN Taxonomies on (Terms.taxonomy_id = Taxonomies.id AND (
							Taxonomies.slug = 'macro_areas_resources' 
							OR 
							Taxonomies.slug = 'anos_resources'
							OR 
							Taxonomies.slug = 'areas_resources'
						))
						INNER JOIN script_terms on script_terms.term_id = Terms.id
						INNER JOIN Scripts on script_terms.script_id = Scripts.id
						WHERE script_terms.script_id IN (${scripts}) AND Terms.taxonomy_id = Taxonomies.id
						ORDER BY Taxonomies.id ASC, Terms.slug+0 ASC`, 
						{
							type: models.sequelize.QueryTypes.SELECT
						}
					);
	
					resources.map(async genericRow => {
						// If is a resource to show and doesn't have Taxonomies already
						if((!genericRow.hasOwnProperty("Metadata") || (genericRow.dataValues && !genericRow.dataValues.hasOwnProperty("Metadata")))){
	
							let finalMetaData = [];
							meta.map(row => {
								let curFinalEl = null;
	
								//	Is current term associated with this resource?
								if(row.ResourceId===genericRow.id){
	
									//	Check if taxonomy is already in object
									//	If not, create that property in final object
									if(!finalMetaData.some(curFinalRow => curFinalRow.taxonomy==row.TaxSlug)){
										finalMetaData.push({
											taxonomy: row.TaxSlug,
											Terms: []
										});						
									}
									//	Get taxonomy property
									curFinalEl = finalMetaData.find(curFinalRow => curFinalRow.taxonomy==row.TaxSlug);
	
									//	Check if term already exists
									if(!curFinalEl.Terms.find(term => term.title===row.TermTitle)){
										//	Add term
										curFinalEl.Terms.push({
											title: row.TermTitle,
											color: row.TermColor
										});
									}
									
								}					
							});
	
							if (genericRow.dataValues){
								genericRow.dataValues.Metadata = finalMetaData;
							}else{
								genericRow.Metadata = finalMetaData;
							}
							
							return genericRow;
	
						}
					});
				}
	
				//	=================================================================
				//	END TRYING
				//	=================================================================
	
			}	
			shouldUpdate = true;
		}
	
		//	Update key
		if (shouldUpdate){
			// Set redis key
			// SECONDS - MINUTES - HOURS - DAYS
			redisClient.set(relatedRedisKey, JSON.stringify(resources), 'EX', 60 * 60 * 24 * 2);
		}

		return res.status(200).json({
			total: resources.length,
			limit: limit,
			result: resources
		})
	}catch(err){
		return handleError(res, err);
	}

	
}

//
//	Return this month resources
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
		'link',
		'embed',
		'status', 
		'created_at', 
		'updated_at',
		'user_id',
		'image_id',
		'duration'
	]

	try{

		let resources = await models.Resource.scope('resources','all').findAndCountAll({
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

//
//	Return most recent resources
//
exports.recent = async (req, res) => {
	debug("Getting recent");
	// Check AUTH
	var userExists = req.userExists;

	var includes = initIncludes();

	// Set scope
	// RECENT - if no auth, show only not exclusive
	// RECENTGENERIC - if with auth, show all
	//var scope = userExists ? 'recent' : 'recentGeneric';

	var limit = parseInt(req.query.limit) || 8;

	var attributes = [
		'id',
		'title', 
		'slug', 
		'description', 
		'highlight', 
		'link',
		'embed',
		'exclusive', 
		'status', 
		'created_at', 
		'updated_at',
		'user_id',
		'image_id',
		'duration',
		'hidden',
		[models.sequelize.literal('(SELECT AVG(value) FROM Ratings WHERE Ratings.resource_id = Resource.id)'), 'ratingAvg']
	]

	if (userExists){
		attributes.push(
			[models.sequelize.literal('(SELECT IF(ISNULL(resource_favorites.resource_id),0,1) FROM resource_favorites LEFT JOIN Users on Users.id = resource_favorites.user_id WHERE resource_favorites.resource_id = Resource.id AND resource_favorites.user_id='+userExists.id+' LIMIT 1)'), 'isFavorite']
		)
	}

	try{

		let resources = await models.Resource.scope('resources','recent').findAll({
			group: ['Resource.id'],
			where: {
				hidden: {[Op.eq]: 0}
			},
			include: includes,
			limit: limit,
			attributes: attributes
		});

		/**
		 * Get taxonomies for selected rows
		 */		
		if(resources){		

			//	=================================================================
			//	Get metadata (terms and taxonomies)
			//	=================================================================
			// 	Get resources ids
			const resourcesIds = resources ? resources.reduce((acc, cur) => [cur.id, ...acc], []) : null;

			//	Query all scripts from DB to filter next
			let allScripts = await models.Script.findAll({
				where:{
					resource_id: {
						[Op.in]: resourcesIds
					}
				}
			});

			//	Get only scripts ids
			const scriptsIds = allScripts ? allScripts.reduce((acc, cur) => [cur.id, ...acc], []) : null;

			if (scriptsIds && scriptsIds.length>0){
				//	Prepare for querying
				let scripts = scriptsIds.reduce((acc, cur) => {
					let data = acc;
					if(data!==''){
						data+=',';
					}

					data+=cur;

					return data;
				}, '');

				//	Get metadata based on scripts
				let meta = await models.sequelize.query(`SELECT Terms.title as TermTitle,
				Terms.color as TermColor,
				Taxonomies.slug as TaxSlug,
				Scripts.id as ScriptId,
				Scripts.resource_id as ResourceId
				
				FROM 
					Terms
					INNER JOIN Taxonomies on (Terms.taxonomy_id = Taxonomies.id AND (
						Taxonomies.slug = 'macro_areas_resources' 
						OR 
						Taxonomies.slug = 'anos_resources'
						OR 
						Taxonomies.slug = 'areas_resources'
					))
					INNER JOIN script_terms on script_terms.term_id = Terms.id
					INNER JOIN Scripts on script_terms.script_id = Scripts.id
					WHERE script_terms.script_id IN (${scripts}) AND Terms.taxonomy_id = Taxonomies.id
					ORDER BY Taxonomies.id ASC, Terms.slug+0 ASC`, 
					{
						type: models.sequelize.QueryTypes.SELECT
					}
				);

				resources.map(async genericRow => {
					// If is a resource to show and doesn't have Taxonomies already
					if((!genericRow.hasOwnProperty("Metadata") || (genericRow.dataValues && !genericRow.dataValues.hasOwnProperty("Metadata")))){

						let finalMetaData = [];
						meta.map(row => {
							let curFinalEl = null;

							//	Is current term associated with this resource?
							if(row.ResourceId===genericRow.id){

								//	Check if taxonomy is already in object
								//	If not, create that property in final object
								if(!finalMetaData.some(curFinalRow => curFinalRow.taxonomy==row.TaxSlug)){
									finalMetaData.push({
										taxonomy: row.TaxSlug,
										Terms: []
									});						
								}

								//	Get taxonomy property
								curFinalEl = finalMetaData.find(curFinalRow => curFinalRow.taxonomy==row.TaxSlug);

								//	Check if term already exists
								if(!curFinalEl.Terms.find(term => term.title===row.TermTitle)){
									//	Add term
									curFinalEl.Terms.push({
										title: row.TermTitle,
										color: row.TermColor
									});
								}
								
							}					
						});

						if (genericRow.dataValues){
							genericRow.dataValues.Metadata = finalMetaData;
						}else{
							genericRow.Metadata = finalMetaData;
						}
						
						return genericRow;

					}
				});
			}

			//	=================================================================
			//	END TRYING
			//	=================================================================

		}

		return res.status(200).json({result: resources});
	}catch(err){
		return handleError(res, err);
	}
}

//
//	List of Resources that are highlights
//
exports.highlight = function(req, res, next){
	var includes = initIncludes();
	models.Resource.scope('resources','highlight').findAll({
		include: includes,
		attributes: [
			'id',
			'title', 
			'slug', 
			'description', 
			'highlight', 
			'exclusive', 
			'link',
			'embed',
			'status', 
			'created_at', 
			'updated_at',
			'user_id',
			'image_id',
			[models.sequelize.literal('(SELECT AVG(value) FROM Ratings WHERE Ratings.resource_id = Resource.id)'), 'ratingAvg']
		],
		limit: 8,
		offset: 0
	})
	.then(function(resources){
		return res.json({result: resources});
	}).catch(function(err){
		return next(err);
	})
}

//
//	Return list of searched resources
//
exports.searchWord = async function(req, res){

	const tag = req.params.tag || null;





	const fetchDataAndFindAll = async () => {
		try {
		  const response = await fetch('http://localhost:3005/search/'+tag);
		  if (!response.ok) {
			throw new Error('Request failed');
		  }
		  const data = await response.json();
		  console.log(data.length);
	
		  // Perform Sequelize query
		  const result = await models.Resource.findAll({
			where: {
			  id: {
				[Op.in]: data
			  }
			}
		  });
		  return res.status(200).json({result});
		 


		} catch (error) {
		  console.log('Error:', error);
		}
	  };
	  
	  // Usage
	  fetchDataAndFindAll();


}


exports.search = async function(req, res){
	// Check AUTH
	var userExists = req.userExists;

	// Includes all
	var includeAll = true;

	// Start Includes and literals
	var includes = [];
	var literals = [];

	// Where options
	var setWhere = "";
	let termsSetWhere = '';
	let termsSetWhereAnos = '';
	let termsSetWhereDisciplinas = '';
	let termsSetWheredominios = '';
	let termsSetWhereSubdominios = '';
	let termsSetWhereConceitos = '';
	let termsTitleSetWhere = '';
	let recTitleSetWhere = '';



	
	// Options from queryString
	var limit = parseInt(req.query.limit) || config.limit;
	var page = parseInt(req.query.activePage) || 1;
	var terms = req.query.terms || [];
	var tags = req.query.tags || [];
	var approval = req.query.approval || null;
	var order = dataUtil.extractOrder(req.query.order, models) || null;
	let disciplinas = [];
	let dominios = [];
	let subdominios = [];
	let conceitos = [];
	var resourcesType = req.query.type || null;


	if(typeof terms !== 'undefined' && terms.length > 0){

	
	disciplinas = await models.sequelize.query(`SELECT id FROM Terms where id in(${terms}) and taxonomy_id = 7 AND deleted_at IS NULL`, 
		{
			type: models.sequelize.QueryTypes.SELECT
		}
	);
	dominios = await models.sequelize.query(`SELECT id FROM Terms where id in(${terms}) and taxonomy_id = 8 AND deleted_at IS NULL`, 
	{
		type: models.sequelize.QueryTypes.SELECT
	}
	);

	subdominios = await models.sequelize.query(`SELECT id FROM Terms where id in(${terms}) and taxonomy_id = 21 AND deleted_at IS NULL`,
	{
		type: models.sequelize.QueryTypes.SELECT
	}
	);

	conceitos = await models.sequelize.query(`SELECT id FROM Terms where id in(${terms}) and taxonomy_id = 22 AND deleted_at IS NULL`,
	{
		type: models.sequelize.QueryTypes.SELECT
	}
	);


}

	disciplinas = disciplinas ? disciplinas.reduce( (acc, cur) => [cur.id, ...acc], []) : [];
	
	dominios = dominios ? dominios.reduce( (acc, cur) => [cur.id, ...acc], []) : [];

	subdominios = subdominios ? subdominios.reduce( (acc, cur) => [cur.id, ...acc], []) : [];

	conceitos = conceitos ? conceitos.reduce( (acc, cur) => [cur.id, ...acc], []) : [];


	// Check if there is a type of resources (if admin, or personal resources, etc)

	// SET RESOURCES LIST REDIS KEY
	let resourcesListRedisKey = makeKey("RESOURCES::SEARCH", {
		terms,
		tags,
		order: req.query.order,
		resourcesType,
		approval,
		limit,
		page
	});

	//	Get data from REDIS if exists
	let resourcesListRedisResult = await getAsync(resourcesListRedisKey);

	// If there are results to show from cache, just ditch all the other processing and go straight to fetch the data from cache
	if(!resourcesListRedisResult){

		// Start includes
		includes.push(
			{ 
				model: models.Image,
				required:false,
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
				required:false,
			},	
		);

		// Set the tags to search for
		if (tags.length>0 || terms.length>0){
            setWhere += '(';
			if(tags.length>0){
				// Search terms title in scripts
				termsTitleSetWhere += '(';

				// Search title in resources
				recTitleSetWhere += '(';
			}

			var i=0;

			// Build WHERE to search tags in tags, resource metadata, resource terms title and resource script terms title
			for(var tag of tags){
				if (i>0){
					termsTitleSetWhere += ' AND ';
					recTitleSetWhere += ' AND ';
				}
				termsTitleSetWhere+= ' SUM(Terms.title LIKE '+SqlString.escape("%"+tag+"%")+')';
				recTitleSetWhere+= ' Resources.title LIKE '+SqlString.escape("%"+tag+"%");

				i++;
			}	

			if(tags.length>0){
				termsTitleSetWhere += ')';		
				recTitleSetWhere += ')';		
			}

			// TERMS ARE NOW SEARCHABLE AT THE SCRIPTS TERMS AND RESOURCE TERMS ALSO
			if(terms.length>0){


				let anos = terms.filter( function( el ) {

					return disciplinas.indexOf( parseInt(el) ) < 0 ;
				  } );
				  console.log("anos-> "+anos)

				  let anos2 = anos.filter( function( el ) {

					return dominios.indexOf( parseInt(el) ) < 0 ;
				  } );


				  console.log(anos2)
				let iterableAnos = 0;
				console.warn("################################")
				console.warn("anos: "+anos2)
				for(var ano of anos2){
					
					if(iterableAnos>0){
						termsSetWhere += ' OR '
					}
					termsSetWhere += ' SUM(Terms.id = '+parseInt(ano)+')';
					iterableAnos++;
				}


				if(disciplinas.length>0){
					console.warn("disciplinas: "+disciplinas)

					let iterableDisciplinas = 0;
					for(var disciplina of disciplinas){
						if(iterableDisciplinas>0){
							termsSetWhereDisciplinas += ' OR '
						}
						termsSetWhereDisciplinas += ' SUM(Terms.id = '+parseInt(disciplina)+')';
						iterableDisciplinas++;
					}

				}

				if(dominios.length>0){

					console.warn("dominios: "+dominios)

					let iterabledominios = 0;
					for(var dominio of dominios){
						if(iterabledominios>0){
							termsSetWheredominios += ' OR '
						}
						termsSetWheredominios += ' SUM(Terms.id = '+parseInt(dominio)+')';
						iterabledominios++;
					}

				}

				if(subdominios.length>0){
					
					console.warn("subdominios: "+subdominios)

					let iterableSubdominios = 0;
					for(var subdominio of subdominios){
						if(iterableSubdominios>0){
							termsSetWhereSubdominios += ' OR '
						}
						termsSetWhereSubdominios += ' SUM(Terms.id = '+parseInt(subdominio)+')';
						iterableSubdominios++;
					}
				}

				if(conceitos.length>0){
					
					console.warn("conceitos: "+conceitos)

					let iterableConceitos = 0;
					for(var conceito of conceitos){
						if(iterableConceitos>0){
							termsSetWhereConceitos += ' OR '
						}
						termsSetWhereConceitos += ' SUM(Terms.id = '+parseInt(conceito)+')';
						iterableConceitos++;
					}

				}
				
			
				}	

				



			try{
				//  ======================================================================
				//  Get resources with tags in title
				//  ======================================================================	
				let resourceTitles = null;	
				let redisResult = null;
				if(recTitleSetWhere!==''){			
					//	Get data from REDIS if exists
					let resourceTitlesRedisKey = makeKey("RESOURCES::SEARCH::RESOURCE_TITLES", {
						tags
					});
					redisResult = await getAsync(resourceTitlesRedisKey);

					//	Get list of all resources
					if(redisResult){
						resourceTitles = JSON.parse(redisResult);
						resourceTitles = resourceTitles.rows;
								
					}else{
						resourceTitles = await models.sequelize.query(`SELECT Resources.id from reda_3.Resources
						WHERE Resources.deleted_at IS NULL AND ${recTitleSetWhere}
						ORDER BY Resources.id`, 
							{
								type: models.sequelize.QueryTypes.SELECT
							}
						);

						redisClient.set(resourceTitlesRedisKey, JSON.stringify({rows: resourceTitles}), 'EX', 60 * 60 * 24 * 2);
					}

					resourceTitles = resourceTitles ? resourceTitles.reduce( (acc, cur) => [cur.id, ...acc], []) : [];

					// Add resources IDs to where clause of main query
					if(resourceTitles && resourceTitles.length>0){
						setWhere+= `Resource.id IN (${resourceTitles})`;
					}
				}

				//  ======================================================================
				//  Get scripts with tags
				//  ======================================================================	
				let scriptsTermsTitles = null;	
				redisResult = null;
				if(termsTitleSetWhere!==''){			
					//	Get data from REDIS if exists
					let scriptTermsTitlesRedisKey = makeKey("RESOURCES::SEARCH::SCRIPTS_TAGS", {
						tags
					});
					redisResult = await getAsync(scriptTermsTitlesRedisKey);

					//	Get list of all resources
					if(redisResult){
						scriptsTermsTitles = JSON.parse(redisResult);
						scriptsTermsTitles = scriptsTermsTitles.rows;
								
					}else{
						scriptsTermsTitles = await models.sequelize.query(`SELECT Scripts.resource_id from reda_3.Scripts
						INNER JOIN script_terms on script_terms.script_id = Scripts.id
						INNER JOIN Terms on script_terms.term_id = Terms.id
						WHERE Scripts.deleted_at IS NULL AND Terms.deleted_at IS NULL
						GROUP BY Scripts.id
						HAVING
						${termsTitleSetWhere}
						ORDER BY Scripts.id`, 
							{
								type: models.sequelize.QueryTypes.SELECT
							}
						);

						redisClient.set(scriptTermsTitlesRedisKey, JSON.stringify({rows: scriptsTermsTitles}), 'EX', 60 * 60 * 24 * 2);
					}

					scriptsTermsTitles = scriptsTermsTitles ? scriptsTermsTitles.reduce( (acc, cur) => [cur.resource_id, ...acc], []) : [];

					// Add resources IDs to where clause of main query
					if(scriptsTermsTitles.length>0){
						if(resourceTitles && resourceTitles.length>0){
							setWhere += ' OR ('
						}
						/* if (setWhere.length>0){
							setWhere += ' AND ';
						} */
						setWhere+= `Resource.id IN (${scriptsTermsTitles})`;
					}
					// setWhere += ')';
				}

				//  ======================================================================
				//  Get scripts with terms
				//  ======================================================================
				let scripts = null;
				redisResult = null;
				// let resources = null; 
				if(termsSetWhere!=='' || termsSetWhereDisciplinas !==''){
					//	Get data from REDIS if exists
					let scriptTermsRedisKey = makeKey("RESOURCES::SEARCH::SCRIPTS_TERMS", {
						terms					
					});
					redisResult = await getAsync(scriptTermsRedisKey);				

					//	Get list of all resources
					if(redisResult){
						scripts = JSON.parse(redisResult);
						scripts = scripts.rows;
								
					}else{
						

						if(termsSetWhereDisciplinas == ''){
							termsSetWhereDisciplinas = 'SUM(Terms.id IS NOT NULL)'
						}

						if(termsSetWheredominios == ''){
							termsSetWheredominios = 'SUM(Terms.id IS NOT NULL)'
						}

						if(termsSetWhereSubdominios == ''){
							termsSetWhereSubdominios = 'SUM(Terms.id IS NOT NULL)'
						}

						console.warn("$$$$$$$$AQUI$$$$$$$$")
						console.warn(termsSetWhereDisciplinas)
						console.warn(termsSetWheredominios)
						console.warn(termsSetWhereSubdominios)
						console.warn(termsSetWhereConceitos)



						if(termsSetWhere == ''){
							termsSetWhere = 'SUM(Terms.id IS NOT NULL)'
						}
						scripts = await models.sequelize.query(`SELECT Scripts.resource_id from reda_3.Scripts
						INNER JOIN script_terms on script_terms.script_id = Scripts.id
						INNER JOIN Terms on script_terms.term_id = Terms.id
						WHERE Scripts.deleted_at IS NULL AND Terms.deleted_at IS NULL
						GROUP BY Scripts.id
						HAVING
						(${termsSetWhere}) AND (${termsSetWhereDisciplinas}) AND (${termsSetWheredominios}) AND (${termsSetWhereSubdominios})
						ORDER BY Scripts.id`, 
							{
								type: models.sequelize.QueryTypes.SELECT
							}
						);


						
						/*scripts = await models.sequelize.query(`SELECT Scripts.resource_id from reda_3.Scripts
						INNER JOIN script_terms on script_terms.script_id = Scripts.id
						INNER JOIN Terms on script_terms.term_id = Terms.id
						WHERE Scripts.deleted_at IS NULL AND Terms.deleted_at IS NULL
						GROUP BY Scripts.id
						HAVING
						${termsSetWhereAnos}
						ORDER BY Scripts.id`, 
							{
								type: models.sequelize.QueryTypes.SELECT
							}
						);*/




						redisClient.set(scriptTermsRedisKey, JSON.stringify({rows: scripts}), 'EX', 60 * 60 * 24 * 2);

					}
					scripts = scripts ? scripts.reduce( (acc, cur) => [cur.resource_id, ...acc], []) : [];

				/*console.warn("Dominios: "+ dominios)
					console.warn("##############################################################################################################")
					console.warn("##############################################################################################################")
					console.warn("##############################################################################################################")
*/
					//scriptsDisciplinas = scriptsDisciplinas ? scriptsDisciplinas.reduce( (acc, cur) => [cur.resource_id, ...acc], []) : [];

					//console.warn(scriptsDisciplinas)
					// Add resources IDs to where clause of main query
					if(scripts.length>0){
						//	If has resources with title and has scripts OR
						//	Has resources scripts
						if((resourceTitles && resourceTitles.length>0 && scriptsTermsTitles && scriptsTermsTitles.length>0) || 
							(scriptsTermsTitles && scriptsTermsTitles.length>0)
						){
							setWhere += ' AND ';

						//	If has resources with title and has NO scripts
						}else if(resourceTitles && resourceTitles.length>0 && scriptsTermsTitles && scriptsTermsTitles.length==0){
							setWhere += ' OR (';
						}
						//AQUUIIII 333333

							setWhere+= `Resource.id IN (${scripts})`;

						
					}
				}

				//	Close block
				if(((scriptsTermsTitles && scriptsTermsTitles.length>0) || (scripts && scripts.length>0)) && (resourceTitles && resourceTitles.length>0)){
					setWhere += ')';
				}

				// Set to null of nothing was found with a given search
				if(((scripts && scripts.length==0 && scriptsTermsTitles && scriptsTermsTitles.length==0) || 
					(scripts && scripts.length==0 && !scriptsTermsTitles) || 
					(scriptsTermsTitles && scriptsTermsTitles.length==0 && !scripts)) && 
					(resourceTitles && resourceTitles.length==0)
				){
					// problem?? search tags??
					/*if (setWhere.length>0){
						setWhere += ' AND ';
					}	*/
					setWhere+= `Resource.id IS NULL`;
				}

			}catch(err){
				return handleError(res, err);
            }	
            
            setWhere += ')';

			if(setWhere==='()'){
				setWhere= `Resource.id IS NULL`;
			}
		}

		// Dashboard resources types
		if (resourcesType){
			switch(resourcesType){
				case 'myresources':
					if (!userExists){
						return res.status(401).send({message: messages.resources.access_permission})
					}

					// Set literally
					if (setWhere.length>0){
						setWhere += ' AND ';
					}
					setWhere += "Resource.user_id = "+userExists.id;
					setWhere += " AND (Resource.status = false OR Resource.status = true)";
				break;
				case 'resourceswithmyscripts':
					if (!userExists){
						return res.status(401).send({message: messages.resources.access_permission})
					}
					includes.push(
						{
							model: models.Script,
							as: 'Scripts',
							attributes: ['id', 'resource_id'],
							required: true,
							where: {
								user_id: {[Op.eq]: userExists.id}
							}
						}
					)

					setWhere += "Resource.status = true";

					includeAll = false;
					
				break;
				case 'pending':
					if (!userExists || userExists.Role.type!=consts.ADMIN_ROLE){
						return res.status(401).send({message: messages.resources.access_permission})
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
				case 'hidden':
					/*
					if (!userExists || userExists.Role.type!=consts.ADMIN_ROLE){
						return res.status(401).send({message: messages.resources.access_permission})
					}*/
					// Set literally
					if (setWhere.length>0){
						setWhere += ' AND ';
					}
					setWhere += "Resource.hidden = true";

					console.warn("setWhere hidden")
					console.warn(setWhere)

					break;

				case 'myfavorites':
					if (!userExists){
						return res.status(401).send({message: messages.resources.access_permission})
					}
					includes.push(
						{
							model: models.User,
							as: 'Favorites',
							attributes: ['id'],
							/* through: {
								attributes: []
							}, */
							required: true,
							where: {
								id: {[Op.eq]: userExists.id}
							}
						}
					)
				break;
			}
		}

		// Is there any reference to the status? If not, set only those that are approved
		if (setWhere.indexOf("Resource.status = true")<0 && setWhere.indexOf("Resource.status = false")<0){
			if (setWhere.length>0){
				setWhere += " AND ";
			}
			if(resourcesType == null){

			

			setWhere += "Resource.status = true AND Resource.approved = 1 AND Resource.approvedScientific=1 AND Resource.approvedLinguistic=1 AND Resource.hidden = false";
			}else{
				setWhere += "Resource.status = true AND Resource.approved = 1 AND Resource.approvedScientific=1 AND Resource.approvedLinguistic=1";
			}
		}
		//console.warn("setWhere primeiro")

		// Since right now, all where clauses are strings, must assign as literal to sequelize recognize
		if (setWhere.length>0){
			setWhere = models.Sequelize.literal(setWhere);
		}


		// Set includes
		// SET REQUIRED FALSE in order to avoid INNERJOIN. Good when there is no value to search for and avoid filtering
		// Since there is a need to disable subqueries due to the use of LIMIT, required must be TRUE
		if (includeAll){

			includes.push({
				model: models.Term,
				as: "Formats",
				required: true,
				include: [
					{
						model: models.Taxonomy,
						attributes: ['id', 'title', 'slug', 'locked', 'type_id'],
						where: {
							slug: {
								[Op.eq]: 'formato_resources'
							}
						},
					},
					{
						model: models.Image,
						required: false
					}
				]
			});
		}	
		

		/* if(resourcesType!=='resourceswithmyscripts' || terms.length>0 || tags.length>0){
			includes.push({
				model: models.Script,
				as: 'Scripts',
				attributes: ['id'],
				required:false
			})
		} */

		// Start literals
		// 
		// 	MUST REFER TO as Resource.id IN ORDER TO THE SYSTEM UNDERSTAND THAT THE QUERY REFERS TO THE
		// 	CURRENT RESOURCE FROM EACH ITERATION
		// 
		literals.push(
			[models.sequelize.literal('(SELECT AVG(value) FROM Ratings WHERE Ratings.resource_id = Resource.id)'), 'ratingAvg']			
		);

		// If user exists, check if is favorite
		if (userExists){
			literals.push(
				[models.sequelize.literal('(SELECT IF(ISNULL(resource_favorites.resource_id),0,1) FROM resource_favorites LEFT JOIN Users on Users.id = resource_favorites.user_id WHERE resource_favorites.resource_id = Resource.id AND resource_favorites.user_id='+userExists.id+' LIMIT 1)'), 'isFavorite']
			);

			if (userExists.Role.type==consts.ADMIN_ROLE){
				literals.push(
					[models.sequelize.literal('(SELECT COUNT(*) FROM Contacts WHERE Contacts.resource_id = Resource.id AND deleted_at IS NOT NULL)'), 'didContact']
				);
			}
		}

		//  ======================================================================
		//  Query resources
		//  ======================================================================
		var attributes = [
			'id',
			'title', 
			'slug', 
			'embed',
			'link',
			'description', 
			'highlight', 
			'exclusive', 
			'duration',
			'status', 
			'approved',
			'approvedScientific',
			'approvedLinguistic',
			'created_at', 
			'updated_at',
			'user_id',
			'image_id'
		];

		var queryOptions = {
			distinct: true,
			attributes: attributes.concat(literals),
			include: includes,
			limit: limit,
			offset: ((page-1)*limit),
			where: setWhere,
			order: [order]
		}

		if (includeAll){
			queryOptions.subQuery = false;
		}
	}

	try{
		let data = null;
		let resources = null;
		let shouldUpdate = false;

		//	Get list of all resources
		if(resourcesListRedisResult){
			resources = JSON.parse(resourcesListRedisResult);
		}else{
			//console.warn(queryOptions)
			resources = await models.Resource.scope('defaultScope', 'resources').findAndCountAll(queryOptions);
			shouldUpdate = true;
		}

		// Filter for those that are to show
		let rows = resources.rows;

		/**
		 * Get taxonomies for selected rows
		 */		

		if(rows){		

			//	=================================================================
			//	Get metadata (terms and taxonomies)
			//	=================================================================
			// 	Get resources ids
			const resourcesIds = rows ? rows.reduce((acc, cur) => [cur.id, ...acc], []) : null;

			//	Query all scripts from DB to filter next
			let allScripts = await models.Script.findAll({
				where:{
					resource_id: {
						[Op.in]: resourcesIds
					}
				}
			});

			//	Get only scripts ids
			const scriptsIds = allScripts ? allScripts.reduce((acc, cur) => [cur.id, ...acc], []) : null;

			if (scriptsIds && scriptsIds.length>0){
				//	Prepare for querying
				let scripts = scriptsIds.reduce((acc, cur) => {
					let data = acc;
					if(data!==''){
						data+=',';
					}

					data+=cur;

					return data;
				}, '');

				//	Get metadata based on scripts
				let meta = await models.sequelize.query(`SELECT Terms.title as TermTitle,
				Terms.color as TermColor,
				Taxonomies.slug as TaxSlug,
				Scripts.id as ScriptId,
				Scripts.resource_id as ResourceId
				
				FROM 
					Terms
					INNER JOIN Taxonomies on (Terms.taxonomy_id = Taxonomies.id AND (
						Taxonomies.slug = 'macro_areas_resources' 
						OR 
						Taxonomies.slug = 'anos_resources'
						OR 
						Taxonomies.slug = 'areas_resources'
					))
					INNER JOIN script_terms on script_terms.term_id = Terms.id
					INNER JOIN Scripts on script_terms.script_id = Scripts.id
					WHERE script_terms.script_id IN (${scripts}) AND Terms.taxonomy_id = Taxonomies.id
					ORDER BY Taxonomies.id ASC, Terms.slug+0 ASC`, 
					{
						type: models.sequelize.QueryTypes.SELECT
					}
				);

				resources.rows.map(async genericRow => {
					// If is a resource to show and doesn't have Taxonomies already
					if((!genericRow.hasOwnProperty("Metadata") || (genericRow.dataValues && !genericRow.dataValues.hasOwnProperty("Metadata")))){

						let finalMetaData = [];
						meta.map(row => {
							let curFinalEl = null;

							//	Is current term associated with this resource?
							if(row.ResourceId===genericRow.id){

								//	Check if taxonomy is already in object
								//	If not, create that property in final object
								if(!finalMetaData.some(curFinalRow => curFinalRow.taxonomy==row.TaxSlug)){
									finalMetaData.push({
										taxonomy: row.TaxSlug,
										Terms: []
									});						
								}

								//	Get taxonomy property
								curFinalEl = finalMetaData.find(curFinalRow => curFinalRow.taxonomy==row.TaxSlug);

								//	Check if term already exists
								if(!curFinalEl.Terms.find(term => term.title===row.TermTitle)){
									//	Add term
									curFinalEl.Terms.push({
										title: row.TermTitle,
										color: row.TermColor
									});
								}
								
							}					
						});

						if (genericRow.dataValues){
							genericRow.dataValues.Metadata = finalMetaData;
						}else{
							genericRow.Metadata = finalMetaData;
						}

						shouldUpdate = true;
						
						return genericRow;

					}
				});
			}

			//	=================================================================
			//	END TRYING
			//	=================================================================

		}

		data = {
			count: resources.count, 
			rows: resources.rows
		};
	
		//	Update key
		if (shouldUpdate){
			// Set redis key
			// SECONDS - MINUTES - HOURS - DAYS
			redisClient.set(resourcesListRedisKey, JSON.stringify(data), 'EX', 60 * 60 * 24 * 2);
		}
		/*console.warn(setWhere)
		console.warn(termsSetWhere)
		console.warn(termsTitleSetWhere)
		console.warn(recTitleSetWhere)*/
		// Return final object
		return res.json({
			page,
			totalPages: Math.ceil(data.count/limit),
			limit,
			count: rows.length,
			total: data.count, 
			result: rows
		});

		

	}catch(err){

		return handleError(res, err);
	}

}

//
//	Get details from resource
//
exports.details = function(req, res){
	debug("Getting details");

	/* var getAll = req.query.all || null; */

	var slug = req.params.slug;
	var includes = initIncludes();

	// Check AUTH
	var userExists = req.userExists;

	// Duplicate includes
	var detailsIncludes = includes.slice(0);

	if (userExists){
		detailsIncludes.push(
			{ 
				model: models.User,
				required: false,
				as: 'Favorites',
				where: {
					id: {[Op.eq]: userExists.id}
				},
				attributes: ["id"],
				through: {
					attributes: []
				}
			}
		);
	}

	// Set includes
	detailsIncludes.push(
		{
			model: models.File,
			required: false
		},
		{
			model: models.Script,
			required: false,
			as: 'Scripts',
			where: {
				main: true
			},
			include: [
				{
					model: models.File,
					required: false
				},
			]
		}
	);

	if (userExists && userExists.Role && userExists.Role.type==consts.ADMIN_ROLE){
		detailsIncludes.push(
			{
				model: models.User,
				required: false,
				paranoid:false,
				attributes: [
					'name',
					"organization",
					"email", 
					"hidden"
				],
			}
		);
	}else{
		detailsIncludes.push(
			{
				model: models.User,
				required: false,
				attributes: [
					[models.sequelize.literal('IF(User.hidden=1,null,User.name)'), 'name'],
					"organization",
					"email", 
					"hidden"
				],
			}
		);
	}

	// Start literals
	// 
	// 	MUST REFER TO as Resource.id IN ORDER TO THE SYSTEM UNDERSTAND THAT THE QUERY REFERS TO THE
	// 	CURRENT RESOURCE FROM EACH ITERATION
	// 
	var literals = [
		[models.sequelize.literal('(SELECT AVG(value) FROM Ratings WHERE Ratings.resource_id = Resource.id)'), 'ratingAvg'],
		[models.sequelize.literal('(SELECT COUNT(*) FROM Ratings WHERE Ratings.resource_id = Resource.id)'), 'ratingUsers']
	];

	// If user exists, check if is favorite
	if (userExists){
		literals.push(
			[models.sequelize.literal('(SELECT IF(ISNULL(resource_favorites.resource_id),0,1) FROM resource_favorites LEFT JOIN Users on Users.id = resource_favorites.user_id WHERE resource_favorites.resource_id = Resource.id AND resource_favorites.user_id='+userExists.id+' LIMIT 1)'), 'isFavorite']
		)

		if (userExists.Role.type==consts.ADMIN_ROLE){
			literals.push(
				[models.sequelize.literal('(SELECT IF(COUNT(*) > 0, 1, 0) FROM Contacts WHERE Contacts.resource_id = Resource.id AND deleted_at IS NOT NULL)'), 'didContact']
			);
		}
	}

	models.Resource.scope('resources', 'active').findOne({
		group: ['Resource.id'],
		attributes: Object.keys(models.Resource.attributes).concat(literals),
		include: detailsIncludes,
		where: {slug: {[Op.eq]: slug}}
	})
	.then(async function(resource){

		// If resource exists
		// If resource is not approved
		// If user is not admin
		if ( resource && (!resource.approved || !resource.approvedScientific || !resource.approvedLinguistic) && resource.status && ((userExists && (userExists.Role.type!=consts.ADMIN_ROLE && userExists.id !=resource.user_id)) || !userExists) ){
			res.status(401).send({message: messages.resource.pending_permission});
			return null;
		}

		// Check if is exclusive and user is not loggedin
		/* if (resource && resource.exclusive==true && !userExists){
			res.status(401).send({message: messages.resource.access_permission});
			return null;
		} */

		if (resource){
			let finalData = resource.toJSON();
			finalData.Taxonomies = await resourcesUtils.resourceTaxs(resource.id, 'RESOURCES');
			finalData.Taxonomies.concat(await resourcesUtils.resourceTaxs(resource.id, 'REDA'));

			return res.json({result: finalData});
		}

		return res.status(403).send({
			message: messages.resource.no_exist,
		})
	})
	.catch(function(err){
		return handleError(res, err);
	});
}

exports.getDominiosTemas = async function(req, res){
	var termId = req.params.id;

/*

	const results = await models.sequelize.query(`SELECT distinct Terms.title, Terms.id as TermId FROM script_terms
inner join Terms on script_terms.term_id = Terms.id
inner join Scripts on script_terms.script_id = Scripts.id
where script_id in (select script_id from script_terms where term_id in (${termId}) and Scripts.deleted_at IS NULL) AND taxonomy_id = 8`,
{
	type: models.sequelize.QueryTypes.SELECT
});
*/


const results = await models.sequelize.query(`SELECT distinct(term_id) FROM terms_relations 
							where term_relationship_id in (select term_relationship_id from terms_relations 
							where term_id in (${termId})) and level = 4`,
{
	type: models.sequelize.QueryTypes.SELECT
});
	

	return res.json({result: results});


}

//
//	Get generic details from resource
//
exports.genericDetails = function(req, res){
	debug("Get generic Details");
	var slug = req.params.slug;

	models.Resource.scope('resources').findOne({
		attributes: [
			'title',
			'description'
		],
		where: {slug: {[Op.eq]: slug}}
	})
	.then(function(resource){
		return res.json({result: resource});
	}).catch(function(err){
        return handleError(res, err);
	});
}

//
//	Create Resource
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
		//	Create resource with everything prepared
		//
		var action = req.params.slug ? 'update' : 'create';

		// REMOVE KEYS FROM REDIS
		redisClient.delWildcard(["RESOURCES::*", "SCRIPTS::*"]);

		return upsertResource(req, res, action, userExists);
	}else{
		return res.status(401).send({message: messages.resource.create_permission});
	}
}

async function upsertResource(req, res, action, userExists){
    // INIT VARS
	var slug = "";	

	try{

		//
		//	Create a slug
		//
		slug = await dataUtil.createSlug(req.body.title, models.Resource, 'all', false, models);

	}catch(err){
		return handleError(res, err);
	}

	try{

		// Timestamp to save file
		const timestamp = new Date().getTime();
		var fileName = slug+"_"+timestamp;

		if (req.params.slug && action=='update'){

			//
			//	Get instance in order to update
			//
			let resource = await models.Resource.scope('allStatusApprove','resources').findOne({
				where:{
					slug: {[Op.eq]: req.params.slug}
				}
			})
			

			let image = null;

			//
			//	ADD THUMBNAIL
			//		    
			if (req.body.thumbnail && req.body.thumbnail.data && req.body.thumbnail.extension && !req.body.thumbnail.id){

				const thumbName = resource.slug+"_thumb_"+timestamp;

				//
				//	Save file to FileSys
				// req, res, folder, blob, name, ext, parentId
				dataUtil.saveFile(req, res, "resources/"+resource.dataValues.slug, req.body.thumbnail.data, thumbName, req.body.thumbnail.extension);

				// Create new file and add reference
				image = await models.Image.create({
					name: thumbName,
					extension: req.body.thumbnail.extension
				});
			}

			// If user is owner or is admin
			if(resource && (resource.user_id==userExists.id || userExists.Role.type==consts.ADMIN_ROLE)){
				fileName = resource.slug+"_"+timestamp;
				//
				//	Update resource
				//
				console.warn("updating resource", req.body.otherTechResources)
				await resource.updateAttributes({
					title: req.body.title,
					description: req.body.description,
					duration: req.body.duration || null,
					author: req.body.author,
					organization: req.body.organization,
					email: req.body.email || null,
					exclusive: req.body.exclusive || false,
					embed: req.body.isOnline && req.body.embed!=null ? req.body.embed : null,
					link: req.body.isOnline && req.body.link!=null ? req.body.link : null,
					//techResources: req.body.otherTechResources && req.body.otherTechResources!=='' ? stripAllTags(req.body.otherTechResources) : null,
					// leaving this way for now, but should be changed to the same as above.
					techResources: req.body.otherTechResources && req.body.otherTechResources!=='' ? req.body.otherTechResources : null,
					/* operation: req.body.op_proposal,
					operation_author: req.body.op_proposal_author, */
					status: userExists.Role.type==consts.ADMIN_ROLE ? resource.status : true,
					approved: userExists.Role.type==consts.ADMIN_ROLE ? resource.approved : 0,
					approvedScientific: userExists.Role.type==consts.ADMIN_ROLE ? resource.approvedScientific : 0,
					approvedLinguistic: userExists.Role.type==consts.ADMIN_ROLE ? resource.approvedLinguistic : 0,
					image_id: req.body.thumbnail && req.body.thumbnail.id ? req.body.thumbnail.id : (image ? image.id : null),
					accepted_terms: req.body.accept_terms || 1,
				});
			}else if(!resource){
				res.status(401).send({message: messages.resource.no_exist});
				return					 
			}else{
				res.status(401).send({message: messages.resource.create_permission});
				return
			}

			//
			//	Create script
			//
			if(req.body.terms && req.body.op_proposal){
				let script = await models.Resource.setScript(models, dataUtil, req, res, resource, req.body, userExists, fileName);

				if(typeof script === 'object' && script !== null && script.err){
					throw new Error(script.err);
				}

				debug(script, "Resource", "Added script")
			}

			// TERMS is the same as domains, subjects and years
			let finalTerms = req.body.format.concat(req.body.access).concat(req.body.language.id).concat(req.body.techResources || []);
			resource.setTerms(finalTerms);

			if ((!req.body.file || req.body.file.length==0)){
				removeFiles(resource);
			}
			
			//
			//	Remove all files and insert new ones if there is no ID
			//		    
			if (req.body.file && req.body.file.data && req.body.file.extension && !req.body.file.id){
				removeFiles(resource);

				//
				//	Save file to FileSys
				// req, res, folder, blob, name, ext, parentId
				dataUtil.saveFile(req, res, "resources/"+resource.dataValues.slug, req.body.file.data, fileName, req.body.file.extension);

				// Create new file and add reference
				models.File.create({
					name: fileName,
					extension: req.body.file.extension
				})
				.then(function(newFile){
					resource.addFile(newFile);
				});
			}

			// Send email notification on update
			// If is not admin, or is admin must be approved still
			/* if (userExists.Role.type!=consts.ADMIN_ROLE){ */
				resourcesUtils.notifyUpdate({user: userExists, slug: resource.dataValues.slug, resourceTitle: resource.dataValues.title});
			/* } */

			return res.status(200).json({result: resource});

		}else if(action=='create'){
			var fileToUpload = {};

			// Save file?
			if (req.body.file!=undefined && req.body.file!=null && req.body.file.name!=null && req.body.file.extension!=null){
				fileToUpload = {
					name: fileName,
					extension: req.body.file.extension				
				}
			}

			let type = await models.Type.findOne({
				where: {
					slug: {
						[Op.eq]: 'RESOURCES'
					}
				}
			});

			//
			//	ADD THUMBNAIL
			//	
			let image = null;	    
			if (req.body.thumbnail && req.body.thumbnail.data && req.body.thumbnail.extension){

				const thumbName = slug+"_thumb_"+timestamp;

				//
				//	Save file to FileSys
				// req, res, folder, blob, name, ext, parentId
				dataUtil.saveFile(req, res, "resources/"+slug, req.body.thumbnail.data, thumbName, req.body.thumbnail.extension);

				// Create new file and add reference
				image = await models.Image.create({
					name: thumbName,
					extension: req.body.thumbnail.extension
				});
			}

			let item = await models.Resource.create({
				title: req.body.title,
				slug: slug,
				description: req.body.description,
				// needs to be changed and tested
				format_id: req.body.format || null,
				duration: req.body.duration || null,
				author: req.body.author,
				organization: req.body.organization,
				email: req.body.email || null,
				highlight: false,
				exclusive: req.body.exclusive || false,
				embed: req.body.isOnline && req.body.embed ? req.body.embed : null,
				link: req.body.isOnline && req.body.link ? req.body.link : null,
				//techResources: req.body.otherTechResources && req.body.otherTechResources!=='' ? stripAllTags(req.body.otherTechResources) : null,
				// leaving as is for now, but should be changed to stripAllTags
				techResources: req.body.otherTechResources && req.body.otherTechResources!=='' ? req.body.otherTechResources : null,
				/* operation: req.body.op_proposal,
				operation_author: req.body.op_proposal_author, */
				user_id: userExists.id,
				approved: /* userExists.Role.type==consts.ADMIN_ROLE && !adminMustApprove ? 1 : */ 0,
				approvedScientific: /* userExists.Role.type==consts.ADMIN_ROLE ? 1 : */ 0,
				approvedLinguistic: /* userExists.Role.type==consts.ADMIN_ROLE && !adminMustApprove ? 1 : */ 0,
				type_id: type.id,
				image_id: image ? image.id : null,
				accepted_terms: req.body.accept_terms || 1,
			});

			//
			//	Create script
			//
			if(req.body.terms && req.body.op_proposal){
				let script = await models.Resource.setScript(models, dataUtil, req, res, item, req.body, userExists, fileName);

				if(typeof script === 'object' && script !== null && script.err){
					throw new Error(script.err);
				}
				debug(script, "Resource", "Added script")
			}

			// TERMS is the same as domains, subjects and years
			let finalTerms = req.body.format.concat(req.body.access).concat(req.body.language.id).concat(req.body.techResources || []);
			item.setTerms(finalTerms);

			//
			//	Save file to FileSys
			//
			if (req.body.file && !req.body.isOnline && req.body.file.data && req.body.file.extension){
				// Create new file and add reference
				const newFile = await models.File.create(fileToUpload)
				item.addFile(newFile);

				// req, res, folder, blob, name, ext, parentId
				dataUtil.saveFile(req, res, "resources/"+slug, req.body.file.data, fileName, req.body.file.extension);	
			}
			
			// Send email notification on create
			// If is not admin, or is admin must be approved still
			/* if (userExists.Role.type!=consts.ADMIN_ROLE || (userExists.Role.type==consts.ADMIN_ROLE && adminMustApprove)){ */
				resourcesUtils.notify({user: userExists, slug: slug, terms: finalTerms});
			/* } */				    

			return res.status(200).send(item);	 
		}
	}catch(err){
		return handleError(res, err);
	}
}



//
//	Delete Resource
//
exports.deleteEl = function(req, res){	
	var userExists = req.userExists;
	console.warn("deleteEl")

	// Check AUTH
	if (userExists && req.params.slug){

		models.Resource.scope('allStatusApprove','resources').findOne({
			where: {
				slug: {[Op.eq]: req.params.slug}
			}
		}).then((resource) => {

			if (!resource){
				res.status(403).send({message: messages.resource.no_exist});
				return
			}
			
			if(resource && (resource.user_id==userExists.id || userExists.Role.type==consts.ADMIN_ROLE)){

				//
				//	Delete resource
				//
				resource.destroy()
				.then(() => {
					// REMOVE KEYS FROM REDIS
					redisClient.delWildcard(["RESOURCES::*"]);

					return res.status(200).send({});
				})
				.catch(function(err){
					return handleError(res, err);
				});
				
			}else{
				return res.status(401).send({message: messages.resource.del_permission});
			}
		});
		
	}else{
		return res.status(401).send({message: messages.resource.del_permission});
	}
}

//	Hide Resource
//
exports.hideEl = function(req, res){	
	console.warn("hideEl")
	var userExists = req.userExists;


	// Check AUTH
	if (userExists && req.params.slug){

		models.Resource.scope('allStatusApprove','resources').findOne({
			where: {
				slug: {[Op.eq]: req.params.slug}
			}
		}).then((resource) => {

			if (!resource){
				res.status(403).send({message: messages.resource.no_exist});
				return
			}
			
			console.warn(userExists.Role.type)
			if(resource && (resource.user_id==userExists.id || userExists.Role.type==consts.ADMIN_ROLE)){




						console.warn("HIDE")
						console.warn(resource)
						resource.updateAttributes({
							hidden: 1
						})
						.then(() => {

							// REMOVE KEYS FROM REDIS
							redisClient.delWildcard(["RESOURCES::*"]);
						
							return res.status(200).send({});
						})





				


				
			}else{
				return res.status(401).send({message: messages.resource.del_permission});
			}
		})
					
		.then(function(resource){
			console.warn("done")
			return res.status(200).json({result: resource});
		})
		.catch(function(err){
			console.warn("err")
			return handleError(res, err, {message: messages.resource.save_error});
		});

		
	}else{
		return res.status(401).send({message: messages.resource.del_permission});
	}
}



//
//	Delete collective resources
//
exports.deleteCollective = function(req, res){	
	var userExists = req.userExists;
	debug(req.body.resources);
	// Check AUTH
	if (userExists){

		if (req.body.resources){		
			models.Resource.scope('all','resources').findAll({
				where: {
					id: {
						[Op.in]: req.body.resources
					}
				}
			}).then((resources) => {

				if (!resources || resources.length==0){
					res.status(403).send({message: messages.resources.del_no_exist});
					return
				}

				// If user is not admin, check each resource owner
				if (userExists.Role.type!=consts.ADMIN_ROLE){
					var notOwner = false;
					resources.forEach(function(item){
						if (item.user_id!=userExists.id){
							notOwner = true;
						}
					})

					// Give error if not owner of resource
					if (notOwner){
						res.status(401).send({message: messages.resources.del_permission});
						return
					}
				}

				// If no error, then destroy all
				models.Resource.scope('all','resources').destroy({
					where: {
						id: {[Op.in]: req.body.resources}
					}
				})
				.then(() => {
					// REMOVE KEYS FROM REDIS
					redisClient.delWildcard(["RESOURCES::*"]);
					
					return res.status(200).send({});
				})
				.catch(function(err){
					return handleError(res, err);
				});
			});
		}else{
			return res.status(403).send({message: messages.resources.del_no_exist});
		}
		
	}else{
		return res.status(401).send({message: messages.resources.del_permission});
	}
}

//
//	Remove a given resource files
//
async function removeFiles(resource){
	// Delete all files existing
	let files = await resource.getFiles()
	files.map(function(file){
		file.destroy();
		debug("=== Deleting file @: resources/"+resource.slug+"/"+file.name+"."+file.extension + " ===")

		//
		//	Delete physical files
		//
		//dataUtil.rmFile("scripts/"+resource.dataValues.slug, file.name+"."+file.extension);
	});
	resource.setFiles([]);

	//
	//	Delete physical files
	//
	//dataUtil.rmDir("resources/"+resource.dataValues.slug);
}

//
//	Validate fields (async validation)
//
exports.asyncValidate = async (req, res) => {
	let fields = req.body.fields || [];

	let slug = req.body.resource_slug;

	let errors = [];

	try{
		await Promise.all(fields.map(async (field) => {

			if(field.value && field.value.length>0){
				let where = {
					[field.key]: field.value
				}

				//	Avoid search in itself when editing
				if(slug){
					where.slug = {
						[Op.notLike]: slug
					}
				}					
			
				let exists = await models.Resource.scope('resources', 'normal').count({
					where
				});
	
				if(exists>0){
					errors.push({
						field: field.key,
						error:  messages.asyncValidate[field.key].exists
					})
				}
			}			
		}));

		return res.status(200).send({
			result: errors
		});

	}catch(err){
		return handleError(res, err);
	}
	
}