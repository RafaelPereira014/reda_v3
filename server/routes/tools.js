const ToolsController = require('../controllers/toolsController');
const express = require('express');
var router = express.Router();
const jwtUtil = require('../utils/jwt');
const {usesUser} = require('../services/usesUser');
const config = require('../config/config.json');

router.get('/', usesUser(), ToolsController.list);
router.get('/month', ToolsController.listNew);
router.get('/details/:slug', usesUser(), ToolsController.details);
router.get('/search', usesUser(), ToolsController.search);
router.post('/', jwtUtil.requireAuth(config.interactors), ToolsController.createOrUpdate);
router.put('/:slug', jwtUtil.requireAuth(config.interactors), ToolsController.createOrUpdate);
router.put('/approved/:id', jwtUtil.requireAuth(['admin']), ToolsController.setApproved);
router.put('/approved/:id/undo', jwtUtil.requireAuth(['admin']), ToolsController.setApprovedUndo);
router.delete('/', jwtUtil.requireAuth(config.interactors), ToolsController.deleteCollective);
router.delete('/:slug', jwtUtil.requireAuth(config.interactors), ToolsController.deleteEl);


module.exports = router;
