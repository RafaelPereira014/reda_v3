const SitemapController = require('../controllers/sitemapController');
const express = require('express');
var router = express.Router();

router.get('/generate', SitemapController.generate);

module.exports = router;
