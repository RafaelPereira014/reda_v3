/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	var Rating = sequelize.define('Rating', {
		value: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
	}, {
		paranoid: true,
		defaultScope: {
			where: {
				status: true
			}
		}
	});

	Rating.associate = function(models) {
		Rating.belongsTo(models.Resource);
		Rating.belongsTo(models.User);
	}
	return Rating;
}
