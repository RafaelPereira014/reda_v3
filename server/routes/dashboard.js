const DashboardController = require('../controllers/dashboardController');
const express = require('express');
var router = express.Router();
const jwtUtil = require('../utils/jwt');

router.get('/', jwtUtil.requireAuth(['admin']), DashboardController.resume);

module.exports = router;
