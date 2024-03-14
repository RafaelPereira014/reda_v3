const RolesController = require('../controllers/rolesController');
const express = require('express');
var router = express.Router();

router.get('/', RolesController.list);

module.exports = router;
