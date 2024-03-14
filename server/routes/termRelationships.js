const TermRelationshipsController = require('../controllers/termRelationshipsController');
const express = require('express');
var router = express.Router();
const jwtUtil = require('../utils/jwt');
const {usesUser} = require('../services/usesUser');

router.get('/', usesUser(), TermRelationshipsController.list);
router.get('/listterms', usesUser(), TermRelationshipsController.list2);
router.post('/', jwtUtil.requireAuth(['admin']), TermRelationshipsController.createOrUpdate);
router.put('/:relation', jwtUtil.requireAuth(['admin']), TermRelationshipsController.createOrUpdate);
router.delete('/:relation', jwtUtil.requireAuth(['admin']), TermRelationshipsController.deleteEl);

module.exports = router;
