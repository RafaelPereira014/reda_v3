const ScriptsController = require('../controllers/scriptsController');
const express = require('express');
var router = express.Router();
const jwtUtil = require('../utils/jwt');
const {usesUser} = require('../services/usesUser');
const config = require('../config/config.json');

router.get('/search', usesUser(), ScriptsController.search);
router.get('/:resource', usesUser(), ScriptsController.details);
router.get('/single-script/:script', usesUser(), ScriptsController.singleDetails);
router.get('/user-scripts/:resource', jwtUtil.requireAuth(config.interactors), ScriptsController.userScripts);
router.post('/:resource', jwtUtil.requireAuth(config.interactors), ScriptsController.create);
router.post('/single-script/:resource', jwtUtil.requireAuth(config.interactors), ScriptsController.createSingle);
router.put('/single-script/:script', jwtUtil.requireAuth(config.interactors), ScriptsController.createSingle);
router.put('/approved/:id', jwtUtil.requireAuth(config.interactors), ScriptsController.setApproved);
router.put('/approved/:id/undo', jwtUtil.requireAuth(['admin']), ScriptsController.setApprovedUndo);
router.delete('/', jwtUtil.requireAuth(config.interactors), ScriptsController.delScript);
router.delete('/:script', jwtUtil.requireAuth(config.interactors), ScriptsController.delScript);

module.exports = router;
