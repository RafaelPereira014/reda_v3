/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	const Op = sequelize.Op;
	var Comment = sequelize.define('Comment', {
		text: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		approved: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		level: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		}
	}, {
		paranoid: true,
		defaultScope: {
			where: {
				status: true,
				approved: 1
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
			allStatusApprove: {
				[Op.or]: [
					{
						status:false
					},
					{
						status:true
					},
					{
						approved: 1
					},
					{
						approved: 0
					}
				]
			},
			pendingAndApproved:{
				[Op.or]: [
					{
						status:true,
						approved:1
					},
					{
						status:true,
						approved:0
					}
				]
			},
			approved: {
				where:{
					status: true,
					approved: 1
				}
			},
			pending: {
				where: {
					approved:0
				}
			},
			reproved:{
				where:{
					approved:1,
					status:false
				}
			},
			topLevel:{
				where:{
					approved:1,
					status:false,
					level: {
						[Op.gt]: 0
					}
				}
			}
		}
	});

	Comment.associate = function(models) {
		Comment.belongsTo(models.User, { 
			foreignKey: { 
				allowNull: false 
			}
		});

		Comment.belongsTo(models.Resource, { 
			foreignKey: { 
				allowNull: true 
			}
		});

		Comment.hasMany(models.NestedComment, {
			as: 'parentComment',
			foreignKey: {
				name: 'parent_id',
				allowNull: false
			}
		});

		Comment.hasMany(models.NestedComment, {
			as: 'childComment',
			foreignKey: {
				name: 'child_id',
				allowNull: false
			}
		});
	}

	return Comment;
}


