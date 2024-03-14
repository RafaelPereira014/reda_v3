const jwt = require('jwt-simple');
const models = require('../models/index');
const config = require('../config/config.json');
const { redisClient, getAsync, makeKey } = require('../services/redis');
const Op = models.Sequelize.Op;

//
//	If needs user, gives to the controller.
//	If no user, still continues
//
exports.usesUser = function(){
	return usesUserHelper;
}

exports.getUser = async (token) => {
	if (token){
		var payload = null;

		if (token.indexOf("Basic")>=0){
			return {data: null, err: null}
		}else{
			payload = jwt.decode(token, config.secret);	

			// SET REDIS KEY
			const redisKey = makeKey("USERS::DETAILS", {
				id: payload.sub
			});

			// Check if token is expired
			if (new Date(payload.expires).getTime() < new Date().getTime()){
				redisClient.del(redisKey);
				return {data: null, err: "token_expired"}
			}

			let redisResult = await getAsync(redisKey);
			
			try{
				let user = null;

				//	If not in cache, get it and post to cache
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
							}
						]					
					});

					//  Set key if user exists
					redisClient.set(redisKey, JSON.stringify(user), 'EX', 60 * 60 * 24 * 2);

				}else{
					//  If has value, get user data
					user = JSON.parse(redisResult);
				}

				return {data: user, err: null};
			}catch(err) {
				return {data: null, err: err.message};
			}
		}
	}else{
		return {data: null, err: null}
	}
}

const usesUserHelper = async (req, res, next) => {
	req.userExists = null;

	var token = req.headers.redauid;

	if (token){
		var payload = null;

		if (token.indexOf("Basic")>=0){
			next();
		}else{
			payload = jwt.decode(token, config.secret);	

			// SET REDIS KEY
			const redisKey = makeKey("USERS::DETAILS", {
				id: payload.sub
			});

			// Check if token is expired
			if (new Date(payload.expires).getTime() < new Date().getTime()){
				redisClient.del(redisKey);
				return res.status(401).send({ message: "token_expired"})
			}

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
								}
							]
					});
					//  Set key if user exists
					redisClient.set(redisKey, JSON.stringify(user), 'EX', 60 * 60 * 24 * 2);
				}else{
					//  If has value, get user data
					user = JSON.parse(redisResult);
				}
				
				req.userExists = user;
				return next();

			}catch(err){
				next(err);
			}
		}
	}else{
		next();
	}
}