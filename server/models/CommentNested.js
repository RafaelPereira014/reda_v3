/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	var NestedComment = sequelize.define('NestedComment', {
	}, {
		paranoid: true
	});

	NestedComment.associate = function(models) {
		NestedComment.belongsTo(models.Comment, {
			as: 'parentComment',
			foreignKey: {
				name: 'parent_id',
				allowNull: false
			}
		});

		NestedComment.belongsTo(models.Comment, {
			as: 'childComment',
			foreignKey: {
				name: 'child_id',
				allowNull: false
			}
		});
	}

	return NestedComment;
}
