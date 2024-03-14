const { debug } = require('./dataManipulation');
const jwt = require('jwt-simple');
const models = require('../models/index');
const config = require('../config/config.json');
const messages = require('../config/messages.json');
const passport = require('passport');
/* const passportService = require('../services/passport'); */
const Op = models.Sequelize.Op;

var exports = module.exports;

var blacklistToken = function(token){
	var payload = jwt.decode(token, config.secret);
	
	models.Blacklist.upsert({
		token,
		expires: new Date(payload.expires)
	});
}

// Create a new token
exports.tokenForUser = function(user) {
  const timestamp = new Date().getTime();
	// Expires in 3 days
	// 24 * 60 * 60 * (number of days * 1000) = miliseconds in a given number of days
  const tomorrow = new Date(timestamp + (24 * 60 * 60 * 3000));
  return jwt.encode({ sub: user.id, iat: timestamp, expires: tomorrow }, config.secret);
}

//
// NOT BEING USED, BUT STILL HERE IF NEEDED
//
exports.userExists = function(req, res, token){
	var promise = new Promise(function(resolve, reject){

		if (token){
			var payload = jwt.decode(token, config.secret);

			return models.User.findOne({
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
			}).then(function(user) {
					if (user) {
						// Check if expired
					if (new Date(payload.expires).getTime() < new Date().getTime()){
						reject();						
						res.status(401).send({ message: "token_expired",  new_token : exports.tokenForUser(user) });
						return
					}
						resolve(user);
					} else {
						resolve(false);
					}
				}).catch(function(err){

					reject(err);
				});	
		}else{
			resolve(false);
		}
	});

	return promise;		
}

// Check if token is valid
exports.requireAuth = function(roles){

	return function(req, res, next) {
		var token = req.headers.redauid || req.headers.authentication;

		passport.authenticate('jwt', { session: false }, function(err, user, info){
			req.user = null;

			return models.Blacklist.findAndCountAll({
				where: {
					token: {[Op.eq]: token}
				}
			})
			.then(function(results){
				
				if (results && results.count>0){
					debug("token blacklisted", "JWT");
					return res.status(401).json({ message: 'token_expired'});
				}else{
					if (err) { return next(err) }
			
					// If there is any message associated with token expiration
					if (!user && info && info.message && info.message=='token_expired') {

						blacklistToken(token);

						// If no user and a new token is given      
						return res.status(401).send({ message: info.message});

					}else if(!user || !_checkRoles(user, roles)){
						return res.status(401).send({message: messages.generic.access_permission});

					}else{
						req.userExists = user;
					}
					
					next();
				}
			});
			
		})(req, res, next);
	}
}

// Refresh token on each request
exports.refreshToken = function(token){
	var payload = jwt.decode(token, config.secret);

	// If expires, blacklist token
	if (new Date(payload.expires).getTime() < new Date().getTime()){
		debug("Refresh Token: expired", "JWT");

		debug(payload.expires, "JWT", "Expires:");

		blacklistToken(token);
		return null;
	}

	return exports.tokenForUser({id: payload.sub});
}

function _checkRoles(user, allowedRoles){
	if(!allowedRoles)
		return true;

	return user && allowedRoles.indexOf(user.Role.type)>=0;
}

module.exports = exports;