/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	const Op = sequelize.Op;
	var Blacklist = sequelize.define('Blacklist', {
		token: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		expires: {
			type: DataTypes.DATE,
			allowNull: false
		}
	},{
		indexes: [
		    // Create a unique index on email
		    {
		      unique: true,
		      fields: ['token','expires']
		    }
	    ],
		paranoid: false,
		defaultScope: {
			where: {
				expires: {
					[Op.gte]: new Date()
				}
			}
		},
		scopes:{
			expired: {
				where: {
					expires: {
						[Op.lt]: new Date()
					}
				}
			}
		}
	});

	return Blacklist;
}
