/**
 * Create Model
 */
module.exports = function(sequelize, DataTypes) {
	const Op = sequelize.Op;
	var Taxonomy = sequelize.define('Taxonomy', {
		title: {
			type: DataTypes.STRING,
			allowNull: true
		},
		slug: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		locked: {
			type: DataTypes.BOOLEAN,
			default: true
		},
		hierarchical: {
			type: DataTypes.BOOLEAN,
			default: false
		}
	}, {
		paranoid: true,
		defaultScope: {
		},
		scopes:{
		}
	});

	Taxonomy.associate = function(models) {
		Taxonomy.hasMany(models.Term, {
			foreignKey: {
				allowNull: false
			}
        });
        Taxonomy.belongsTo(models.Type); 
	}

	Taxonomy.createEl = async (args, data, models) => {
		const typeObj = await models.Type.findOne({
			where: {
				id: {
					[Op.eq]: data.type
				}
			}
		});

		const item = await models.Taxonomy.create({
			title: args.title,
			slug: args.slug+'_'+typeObj.slug.toLowerCase(),
			locked: false
		});

		item.setType(typeObj);

		return item;
	}

	Taxonomy.updateEl = async (args, data, models) => {

		const tax = await models.Taxonomy.findOne({
			where:{
				slug: {[Op.eq]: args.slug}
			},
		});
	
		//
		//	Update tax
		//
		const item = await tax.updateAttributes({
			title: args.title,
		});

		item.setType(data.type);

		return item;
	}

	return Taxonomy;
}
