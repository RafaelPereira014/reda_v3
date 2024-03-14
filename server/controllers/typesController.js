const models = require('../models/index');
exports.list = async function(req, res, next) {

	// =================================================
	// SET ATTRIBUTES AND LITERALS
	// =================================================
	var attributes = [
		"id",	
		"title",
		"slug",
		"created_at",
		"updated_at",
	];

	var literals = [];
	var order = [
		['title', 'ASC']
	];	

	try{
		let types = await models.Type.findAll({
			attributes: attributes.concat(literals),
			order
		});

		return res.json({result: types});
	}catch(err){
		return next(err);
	}
};