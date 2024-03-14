const models = require('../models/index');
const consts = require('../config/const');
const messages = require('../config/messages.json');
const Op = models.Sequelize.Op;

exports.list = function(req, res){
	var userExists = req.userExists;
	var messageType = req.query.type || 'disapprove';
	var scope = 'resources';
	var setWhere = {};	

	if (userExists && userExists.Role.type==consts.ADMIN_ROLE && messageType){

		setWhere.type = {[Op.eq]: messageType};

		if (req.query.content){
			switch(req.query.content){
				case 'resources':
					scope = 'resources';
				break;
				case 'scripts':
					scope = 'scripts';
				break;
			}
		}

		models.Message.scope(scope).findAll({
			attributes: [
				'id',
				'message',
				'type',
				'typeTitle'
			],
			where: setWhere
		})
		.then(function(messages){
			return res.json({result: messages});
		})
	}else if(!messageType){
		return res.status(403).send({message: "Message type must be provided"});

	}else{
		return res.status(401).send({message: messages.resources.access_permission})
	}
}