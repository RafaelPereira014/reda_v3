/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	var ResourceImage = sequelize.define('resource_image', {
	}, {
		paranoid: false
	});

	return ResourceImage;
}