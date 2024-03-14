
const models = require('../../models/index');
const Op = models.Sequelize.Op;

//
//	Get resource taxonomies
//
exports.getRelatedTerms = async function(rels, level){
    let relsWhere = [];
    if(rels.length>0 && level){
		relsWhere = {
			id:{
				[Op.in]: rels
			}
		}
    
    
        let includes = [
            {
                model: models.TermRelationship,
                as: 'Relationship',
                required: true,
                attributes: [],
                where: relsWhere,
                through: {
                    attributes: [],
                    where: {
                        level,
                    }
                }
            }
        ];

        return await models.Term.findAll({
            include: includes,
            attributes: [
                'id',
                'title',
                'slug',
                'taxonomy_id',
                'image_id',
                'parent_id'
            ],
            order: [['title', 'ASC']]
        });
    }
    
    return null;
}