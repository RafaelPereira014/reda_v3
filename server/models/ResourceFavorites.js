/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	var ResourceFavorite = sequelize.define('resource_favorite', {
	}, {
		paranoid: false
	});

	return ResourceFavorite;
}