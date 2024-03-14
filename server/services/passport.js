const passport = require('passport');
const models = require('../models/index');
const config = require('../config/config.json');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const { redisClient, getAsync, makeKey } = require('../services/redis');

const Op = models.Sequelize.Op;

// LOGIN VIA FORM
// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  models.User.findOne({
    where: { email: {[Op.eq]: email} }, 
    include: [
      {
        model:models.Role
      }, 
      {
        model:models.Image,
        required:false
      },
    ]
  }).then(function(user) {
    if (!user) { 
      return done(null, false); 
    }

    // compare passwords - is `password` equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  }).catch(function(err){
    return done(err);
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('redauid'),
  secretOrKey: config.secret
};

// LOGIN VIA GIVEN JWT
// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, async function(payload, done) {

  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  if (!payload || !payload.sub){
    return done(null, false);
  }
  
  // SET REDIS KEY
	const redisKey = makeKey("USERS::DETAILS", {
		id: payload.sub
  });

  // Check if token is expired
  if (new Date(payload.expires).getTime() < new Date().getTime()){
    redisClient.del(redisKey);
    return done(null, false, { message: "token_expired" });
  }

  let redisResult = await getAsync(redisKey);
  
  if(!redisResult){
    models.User.findOne({
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
    }).then(function(user) {
      if (user) {
        //  Set key if user exists
        redisClient.set(redisKey, JSON.stringify(user), 'EX', 60 * 60 * 24 * 2);

        return done(null, user);
      } else {
        return done(null, false);
      }
    }).catch(function(err){
      return done(err, false);
    });
  }else{
    //  If has value, get user data
    let user = JSON.parse(redisResult);
    return done(null, user);
  }
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);