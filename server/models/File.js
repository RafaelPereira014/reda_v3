/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	var File = sequelize.define('File', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		extension: {
			type: DataTypes.STRING(10),
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

	File.associate = function(models) {
		File.belongsToMany(models.Script, {through: models.script_file});
		File.belongsToMany(models.Resource, {through: models.resource_file});
	}

	return File;
}
