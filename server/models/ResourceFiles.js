/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	var ResourceFile = sequelize.define('resource_file', {
	}, {
		paranoid: false
	});

	return ResourceFile;
}