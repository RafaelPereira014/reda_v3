const BadwordsController = require('../controllers/badwordsController');
const express = require('express');
var router = express.Router();
const jwtUtil = require('../utils/jwt');
const config = require('../config/config.json');

router.get('/', jwtUtil.requireAuth(config.interactors), BadwordsController.list);
router.post('/', jwtUtil.requireAuth(['admin']), BadwordsController.add);
/* router.put('/:word', jwtUtil.requireAuth(['admin']), BadwordsController.update); */
router.delete('/:word', jwtUtil.requireAuth(['admin']), BadwordsController.delete);

module.exports = router;
