const { debug } = require('../utils/dataManipulation');
const models = require('../models/index');
const config = require('../config/config.json');
const messages = require('../config/messages.json');
const contactsUtils = require('../utils/controllers/contacts');
const consts = require('../config/const');
const { redisClient, getAsync, makeKey } = require('../services/redis');
const Op = models.Sequelize.Op;

// Get contacts list from user
exports.userContacts = async (req, res) => {
	var userExists = req.userExists;

	var limit = parseInt(req.query.limit) || config.limit;
	var page = parseInt(req.query.activePage) || 1;

	if(userExists){
		
		let resourcesResult = null;
		let shouldUpdate = false;

		// SET REDIS KEY
		const redisKey = makeKey("CONTACTS::USER", {
			user: userExists.id,
		});

		let redisResult = await getAsync(redisKey);
		
		

		if(redisResult){
			resourcesResult = JSON.parse(redisResult);

		}else{
			let setWhere = '';
			let includes = [
				{
					model: models.Contact,
					required: true,
					include: [
						{
							model: models.User,
							attributes: ['id', 'name', 'organization']
						}
					]
				},
				{
					model: models.Type,
					required: true,
				}
			];


			// If user is not admin, return only messages from that user
			if(userExists.Role.type!=consts.ADMIN_ROLE){
				setWhere+=' Resource.user_id = '+userExists.id;
			}

			// Since right now, all where clauses are strings, must assign as literal to sequelize recognize
			if(setWhere!==''){
				setWhere = models.Sequelize.literal(setWhere);
			}

			var literals = [
				//	If there are any new messages, and I'm not the owner of that message
				[models.sequelize.literal(`(SELECT IF(Contacts.status="NEW" AND Contacts.user_id <> ${userExists.id}, 1, 0)
				FROM Contacts
				INNER JOIN Resources on Contacts.resource_id = Resources.id
				WHERE Contacts.resource_id = Resource.id AND Contacts.deleted_at IS NULL AND Resources.deleted_at IS NULL
				ORDER BY Contacts.created_at DESC
				LIMIT 1)`), 'isNew'],

				//	If ever interected with user of resource or if resource is mine
				[models.sequelize.literal(`(SELECT
					IF(COUNT(Contacts.id)>0, 1,0) as didInteracted
					FROM Contacts
					INNER JOIN Resources on Contacts.resource_id = Resources.id
					WHERE Contacts.resource_id = Resource.id AND Contacts.deleted_at IS NULL AND Resources.deleted_at IS NULL
					AND (Contacts.user_id = ${userExists.id} OR Resource.user_id = ${userExists.id})
					GROUP BY Contacts.resource_id)`), 'didInteract']
			];

			

			let queryData = {
				distinct: true,
				attributes:[
					'id',
					'title',
					'slug',
					'created_at',
					'updated_at',
				].concat(literals),
				include: includes,
				order: [[models.Contact, 'created_at', 'DESC']]
			}

			if(setWhere!==''){
				queryData.where = setWhere;
			}
			
			resourcesResult = await models.Resource.scope('all').findAndCountAll(queryData);			

			shouldUpdate = true;
		}

		let tempData = {
			count: resourcesResult.count, 
			rows: resourcesResult.rows
		};

		if (shouldUpdate){
			redisClient.set(redisKey, JSON.stringify(tempData), 'EX', 60 * 60 * 24 * 2);
		}
		

		// This is the worst!!!!!!
		// The fact is that if I use limit and offset in the query, there will be repeated data and will ruin the results
		let rows = resourcesResult.rows ? resourcesResult.rows.slice(((page-1)*limit), limit+((page-1)*limit)) : null;

		// Return final object
		return res.json({
			page,
			totalPages: Math.ceil(resourcesResult.count/limit),
			limit,
			count: rows.length,
			total: resourcesResult.count, 
			result: rows
		});
	}

}

// Get contacts for a resource
exports.resourceContacts = async function(req, res){
	var userExists = req.userExists;
	var resource = req.params.slug;

	/* var limit = parseInt(req.query.limit) || config.limit;
	var page = parseInt(req.query.activePage) || 1; */


	if (resource){

		let contacts = null;
		let shouldUpdate = false;
		let resourceObj = null;

		// Set redis key data
		let redisKeyData = {
			resource
		}
		if(userExists.Role.type!=consts.ADMIN_ROLE){
			redisKeyData.user = userExists.id
		}

		// SET REDIS KEY
		const redisKey = makeKey("CONTACTS::RESOURCE", redisKeyData);

		let redisResult = await getAsync(redisKey);		

		if(redisResult){
			contacts = JSON.parse(redisResult);

		}else{
			let where = {
				slug: {[Op.eq]: resource}
			}
	
			if(userExists.Role.type!=consts.ADMIN_ROLE){
				where.user_id = userExists.id
			}
	
			try{
			
				var literals = [
					[models.sequelize.literal(`(SELECT IF(Contacts.status="NEW" AND Contacts.user_id <> ${userExists.id}, 1, 0) FROM Contacts WHERE Contacts.resource_id = Resource.id AND Contacts.deleted_at IS NULL
					ORDER BY Contacts.created_at DESC
					LIMIT 1)`), 'isNew'],
				];
	
				resourceObj = await models.Resource.scope(userExists && userExists.Role.type==consts.ADMIN_ROLE ? 'allStatusApprove' : 'defaultScope').findOne({			
					where,
					attributes: Object.keys(models.Resource.attributes).concat(literals)
				})
	
				if (!resourceObj){
					return res.status(403).send({message: messages.resource.no_exist})
				}
	
				contacts = await models.Contact.findAndCountAll({
					distinct: true,
					attributes:[
						'id',
						'description',
						'user_id',
						'created_at',
						'status'
					],
					include: [
						{
							model: models.User,
							attributes: [
								'id',
								'organization',
								'image_id',
								'hidden',
								[models.sequelize.literal('IF(`User`.`hidden`=1,null,`User`.`name`)'), 'name']
							],
							include: [
								{
									model:models.Image,
									required:false
								},
							]
						},
					],
					where: {
						resource_id: {[Op.eq]: resourceObj.id}
					},
					order: [['created_at', 'DESC']]
				});

				shouldUpdate = true;
	
				
	
			}catch(err){
				debug(err);
				return res.status(403).send({
					message:err.message,
					stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
				})
			}
		}

		let tempData = {
			count: contacts.count, 
			rows: contacts.rows,
			resource: shouldUpdate ? resourceObj : contacts.resource
		};

		if (shouldUpdate){
			redisClient.set(redisKey, JSON.stringify(tempData), 'EX', 60 * 60 * 24 * 2);
		}

		return res.json({
			/* page,
			totalPages: Math.ceil(contacts.count/limit),
			limit, */
			count: tempData.rows.length,
			total: tempData.count, 
			result: tempData.rows.reverse(),
			resource: tempData.resource
		});
		
	}else{
		return res.status(403).send({message: messages.resources.no_exist})
	}
}

// Add contact to resource owner
exports.addContact = async function(req, res){
	var userExists = req.userExists;
	var message = req.body.message;
	var resource = req.params.slug;

	if (userExists && resource && message){
		try{
			// Get resource to associate		
			const el = await models.Resource.scope(userExists && userExists.Role.type==consts.ADMIN_ROLE ? 'allStatusApprove' : 'defaultScope').findOne({
				where: {
					slug: {[Op.eq]: resource}
				},
				include: [
					{
						model: models.User,
						attributes: ['id', 'email']
					}
				]
			});

			if (!el){
				res.status(403).send({message: messages.resource.no_exist});
				return
			}

			var finalData = {
				description: message,					
				user_id: userExists.id,
				resource_id: el.id,
				status: "NEW"
			};				

			// Create contact message and notify stakeholders
			const result = await models.Contact.create(finalData);

			// REMOVE KEYS FROM REDIS
			redisClient.delWildcard(["CONTACTS::*"]);
				
			let finalUsers = '';

			if(userExists.id == el.User.id){
				// Get stakeholders
				const stakeholders = await models.sequelize.query(`SELECT DISTINCT(Users.email) FROM reda_3.Users
				INNER JOIN Contacts on Contacts.user_id = Users.id where Contacts.resource_id = :resource AND Users.id NOT IN(:users)`, 
					{
						replacements: {
							resource: el.id,
							users: [userExists.id]
						},
						type: models.sequelize.QueryTypes.SELECT
					}
				);

				finalUsers = stakeholders ? stakeholders.reduce( (acc, cur, idx) => {
					let final = acc;
					if(cur.email){
						if (idx>0){
							final+=';';
						}
	
						final+=cur.email;
					}
					

					return final;
				}, '') : config.teamEmail;
			}else{
				finalUsers = el.User.email;
			}

			var notifyNewContactData = {
				resourceTitle: el.title,
				resourceSlug: el.slug,
				message: message,
				users: finalUsers
			};

			contactsUtils.notifyNew(notifyNewContactData);

			return res.json({result: result});
		}catch(err){
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			})
		}
	}else{
		return res.status(401).send({message: messages.contact.create_permission})
	}
}

// Set status
exports.setReadStatus = async (req, res) => {
	var userExists = req.userExists;
	var resource = req.params.slug;

	if(userExists && resource){
		try{
			let continueInst = false;

			const resourceObj = await models.Resource.scope('all').findOne({
				where: {
					slug: {[Op.eq]: resource}
				},
			});

			if(!resourceObj){
				return res.status(403).send({message: messages.resource.no_exist});
			}


			//	=========================================================================
			//	Check if current user did begin any conversation or is owner of resource
			//	=========================================================================
			const didAnyContact = await models.Contact.findOne({
				where: {
					resource_id: resourceObj.id,
					user_id: {
						[Op.in]: [userExists.id]
					}
				}
			});

			if(didAnyContact || resourceObj.user_id===userExists.id){
				continueInst = true;
			}

			//	=========================================================================
			//	END
			//	=========================================================================

			if(continueInst){
				const contact = await models.Contact.update(
					{
						status: "READ"
					},
					{
						where: {
							resource_id: resourceObj.id,
							user_id: {
								[Op.notIn]: [userExists.id]
							}
						}
					}
				);

				// REMOVE KEYS FROM REDIS
				redisClient.delWildcard(["CONTACTS::*"]);

				return res.json({
					result: contact
				});
			}

			return res.json({
				result: ""
			});
		}catch(err){
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			})
		}
	}else{
		return res.status(401).send({message: messages.contact.save_error})
	}
}