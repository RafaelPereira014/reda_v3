const { debug } = require('../utils/dataManipulation');
const models = require('../models/index');
const config = require('../config/config.json');
const usersUtils = require('../utils/controllers/users');
const messages = require('../config/messages.json');
const crypto = require('crypto');
const jwt = require('jwt-simple');
const SqlString = require('sequelize/lib/sql-string');
const { redisClient, getAsync, makeKey } = require('../services/redis');

const Op = models.Sequelize.Op;

// Get profile data from token
exports.getUserInfoFromToken = async function(token){
	if (!token || token.length==0)
		return null
	
	var payload = jwt.decode(token, config.secret);	

	// SET REDIS KEY
	const redisKey = makeKey("USERS::DETAILS", {
		id: payload.sub
	});

	let redisResult = await getAsync(redisKey);

	try{
		let user = null;

		if(!redisResult){
			user = await models.User.findOne({
				where: {id:{[Op.eq]: payload.sub}}, 
				include: [
					{
						model:models.Role
					}, 
					{
						model:models.Image,
						required:false
					},
				]
			});

			//  Set key if user exists
			redisClient.set(redisKey, JSON.stringify(user), 'EX', 60 * 60 * 24 * 2);

		}else{
			//  If has value, get user data
			user = JSON.parse(redisResult);
		}

		if (user) {
			return {
				id: user.id,
				hidden: user.hidden,
				email: user.email,
				role: user.Role.type,
				name: user.name || null,
				image: user.Image,
				organization: user.organization || null
			}
		}else{
			return null;
		}
	}catch(err){
		debug(err.message, "Getting user from token", "ERR");
	}
}

// Get profile data
exports.profile = function(req, res){
	var userExists = req.userExists;
	if (userExists){
		return res.json({
			token: req.headers.redauid,
			user: {
				id: userExists.id,
				hidden: userExists.hidden,
				email: userExists.email,
				role: userExists.Role.type,
				name: userExists.name || null,
				image: userExists.Image,
				organization: userExists.organization || null
			}
		});
	}
}

// Update user info
exports.updateUser = function(req, res){
	var userExists = req.userExists;
	var givenUser = req.params.userId;
	var givenPassword = req.body.password && req.body.password.length>0 ? req.body.password : null;

	if (userExists.id == givenUser){
		models.User.findOne({
			where: {
				id: {[Op.eq]: givenUser}
			},
			include: [
				{
					model: models.Role,
					required:false
				},
				{
					model: models.Image,
					required:false
				}
			]
		})
		.then(function(resultUser){
			// Set default password to current
			var finalPassword = resultUser.password;

			// SET REDIS KEY
			const redisKey = makeKey("USERS::DETAILS", {
				id: resultUser.id
			});

			//	Delete from cache in order to update
			redisClient.del(redisKey);

			// Hash password and update according
			resultUser.hashPassword(10, givenPassword, function(err, hash){
				if (!err && hash){
					finalPassword = hash;
				}
				
				return resultUser.updateAttributes({
					name: req.body.name || resultUser.name,
					organization: req.body.organization,
					password: finalPassword,
					hidden: req.body.hidden!=null ? req.body.hidden : false
				})	
				.then(function(updatedUser){
					res.json({
						token: req.headers.redauid,
						user: {
							id: updatedUser.id,
							hidden: updatedUser.hidden,
							email: updatedUser.email,
							role: updatedUser.Role.type,
							name: updatedUser.name || null,
							image: updatedUser.Image,
							organization: updatedUser.organization || null
						}
					});
					return
				})	
				.catch(function(err){
					return res.status(403).send({
            message:err.message,
            stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
					});
				})		
			});			
		})		
		.catch(function(err){
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			});
		})
	}else{
		return res.status(403).send({message: messages.user.edit_permission});
	}
}

// Request a password recovery token
exports.requestPasswordRecover = function(req, res){
	var requestEmail = req.body.email;

	models.User.findOne({
		where:{
			email: {[Op.eq]: requestEmail}
		}
	})
	.then(function(user){
		if (!user){
			res.status(403).send({message: 'Utilizador não existe'});
			return
		}

		crypto.randomBytes(48, function(err, buffer) {
			// SET REDIS KEY
			const redisKey = makeKey("USERS::DETAILS", {
				id: user.id
			});

			//	Delete from cache in order to update
			redisClient.del(redisKey);

			user.updateAttributes({
				recover_password_token: buffer.toString('hex')
			})
			.then(function(updatedUser){
				usersUtils.notifyPasswordChangeRequest({
					token: updatedUser.recover_password_token,
					email: updatedUser.email
				});

				return res.send({result: "Done"});
			})
		});
	})
	.catch(function(err){
		return res.status(403).send({
			message:err.message,
			stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
		});
	})
}

// Check recovery token and submit new password
exports.changeRecoverPassword = function(req, res){
	var recoverToken = req.body.token;
	var newPassword = req.body.password;

	models.User.findOne({
		where:{
			recover_password_token: {[Op.eq]: recoverToken}
		}
	})
	.then(function(user){
		if (!user){
			res.status(403).send({message: 'Token fornecido não é válido'});
			return
		}

		// SET REDIS KEY
		const redisKey = makeKey("USERS::DETAILS", {
			id: user.id
		});

		//	Delete from cache in order to update
		redisClient.del(redisKey);

		// Hash password and update according
		user.hashPassword(10, newPassword, function(err, hash){
			if (err){
				res.status(403).send({message: messages.user.edit_permission});
				return
			}
			
			return user.updateAttributes({
				password: hash,
				recover_password_token: null
			})	
			.then(function(){
				return res.send({result: messages.user.password_changed});
			})	
			.catch(function(err){
				return res.status(403).send({
					message:err.message,
					stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
				});
			})		
		});
	})	
	.catch(function(err){
		return res.status(403).send({
			message:err.message,
			stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
		});
	})
}

// Return list of users
exports.listUsers = function(req, res, next){
	var setWhere = '';
	var includes = [];
	var scope = 'all';

	var limit = parseInt(req.query.limit) || config.limit;
	var page = parseInt(req.query.activePage) || 1;
	var term = req.query.term && req.query.term.length>0 ? req.query.term : null;
	var role = req.query.role && req.query.role.length>0 ? req.query.role : null;
	/* var order = dataUtil.extractOrder(req.query.order, models) || null; */

	includes = [
		{
			model: models.Role,
			attributes:[
				'value',
				'type'
			]
		},
	];

	// Set search and role for search
	if (term){
		setWhere += `(User.name LIKE ${SqlString.escape("%"+term+"%")} OR User.email LIKE ${SqlString.escape("%"+term+"%")})`;
	}

	if (role){
		includes[0].where = {
			type: role
		};
	}	

	models.User.scope(scope).findAndCountAll({		
		distinct: true,				
		attributes: [
			'id',
			'name',
			'email',
			'organization',
			'created_at',
            'updated_at',
            'status'
		],
		limit: limit,
		offset: ((page-1)*limit),
		include: includes,
		order: models.Sequelize.literal('name ASC'),
		where: models.Sequelize.literal(setWhere)
	})
	.then(function(users){
		// findAndCount
		// COUNT - total results without limit and offset
		// ROWS - total results with limit and offset
		return res.json({
			page,
			totalPages: Math.ceil(users.count/limit),
			limit,
			count: users.length,
			total: users.count, 
			result: users.rows
		});


	}).catch(function(err){
		return next(err);
	})
}

// Return list of users
exports.listNewUsers = function(req, res, next){
	var includes = [];

	var limit = parseInt(req.query.limit) || config.limit;
	var page = parseInt(req.query.activePage) || 1;

	includes = [
		{
			model: models.Role,
			attributes:[
				'value',
				'type'
			]
		},
	];

	let today = new Date();
	var lastMonth = new Date();
	lastMonth.setHours(0,0,0,0);
	lastMonth.setDate(1);	

	models.User.findAndCountAll({		
		distinct: true,				
		attributes: [
			'id',
			'name',
			'email',
			'organization',
			'created_at',
			'updated_at',
		],
		limit: limit,
		offset: ((page-1)*limit),
		include: includes,
		order: models.Sequelize.literal('name ASC'),
		where: {
			created_at: {
					[Op.between]: [lastMonth, today]
			}
		}
	})
	.then(function(users){
		// findAndCount
		// COUNT - total results without limit and offset
		// ROWS - total results with limit and offset
		return res.json({
			page,
			totalPages: Math.ceil(users.count/limit),
			limit,
			count: users.length,
			total: users.count, 
			result: users.rows
		});


	}).catch(function(err){
		return next(err);
	})
}

// Set user role
exports.setRole = function(req, res, next){
	var scope = null;
	var userId = parseInt(req.body.user);
	var targetRole = req.body.role && req.body.role.length>0 ? req.body.role : null;

	models.User.scope(scope).findOne({
		attributes: [
			'id',
			'name',
			'email'
		],	
		where: {
			id: {[Op.eq]: userId}
		}
	})
	.then(function(user){

		// SET REDIS KEY
		const redisKey = makeKey("USERS::DETAILS", {
			id: user.id
		});

		//	Delete from cache in order to update
		redisClient.del(redisKey);

		return models.Role.findOne({
			where: {
				type: {[Op.eq]: targetRole}
			}
		})
		.then(function(role){
			return user.updateAttributes({
				role_id: role.id
			})
		})
	})
	.then(function(user){
		return res.status(200).json({result: user});
	}).catch(function(err){
		return next(err);
	})
}

// Export roles
exports.getRoles = function(req, res){
	models.Role.findAll({
		attributes: [
			'value',
			'type'
		],
		order: [['value', 'ASC']]
	})
	.then(function(roles){
		return res.status(200).json({result: roles});
	})
}

// Delete user
exports.deleteSingle = function(req, res){
	if (req.params.userId){

		models.User.scope(null).findOne({
			where: {
				id: {[Op.eq]: req.params.userId}
			}
		}).then((user) => {
			debug(user);
			
			if(user){

				// SET REDIS KEY
			const redisKey = makeKey("USERS::DETAILS", {
				id: user.id
			});

			//	Delete from cache in order to update
			redisClient.del(redisKey);

				//
				//	Delete resource
				//
				user.destroy()
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
				return res.status(401).send({message: messages.user.del_permission});
			}
		});
		
	}else{
		return res.status(401).send({message: messages.user.del_permission});
	}
}