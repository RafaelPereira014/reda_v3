const TaxonomiesController = require('../controllers/taxonomiesController');
const express = require('express');
var router = express.Router();
const jwtUtil = require('../utils/jwt');
const {usesUser} = require('../services/usesUser');

router.get('/', TaxonomiesController.list);
router.get('/tax', TaxonomiesController.listTax);
router.get('/search', usesUser(), TaxonomiesController.search);
router.get('/:slug', usesUser(), TaxonomiesController.details);
router.get('/:slug/terms', usesUser(), TaxonomiesController.terms);
router.post('/', jwtUtil.requireAuth(['admin']), TaxonomiesController.createOrUpdate);
router.put('/:slug', jwtUtil.requireAuth(['admin']), TaxonomiesController.createOrUpdate);
router.delete('/', jwtUtil.requireAuth(['admin']), TaxonomiesController.deleteCollective);
router.delete('/:slug', jwtUtil.requireAuth(['admin']), TaxonomiesController.deleteEl);

module.exports = router;
