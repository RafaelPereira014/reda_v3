const NewsController = require('../controllers/newsController');
const express = require('express');
var router = express.Router();
const jwtUtil = require('../utils/jwt');

router.get('/', NewsController.list);
router.get('/:slug', NewsController.details);
router.post('/', jwtUtil.requireAuth(['admin']), NewsController.createOrUpdate);
router.put('/:slug', jwtUtil.requireAuth(['admin']), NewsController.createOrUpdate);
/* router.delete('/', jwtUtil.requireAuth(['admin']), NewsController.deleteCollective);*/
router.delete('/:slug', jwtUtil.requireAuth(['admin']), NewsController.deleteEl);

module.exports = router;
