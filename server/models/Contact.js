/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	var Contact = sequelize.define('Contact', {
		description: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM('NEW', 'READ'),
			allowNull: false,
			defaultValue: 'NEW'
		},
	}, {
		paranoid: true,
		defaultScope: {
		},
		scopes:{
			read: {
				where: {
					status: 'READ'
				}
			},
			new: {
				where: {
					status: 'NEW'
				}
			},
		}
	});

	Contact.associate = function(models) {
		Contact.belongsTo(models.Resource, { 
			foreignKey: { 
				allowNull: true 
			}
		});

		Contact.belongsTo(models.User, { 
			foreignKey: { 
				allowNull: true 
			}
		});
	}

	return Contact;
}
