const FeedbackController = require('../controllers/feedbackController');
const express = require('express');
var router = express.Router();

router.post('/', FeedbackController.sendFeedback);

module.exports = router;
