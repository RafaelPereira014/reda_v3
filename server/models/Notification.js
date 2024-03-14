/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	var Notification = sequelize.define('Notification', {
		obj_type: {
			type: DataTypes.ENUM('RESOURCE', 'RESOURCE_MESSAGE', 'SCRIPT', 'COMMENT','CONTACT'),
			allowNull: false
		},
		action: {
			type: DataTypes.ENUM('ADD', 'UPDATE', 'DELETE', 'APPROVED'),
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM('NEW', 'READ'),
			allowNull: false,
			defaultValue: 'NEW'
		},
		obj_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		paranoid: true,
		defaultScope: {
		}
	});

	Notification.associate = function(models) {
		Notification.belongsToMany(models.User, {through: 'users_notifications'});
	}

	return Notification;
}
