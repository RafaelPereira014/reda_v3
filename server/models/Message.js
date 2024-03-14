/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	const Op = sequelize.Op;
	var Message = sequelize.define('Message', {
		message: {
			type: DataTypes.STRING,
			allowNull: false
		},		
		type: {
			type: DataTypes.STRING,
			allowNull: false
		},
		typeTitle: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		}
	}, {
		paranoid: true,
		defaultScope: {
			where: {
				status: true
			}
		},
		scopes:{
			all: {
				[Op.or]: [
					{
						status:false
					},
					{
						status:true
					}
				]
			},
		}
	});

	Message.associate = function(models) {
		Message.belongsTo(models.Type); 
		
		Message.addScope('resources', {
			include: [
				{ 
					model: models.Type,
					where: {
						slug: {
							[Op.eq]: 'RESOURCES'
						}
					}
				}
			]
		});

		Message.addScope('scripts', {
			include: [
				{ 
					model: models.Type,
					where: {
						slug: {
							[Op.eq]: 'SCRIPTS'
						}
					}
				}
			]
		});
	}

	return Message;
}
