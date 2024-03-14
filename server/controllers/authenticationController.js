const { debug } = require('../utils/dataManipulation');
const models = require('../models/index');
const messages = require('../config/messages.json');
const registrationUtils = require('../utils/controllers/registration');
const jwtUtil = require('../utils/jwt');
const crypto = require('crypto');
const Op = models.Sequelize.Op;

//
//  After signin in passport, send user data
//
exports.signin = function(req, res) {
  debug(req.user);
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ 
    token: jwtUtil.tokenForUser(req.user),
    user: {
      /* id: req.user.id, */
      hidden: req.user.hidden,
      email: req.user.email,
      role: req.user.Role.type,
      name: req.user.name || null,
      image: req.user.Image,
      organization: req.user.organization || null
    }
  });
}

//
//  Signup user
//
exports.signup = function(req, res, next) {
  const email = req.body.email || null;
  const name = req.body.name || null;
  const organization = req.body.organization && req.body.organization!="null" ? req.body.organization : null;
  const password = req.body.password || null;
  const userType = req.body.type || null;
  const acceptance = req.body.acceptance || null;
  /* const reg_token = req.body.authKey && req.body.authKey!="null" ? req.body.authKey : null; */

  // Check incoming data
  if (!email || !name || !password || !userType || !acceptance) {
    res.status(422).send({ message: messages.signup.invalid_data});
    return
  }

  models.Role.findAll()
  .then(function(roles){
    // See if a user with the given email exists
    return models.User.scope("all").findOne({ 
      where: { 
        email: {
          [Op.eq]: email
        } 
      }
    })
    .then(function(existingUser){
      return {existingUser, roles}
    });
  })
  .then(function(data) {
    debug(data);

    if (data){
      // If a user with email does exist, return an error
      if (data.existingUser) {
        res.status(422).send({ message: messages.signup.email_used });
        return
      }

      var targetRole = userType;
      debug(targetRole);

      // Create token for signup
      var cryptoBuf = crypto.randomBytes(48);

      // If a user with email does NOT exist, create and save user record
      return models.User.create({
        name: name ? name : null,
        email: email,
        password: password,
        organization: organization && organization.length>0 ? organization : null,
        role_id: data.roles.find((role)=> role.type==targetRole).id,
        signup_token: cryptoBuf.toString('hex'),
        status: false,
        acceptance: acceptance
      }).then(function(user){
        return {
          user: {
            id: user.id,
            hidden: user.hidden,
            email: user.email,
            name: user.name || null,
            organization: user.organization || null,
            signup_token: user.signup_token
          }, 
        }
      });
    }
  })
  .then(function(data){
    if (data.user){

      // Notify with confirmation e-mail
      registrationUtils.notifySignup({
        token: data.user.signup_token,
        email: data.user.email
      });

      // Respond to request indicating the user was created
      return res.json({ token: jwtUtil.tokenForUser(data.user) });
    }    
  })
  .catch(function(err){
    return next(err);
  });
}

//
//  Confirm user signup
//
exports.confirmSignup = function(req, res, next){
  var token = req.params.token;

  if(!token || token === ''){
    res.status(422).send({ message: messages.signup.invalid_confirm_token});
    return
  }

  // See if a user with the given email exists
  models.User.scope("all").findOne({ 
    where: { 
      signup_token: {
        [Op.eq]: token
      }
    }
  })
  .then(function(user){
    if(user){
        //  Update only if is not approved yet
        if(!user.status){
            return user.updateAttributes({
                status: true
            });
        }else{
            return true;
        }      
    }

    return false;
  })
  .then(function(result){
    if(!result){
      res.status(422).send({ message: messages.signup.invalid_confirm_token});
      return
    }

    return res.json({ result: true });
  })
  .catch(function(err){
    return next(err);
  });
}