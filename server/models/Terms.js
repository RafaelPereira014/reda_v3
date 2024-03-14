/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	var Term = sequelize.define('Term', {
		title: {
			type: DataTypes.STRING,
			allowNull: true
		},
		slug: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		icon: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		color: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		type: {
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

	Term.associate = function(models) {
        Term.belongsToMany(models.Script, {through: models.script_term});
        Term.belongsToMany(models.Resource, {through: models.resource_term});

        /* Term.belongsToMany(models.TermRelationship, {
            as: 'DependsOn',
            through: 'terms_relation',
            foreignKey: 'depends_on_id'
        }); */
        Term.belongsToMany(models.TermRelationship, {
            as: 'Relationship',
            through: models.terms_relation,
            foreignKey: 'term_id'
        });

		Term.belongsTo(models.Image);
		Term.belongsTo(models.Taxonomy);
        Term.hasOne(Term, {
            as: 'Parent',
            foreignKey: 'parent_id'
        });
	}

	Term.prototype.hasChild = async function() {
		let num = await Term.count({
			where: {
				parent_id: this.id
			}
		});

		return num>0;
	}

	Term.prototype.getChild = async function() {
		let result = await Term.findAll({
			where: {
				parent_id: this.id
			}
		});

		return result;
	}

	return Term;
}
