const bcrypt = require('bcrypt-nodejs');

/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	const Op = sequelize.Op;
	var User = sequelize.define('User', {
		email: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		recover_password_token: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		signup_token: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		organization: {
			type: DataTypes.STRING(500)
		},	
		hidden: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		newsletter: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},	
		approved: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},	
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},	
		acceptance: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
	}, {
		paranoid: true,
		defaultScope: {
			where: {
				status: true
			}
		},
		scopes: {
			all: {
				[Op.or]: [
					{
						status:false
					},
					{
						status:true
					}
				]
			}
		},
		hooks: {
			beforeCreate: function(user, options, cb){
				if(!process.env.IS_MIGRATING || process.env.IS_MIGRATING !== "true"){
					return new Promise(function(resolve, reject) {
						user.hashPassword(10, user.password, function(err, hash){
							if (err) return reject(err);
							// overwrite plain text password with encrypted password
							user.password = hash;
		
							return resolve(user);
						})
					});
				}
			}
		}
	});
	
    
	User.associate = function(models) {
		User.belongsToMany(models.Resource, {
			through: models.resource_favorite, 
			as: {
				singular: 'Favorite',
				plural: 'Favorites'
			},
		});
		User.belongsToMany(models.Notification, {through: 'users_notifications'});
		User.belongsTo(models.Image, {
			foreignKey: {
				allowNull: true
			}
		});
		
		User.belongsTo(models.Role);


		User.hasMany(models.Resource, {
			as: 'UserResources',
			foreignKey: {
				allowNull: false
			}
		});

		User.hasMany(models.Rating, {
			as: 'Ratings',
			foreignKey: {
				allowNull: false
			}
		});

		User.hasMany(models.Comment, {
			as: 'Comments',
			foreignKey: {
				allowNull: false
			}
		});

		User.hasMany(models.Script, {
			as: 'Scripts',
			foreignKey: {
				allowNull: false
			}
		});
	}

	User.prototype.comparePassword = function(candidatePassword, callback) {
		bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
			if (err) { return callback(err); }

			callback(null, isMatch);
		});
	}

	User.prototype.hashPassword = function(sal, password, cb){
		if (password && password.length>0){
			// generate a salt then run callback
			bcrypt.genSalt(10, function(err, salt) {
				if (err) { throw new Error(err); }

				// hash (encrypt) our password using the salt
				bcrypt.hash(password, salt, null, function(err, hash) {
					if (err) { throw new Error(err); }

					cb(null, hash);
				});
			});
		}else{
			cb("No password given", null);
		}			
	}

	return User;
};

