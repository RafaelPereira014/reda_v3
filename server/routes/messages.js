const MessagesController = require('../controllers/messagesController');
const express = require('express');
var router = express.Router();
const {usesUser} = require('../services/usesUser');

router.get('/', usesUser(), MessagesController.list);


module.exports = router;
