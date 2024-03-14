const TermsController = require('../controllers/termsController');
const express = require('express');
var router = express.Router();
const jwtUtil = require('../utils/jwt');

router.get('/', TermsController.list);
router.get('/relationship', TermsController.relationship);
router.post('/', jwtUtil.requireAuth(['admin']), TermsController.createOrUpdate);
// changed to id instead of slug
router.put('/:id', jwtUtil.requireAuth(['admin']), TermsController.createOrUpdate);
router.delete('/', jwtUtil.requireAuth(['admin']), TermsController.deleteCollective);
router.delete('/:slug', jwtUtil.requireAuth(['admin']), TermsController.deleteEl);


module.exports = router;
