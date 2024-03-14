/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	var ScriptTerm = sequelize.define('script_term', {
	}, {
		paranoid: false
	});

	return ScriptTerm;
}