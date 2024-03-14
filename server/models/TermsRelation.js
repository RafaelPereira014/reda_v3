/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	var TermsRelation = sequelize.define('terms_relation', {
		level: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
	}, {
		paranoid: false
	});

	return TermsRelation;
}