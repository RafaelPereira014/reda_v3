const AppController = require('../controllers/appController');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {  
  return res.status(200).json({result: "Reda v2 api"});
});

router.get('/test-links', AppController.testLinks);

module.exports = router;