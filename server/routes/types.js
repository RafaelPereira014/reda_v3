const TypesController = require('../controllers/typesController');
const express = require('express');
var router = express.Router();
const {usesUser} = require('../services/usesUser');

router.get('/', usesUser(), TypesController.list);

module.exports = router;
