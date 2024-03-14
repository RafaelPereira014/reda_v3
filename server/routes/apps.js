const AppsController = require('../controllers/appsController');
const express = require('express');
var router = express.Router();
const jwtUtil = require('../utils/jwt');
const {usesUser} = require('../services/usesUser');
const config = require('../config/config.json');

router.get('/', usesUser(), AppsController.list);
router.get('/month', AppsController.listNew);
router.get('/details/:slug', usesUser(), AppsController.details);
router.get('/search', usesUser(), AppsController.search);
router.post('/', jwtUtil.requireAuth(config.interactors), AppsController.createOrUpdate);
router.put('/:slug', jwtUtil.requireAuth(config.interactors), AppsController.createOrUpdate);
router.put('/approved/:id', jwtUtil.requireAuth(['admin']), AppsController.setApproved);
router.put('/approved/:id/undo', jwtUtil.requireAuth(['admin']), AppsController.setApprovedUndo);
router.delete('/', jwtUtil.requireAuth(config.interactors), AppsController.deleteCollective);
router.delete('/:slug', jwtUtil.requireAuth(config.interactors), AppsController.deleteEl);


module.exports = router;
