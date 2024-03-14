const CommentsController = require('../controllers/commentsController');
const express = require('express');
var router = express.Router();
const jwtUtil = require('../utils/jwt');
const {usesUser} = require('../services/usesUser');
const config = require('../config/config.json');

router.get('/pending', jwtUtil.requireAuth(['admin']), CommentsController.pendingComments);
router.get('/:slug', usesUser(), CommentsController.resourceComments);
router.post('/has-badwords', CommentsController.hasBadwords);
router.put('/approved/:comment', jwtUtil.requireAuth(['admin']), CommentsController.setApproved);
router.post('/:slug', jwtUtil.requireAuth(config.interactors), CommentsController.addComment);
router.put('/:comment', jwtUtil.requireAuth(config.interactors), CommentsController.updateComment);
router.delete('/:comment', jwtUtil.requireAuth(config.interactors), CommentsController.deleteComment);

module.exports = router;
