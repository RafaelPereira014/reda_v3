/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	var ResourceTerm = sequelize.define('resource_term', {
		metadata: {
			type: DataTypes.STRING,
			allowNull: true
		},
	}, {
		paranoid: false
	});

	return ResourceTerm;
}