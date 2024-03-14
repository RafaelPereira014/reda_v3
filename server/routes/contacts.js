const ContactsController = require('../controllers/contactsController');
const express = require('express');
var router = express.Router();
const jwtUtil = require('../utils/jwt');
const config = require('../config/config.json');

router.get('/user', jwtUtil.requireAuth(config.interactors), ContactsController.userContacts);
router.get('/:slug', jwtUtil.requireAuth(['admin']), ContactsController.resourceContacts);
router.put('/:slug/read', jwtUtil.requireAuth(config.interactors), ContactsController.setReadStatus);
router.post('/:slug', jwtUtil.requireAuth(['admin']), ContactsController.addContact);

module.exports = router;
