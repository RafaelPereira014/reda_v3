const ResourcesController = require('../controllers/resourcesController');
const express = require('express');
var router = express.Router();
const jwtUtil = require('../utils/jwt');
const {usesUser} = require('../services/usesUser');
const config = require('../config/config.json');

router.get('/', ResourcesController.list);
router.get('/month', ResourcesController.listNew);
router.get('/recent', usesUser(), ResourcesController.recent);
router.get('/highlight', ResourcesController.highlight);
router.get('/related/:slug', ResourcesController.related);
router.get('/search', usesUser(), ResourcesController.search);
router.get('/search2/:tag', usesUser(), ResourcesController.searchWord);
router.get('/details/:slug', usesUser(), ResourcesController.details);
router.get('/generic-details/:slug', ResourcesController.genericDetails);
router.get('/dominios-temas/:id', ResourcesController.getDominiosTemas);
router.post('/', jwtUtil.requireAuth(config.interactors), ResourcesController.createOrUpdate);
router.put('/:slug', jwtUtil.requireAuth(config.interactors), ResourcesController.createOrUpdate);
router.put('/highlight/:id', jwtUtil.requireAuth(config.interactors), ResourcesController.setHighlight);
router.put('/favorite/:id', jwtUtil.requireAuth(), ResourcesController.setFavorite);
router.put('/rating/:id', jwtUtil.requireAuth(config.interactors), ResourcesController.setRating);
router.put('/approved/:id', jwtUtil.requireAuth(['admin']), ResourcesController.setApproved);
router.put('/approved/:id/undo', jwtUtil.requireAuth(['admin']), ResourcesController.setApprovedUndo);
router.put('/hidden/:id/undo/', jwtUtil.requireAuth(['admin']), ResourcesController.setHiddenUndo);
router.delete('/', jwtUtil.requireAuth(config.interactors), ResourcesController.deleteCollective);
router.delete('/:slug', jwtUtil.requireAuth(config.interactors), ResourcesController.deleteEl);
router.put('/hide/:slug', jwtUtil.requireAuth(['admin']), ResourcesController.hideEl);

router.post('/async-validate', jwtUtil.requireAuth(config.interactors), ResourcesController.asyncValidate);

module.exports = router;
