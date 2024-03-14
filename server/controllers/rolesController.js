const models = require('../models/index');
const Op = models.Sequelize.Op;

exports.list = function(req, res, next) {


	models.Role.findAll({
		where: {
			type: {
				[Op.notIn]: ['admin', 'educator', 'student']
			}
		},
		order: [['value','ASC']]
	}).then(function(roles){
		return res.json({result: roles});
	}).catch(function(err){
		return next(err);
	})
};