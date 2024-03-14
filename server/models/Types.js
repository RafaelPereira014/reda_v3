/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	const Op = sequelize.Op;
	var Type = sequelize.define('Type', {
		title: {
			type: DataTypes.STRING,
			allowNull: true
		},
		slug: {
			type: DataTypes.TEXT,
			allowNull: true
		},
	}, {
		paranoid: true,
		defaultScope: {
		},
		scopes:{
		}
	});

	Type.associate = function(models) {
		Type.hasMany(models.Resource, {
			foreignKey: {
				allowNull: false
			}
        });
        Type.hasMany(models.Taxonomy, {
			foreignKey: {
				allowNull: true
			}
        });
	}

	return Type;
}
