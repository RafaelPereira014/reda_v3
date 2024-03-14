var express = require('express');
var router = express.Router();
var models = require('../models/index');
const jwtUtil = require('../utils/jwt');
const Authentication = require('../controllers/authenticationController');
const UserController = require('../controllers/userController');
const passportService = require('../services/passport');
const passport = require('passport');

// Passport
const requireSignin = passport.authenticate('local', { session: false });

/* GET users listing. */
router.get('/', jwtUtil.requireAuth, function(req, res) {
  res.send({ message: 'Super secret code is ABC123' });
});

router.post('/signin', requireSignin, Authentication.signin);
router.post('/signup', Authentication.signup);
router.get('/confirm/:token', Authentication.confirmSignup);
router.get('/profile', jwtUtil.requireAuth(), UserController.profile);
router.post('/request-recover', UserController.requestPasswordRecover);
router.post('/change-recover-password', UserController.changeRecoverPassword);
router.put('/profile/:userId', jwtUtil.requireAuth(), UserController.updateUser);
router.delete('/:userId', jwtUtil.requireAuth(['admin']), UserController.deleteSingle);

router.get('/roles', jwtUtil.requireAuth(['admin']), UserController.getRoles);
router.get('/month', jwtUtil.requireAuth(['admin']), UserController.listNewUsers);
router.get('/list-all', jwtUtil.requireAuth(['admin']), UserController.listUsers);
router.put('/set-role', jwtUtil.requireAuth(['admin']), UserController.setRole);

module.exports = router;