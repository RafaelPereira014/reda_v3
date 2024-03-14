/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	var ScriptFile = sequelize.define('script_file', {
	}, {
		paranoid: false
	});

	return ScriptFile;
}