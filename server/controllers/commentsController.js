const { debug } = require('../utils/dataManipulation');
const models = require('../models/index');
const config = require('../config/config.json');
const messages = require('../config/messages.json');
const dataUtil = require('../utils/dataManipulation');
const commentsUtils = require('../utils/controllers/comments');
const consts = require('../config/const');
const Op = models.Sequelize.Op;

// Check if comment has bad wrods
exports.hasBadwords  = function(req, res){
	var comment = req.body.comment;

	if (comment){

		commentHasBadwords(comment, function(rows){
			return res.json({result: rows});
		});

	}else{
		return res.status(401).send({message: messages.comment.access_permission})
	}
}

// Make moderation action to comment
exports.setApproved = function(req, res){
	var userExists = req.userExists;
	var commentId = req.params.comment;

	// Status
	var status = req.body.status;

	// Is there any justification message?
	var message = req.body.message || null;

	// Only admins
	if (userExists && userExists.Role.type==consts.ADMIN_ROLE && commentId && status!=null){
		models.Comment.scope('all').findOne({
			attributes: [
				'id',
				'text'
			],
			where: {
				id: {[Op.eq]: commentId}
			},
			include: [
				{
					model: models.User,
					attributes: ['id', 'email']
				},
				{
					model: models.Resource,
					attributes: ['id', 'title']
				}
			]
		})
		.then(function(item){
			if (!item){
				res.status(403).send({message: messages.comment.no_exist});
				return
			}

			// Set item by having a moderation action with a specific status
			return item.updateAttributes({
				approved: 1,
				status: status
			})					
		})
		.then(function(el){
			commentsUtils.notifyStatus({
				user: el.User,
				resource: el.Resource.title,
				message: message || null,
				status: status
			});

			return res.status(200).json({result: el});
		})
		.catch(function(err){
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			});
		});
	}else{
		return res.status(401).send({message: messages.resources.access_permission})
	}
}

// Get pending comments
exports.pendingComments = function(req, res){
	var userExists = req.userExists;

	var limit = parseInt(req.query.limit) || config.limit;
	var page = parseInt(req.query.activePage) || 1;
	var order = dataUtil.extractOrder(req.query.order, models) || null;

	if (userExists && userExists.Role.type==consts.ADMIN_ROLE){
		models.Comment.scope('pending').findAndCountAll({
			distinct: true,
			attributes: [
				'id',
				'text'
			],
			include: [
				{
					model: models.User,
					attributes: [
						'id',
						'name',
						'organization',
						'hidden'
					],
				},
				{
					model: models.Resource,
					attributes: [
						'id',
						'title',
						'slug'
					]
				}
			],
			limit: limit,
			offset: ((page-1)*limit),
			order: [order]
		})
		.then(function(comments){
			return res.json({
				page,
				totalPages: Math.ceil(comments.count/limit),
				limit,
				count: comments.rows.length,
				total: comments.count, 
				result: comments.rows
			});
		})
		.catch(function(err){
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			});
		})
	}else{
		return res.status(401).send({message: messages.comments.access_permission})
	}
}

// Get comments for a resource
exports.resourceComments = function(req, res){
	var userExists = req.userExists;
	var resource = req.params.slug;

	var limit = parseInt(req.query.limit) || config.limit;
	var page = parseInt(req.query.activePage) || 1;


	if (resource){
		models.Resource.scope(userExists && userExists.Role.type==consts.ADMIN_ROLE ? 'allStatusApprove' : 'defaultScope').findOne({			
			where: {
				slug: {[Op.eq]: resource}
			}
		})
		.then(function(el){
			/* debug(el, "Comments resource"); */
			if (!el){
				return null;
			}

			return models.Comment.scope(userExists && userExists.Role.type==consts.ADMIN_ROLE ? 'pendingAndApproved' : 'defaultScope').findAndCountAll({
				distinct: true,
				attributes:[
					'id',
					'text',
					'user_id',
					'created_at',
					'approved',
					'status',
					'level'
				],
				include: [
					{
						model: models.User,
						attributes: [
							'id',
							'organization',
							'image_id',
							'hidden',
							[models.sequelize.literal('IF(`User`.`hidden`=1,null,`User`.`name`)'), 'name']
						],
						include: [
							{
								model:models.Image,
								required:false
							}
						]
					},
					{
						model: models.NestedComment,
						as: 'parentComment',
						required: false,
						include: [
							{
								model: models.Comment.scope(userExists && userExists.Role.type==consts.ADMIN_ROLE ? 'pendingAndApproved' : 'defaultScope'),
								as: 'childComment',
								required: false,
								include: [
									{
										model: models.User,
										required: false,
										attributes: [
											'id',
											'organization',
											'image_id',
											'hidden',
											[models.sequelize.literal('IF(`parentComment->childComment->User`.`hidden`=1,null,`parentComment->childComment->User`.name)'), 'name']
										],
										include: [
											{
												model:models.Image,
												required:false
											}
										]
									}
								]
							}
						]
					}
				],
				where: {
					resource_id: {[Op.eq]: el.id},
					level: 0
				},
				limit: limit*page,
				order: [['created_at', 'DESC']]
			})
		})
		.then(function(comments){
			if (!comments){
				return res.json({
					page,
					totalPages: 0,
					limit,
					count: 0,
					total: 0, 
					result: null
				});
			}

			return res.json({
				page,
				totalPages: Math.ceil(comments.count/limit),
				limit,
				count: comments.rows.length,
				total: comments.count, 
				result: comments.rows
			});
		})
		.catch(function(err){
			debug(err);
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			});
		})
	}else{
		return res.status(401).send({message: messages.resources.no_exist})
	}
}

// Add comment to resource
exports.addComment = function(req, res){
	var userExists = req.userExists;
	var comment = req.body.comment;
	var parentComment = req.body.parent;
	var resource = req.params.slug;

	if (userExists && resource && comment){
		commentHasBadwords(comment, function(rows){
			if (rows && rows.length>0){
				return res.status(401).send({message: messages.comment.badwords})
			}
		
			models.Resource.findOne({
				where: {
					slug: {[Op.eq]: resource}
				},
				include: [
					{
						model: models.User,
						attributes: ['id', 'email']
					}
				]
			})
			.then(function(el){
				var finalData = {
					text: comment,					
					user_id: userExists.id,
					approved: userExists && userExists.Role.type==consts.ADMIN_ROLE ? 1 : 0,
					resource_id: el.id
				};

				if (parentComment){
					finalData.level = 1;
				}

				models.Comment.create(finalData)
				.then(function(result){
					// Notify admins of new comment if not added by admin
					if (userExists && userExists.Role.type!=consts.ADMIN_ROLE){
						commentsUtils.notifyNew({
							resourceTitle: el.title,
							resourceSlug: el.slug,
							comment: comment
						})
					}

					if (parentComment){
						return models.NestedComment.create({
							parent_id: parentComment,
							child_id: result.id
						}).
						then(function(){

							// Notify owner if is reply
							commentsUtils.notifyReply({
								resourceTitle: el.title,
								resourceSlug: el.slug,
								user: el.User
							});
							return res.json({result: result});
						})
					}else{
						return res.json({result: result});
					}
				});
			})
			.catch(function(err){
				return res.status(403).send({
					message:err.message,
					stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
				});
			})
		});
	}else{
		return res.status(401).send({message: messages.comment.create_permission})
	}
}

// Update a comment
exports.updateComment = function(/* req, res, next */){

}

// Delete a comment
exports.deleteComment = function(req, res){
	var userExists = req.userExists;
	var commentId = req.params.comment;

	if (userExists){
		models.Comment.scope('allStatusApprove').findOne({
			where: {
				id: {[Op.eq]: commentId}
			}
		})
		.then(function(comment){
			if (!userExists || (comment.user_id != userExists.id && userExists.Role.type!=consts.ADMIN_ROLE)){
				return res.status(401).send({message: messages.comment.del_permission})
			}else{
				comment.destroy()
				.then(() => {
					return res.status(200).send({});
				})
				.catch(function(err){
					return res.status(403).send({
						message:err.message,
						stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
					});
				});
			}
		})
	}else{
		return res.status(401).send({message: messages.comment.del_permission})
	}
}

// Check if there are any bad words
function commentHasBadwords(comment, cb){

	return models.Badword.findAll({
		attributes: [
			'title'
		]
	})
	.then(function(rows){

		var detectedWords = [];
		var testString = "";
		var toCompare = comment.toLowerCase();

		for (var row of rows){
			testString = new RegExp('\\b' + row.title.toLowerCase() + '\\b');

			if (testString.test(toCompare)){
				detectedWords.push({title: row.title});
			}
		}
		cb(detectedWords)
	})
}