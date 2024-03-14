const { debug } = require('../utils/dataManipulation');
const models = require('../models/index');
const config = require('../config/config.json');
const dataUtil = require('../utils/dataManipulation');
const messages = require('../config/messages.json');
const validate = require('../utils/validation/validateRelationships').validate;
const consts = require('../config/const');
const { redisClient, getAsync, makeKey } = require('../services/redis');

exports.list = async (req, res) => {
    //  Init setWhere
    let setWhere = "";
    let replacements = {};

    //  Set total of levels to get
    let levels = parseInt(req.query.levels) || 6;

    //  Get terms
    let terms = req.query.terms || [];

    if(levels<1){
        return res.status(403).send({message: messages.rels.invalid_level});
    }

    let columns = '';
    let order = '';

    for(let i=1; i<=levels; i++){
        if(i>1 && i<=levels){
            columns+=','
            order+=',';
        }
        columns += `group_concat(if(terms_relations.level = ${i}, Terms.slug, NULL)) as term_slug_order_${i},`;
        columns += `group_concat(if(terms_relations.level = ${i}, Terms.id, NULL)) as term_id_${i}`;
        order += `term_slug_order_${i}${i==2 ? '+0' : ''} ASC`;
    }

    if(terms && terms.length>0){
        terms.map((term, idx) => {
            if(idx>0){
                setWhere+=' AND ';
            }
            setWhere += `SUM(Terms.id = :term_id_${idx+1})`;
            replacements[`term_id_${idx+1}`] = term;
        })
    }


    try{
        var limit = parseInt(req.query.limit) || config.limit;
        var page = parseInt(req.query.activePage) || 1;
        let filtered = null;

        //  Get relationships filtered by given data
        if(terms && terms.length>0){
            filtered = await models.sequelize.query(`SELECT
                TermRelationships.id as id
                FROM reda_3.TermRelationships
                INNER JOIN terms_relations ON terms_relations.term_relationship_id = TermRelationships.id
                INNER JOIN Terms on Terms.id = terms_relations.term_id
                WHERE TermRelationships.deleted_at IS NULL and Terms.deleted_at IS NULL
                
                GROUP BY TermRelationships.id
                HAVING
                ${setWhere}`, 
                        {
                    replacements,
                    type: models.sequelize.QueryTypes.SELECT
                }
            );

            //  Set new where and replacements based on results
            setWhere = '';
            replacements = {};

            if(filtered && filtered.length>0){
                setWhere += ' AND (';

                filtered.map((item, idx) => {
                    if(idx>0){
                        setWhere += ` OR `; 
                    }
                    setWhere += `TermRelationships.id = :rel_id_${idx+1}`;
                    replacements[`rel_id_${idx+1}`] = item.id;
                });

                setWhere += ')';
            }else{
                setWhere += ' AND TermRelationships.id = null';
            }
        }
       // console.warn(setWhere)

        //  Get relationships with pagination
        let rels = await models.sequelize.query(`
            SELECT * FROM
                (        
                    SELECT  
                        TermRelationships.id as id,
                        ${columns}
                        
                        FROM reda_3.TermRelationships
                        INNER JOIN terms_relations ON terms_relations.term_relationship_id = TermRelationships.id
                        INNER JOIN Terms on Terms.id = terms_relations.term_id
                        WHERE (TermRelationships.deleted_at IS NULL and Terms.deleted_at IS NULL) ${setWhere}
                        GROUP BY id
                ) as Rel
            ORDER BY ${order}
            LIMIT ${((page-1)*limit)}, ${limit}`, 
            {
                replacements,
                type: models.sequelize.QueryTypes.SELECT
            }
        );

        //  Get total rows without pagination
        const totalRows = await models.sequelize.query(`SELECT 
            COUNT(DISTINCT TermRelationships.id) as "count"
            FROM reda_3.TermRelationships
            INNER JOIN terms_relations ON terms_relations.term_relationship_id = TermRelationships.id
            INNER JOIN Terms on Terms.id = terms_relations.term_id
            WHERE (TermRelationships.deleted_at IS NULL and Terms.deleted_at IS NULL) ${setWhere}`, 
        {
            replacements,
            type: models.sequelize.QueryTypes.SELECT
        });
        
        return res.status(200).json({
            page,
			totalPages: Math.ceil(parseInt(totalRows[0].count)/limit),
			limit,
			count: rels.length,
			total: totalRows[0].count, 
			result: rels
        });
    }catch(err) {
        debug(err, "Rels::ERROR");
        return res.status(403).send({
            message:err.message,
            stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
        });
    }
    
}


exports.list2 = async (req, res) => {
    var limit = parseInt(req.query.limit) || config.limit;
    var page = parseInt(req.query.activePage) || 1;
    let filtered = null;
    //  Set total of levels to get
    let levels = parseInt(req.query.levels) || 4;

    //  Get terms
    let disciplina = req.query.disciplinas || [];
    let anos = req.query.anos || [];

    let resourcesResult = null;
    let shouldUpdate = false;

    // SET REDIS KEY


    const redisKey = makeKey("ADVANCEDSEARCH::DISCIPLINA", {
        disciplinas: disciplina[0],
    });

    let redisResult = await getAsync(redisKey);
    
    

    if(redisResult){
        console.warn("REDIS")
        resourcesResult = JSON.parse(redisResult);

        return res.status(200).json({
			result: resourcesResult
        });

    }else{
        console.warn("NO REDIS")
    //  Init setWhere
    let setWhere = "";
    let replacements = {};


    console.warn(anos)

    if(levels<1){
        return res.status(403).send({message: messages.rels.invalid_level});
    }

    let columns = '';
    let order = '';

    for(let i=1; i<=levels; i++){
        if(i>1 && i<=levels){
            columns+=','
            order+=',';
        }
        columns += `group_concat(if(terms_relations.level = ${i}, Terms.title, NULL)) as term_slug_order_${i},`;
       // columns += `group_concat(if(terms_relations.level = ${i}, Terms.slug, NULL)) as term_slug_order_${i},`;
        columns += `group_concat(if(terms_relations.level = ${i}, Terms.id, NULL)) as term_id_${i}`;
        order += `term_slug_order_${i}${i==2 ? '+0' : ''} ASC`;
    }




    try{

///////SUM(Terms.id IS NOT NULL)




        //  Get relationships filtered by given data
        if(disciplina && disciplina.length==1){


            if(anos.length>0){



                let iterableanos = 0;
                for(var ano of anos){
                    if(iterableanos>0){
                        setWhere += ' OR '
                    }
                    setWhere += ' SUM(Terms.id = '+parseInt(ano)+')';
                    iterableanos++;
                }

            }else{
                setWhere = 'SUM(Terms.id IS NOT NULL)'
            }

            console.log(setWhere)

            filtered = await models.sequelize.query(`SELECT
                TermRelationships.id as id
                FROM reda_3.TermRelationships
                INNER JOIN terms_relations ON terms_relations.term_relationship_id = TermRelationships.id
                INNER JOIN Terms on Terms.id = terms_relations.term_id
                WHERE TermRelationships.deleted_at IS NULL and Terms.deleted_at IS NULL
                
                GROUP BY TermRelationships.id
                HAVING
                SUM(Terms.id = ${disciplina[0]}) AND (${setWhere})`, 
                        {
                    type: models.sequelize.QueryTypes.SELECT
                }
            );

            
            //  Set new where and replacements based on results
            setWhere = '';
            replacements = {};

            if(filtered && filtered.length>0){
                setWhere += ' AND (';

                filtered.map((item, idx) => {
                    if(idx>0){
                        setWhere += ` OR `; 
                    }
                    setWhere += `TermRelationships.id = :rel_id_${idx+1}`;
                    replacements[`rel_id_${idx+1}`] = item.id;
                });

                setWhere += ')';
            }else{
                setWhere += ' AND TermRelationships.id = null';
            }
        }else{
            return res.status(200).json({
                result: []
            });
        }
       // console.warn(setWhere)

        //  Get relationships with pagination
        resourcesResult = await models.sequelize.query(`
            SELECT * FROM
                (        
                    SELECT  
                        TermRelationships.id as id,
                        ${columns}
                        
                        FROM reda_3.TermRelationships
                        INNER JOIN terms_relations ON terms_relations.term_relationship_id = TermRelationships.id
                        INNER JOIN Terms on Terms.id = terms_relations.term_id
                        WHERE (TermRelationships.deleted_at IS NULL and Terms.deleted_at IS NULL) ${setWhere}
                        GROUP BY id
                ) as Rel
            ORDER BY ${order}
            LIMIT ${((page-1)*limit)}, ${limit}`, 
            {
                replacements,
                type: models.sequelize.QueryTypes.SELECT
            }
        );

        //  Get total rows without pagination
        const totalRows = await models.sequelize.query(`SELECT 
            COUNT(DISTINCT TermRelationships.id) as "count"
            FROM reda_3.TermRelationships
            INNER JOIN terms_relations ON terms_relations.term_relationship_id = TermRelationships.id
            INNER JOIN Terms on Terms.id = terms_relations.term_id
            WHERE (TermRelationships.deleted_at IS NULL and Terms.deleted_at IS NULL) ${setWhere}`, 
        {
            replacements,
            type: models.sequelize.QueryTypes.SELECT
        });

        

        shouldUpdate = true;

        let tempData = {
            rows: resourcesResult
        };
        
        if (shouldUpdate){
            console.warn("CREATNG REDIS")
            redisClient.set(redisKey, JSON.stringify(tempData), 'EX', 60 * 60 * 24 * 2);
        }




        return res.status(200).json({
			result: resourcesResult
        });
    }catch(err) {
        debug(err, "Rels::ERROR");
        return res.status(403).send({
            message:err.message,
            stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
        });
    }

    
    }


}


exports.createOrUpdate = async (req, res) => {
	var userExists = req.userExists;

    //
    //	Check form validation
    //
    const checkData = validate(req.body);
    if (Object.keys(checkData).length != 0 && checkData.constructor === Object){
        return res.status(403).send({form_errors: checkData});
    }

    //
    //	Create app with everything prepared
    //
    var action = req.params.relation ? 'update' : 'create';

    upsert(req, res, action, userExists);
}

//  Add term to relationship
async function upsert(req, res, action, userExists){
    // INIT VARS
    const terms = req.body.terms || null;

    // REMOVE KEYS FROM REDIS
	redisClient.delWildcard(["TAXONOMY::*", "TERMS::*", "TAXONOMIES::*"]);


	if (req.params.relation && action=='update'){

		//
		//	Get instance in order to update
		//
		try{
			if(userExists.Role.type==consts.ADMIN_ROLE){
				const TermRel = await models.TermRelationship.updateEl({
                    id: req.params.relation,
					terms
                }, models,
                dataUtil);
				
				return res.status(200).json({
                    result: TermRel,
                    terms,
                    update: true
                });
			}else{
				res.status(401).send({message: messages.relationship.create_permission});
				return
			}
		}catch(err) {
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			});
		}

	}else if(action=='create'){

		try {
			const TermRel = await models.TermRelationship.createEl({
                terms
            }, models);
	
            return res.status(200).send({result:
                TermRel,
                terms,
                create: true
            });
		}catch(err){
			debug(err);
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			});
		}
	}
}

//
//	Delete
//
exports.deleteEl = async (req, res) => {	
	var userExists = req.userExists;

	// Check AUTH
	if (userExists && req.params.relation){

		const TermsTax = await models.TermRelationship.findOne({
			where: {
				id: req.params.relation
			}
		});

		if (!TermsTax){
			return res.status(403).send({message: messages.relationship.no_exist});
		}
		
		if(TermsTax && userExists.Role.type==consts.ADMIN_ROLE){

            // REMOVE KEYS FROM REDIS
            redisClient.delWildcard(["TAXONOMY::*", "TERMS::*", "TAXONOMIES::*"]);

			//
			//	Delete relationship
			//
			TermsTax.destroy()
			.then(() => {
				// REMOVE KEYS FROM REDIS

				return res.status(200).send({});
			})
			.catch(function(err){
				return res.status(403).send({
                    message:err.message,
                    stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
                });
			});
			
		}else{
			return res.status(401).send({message: messages.relationship.del_permission});
		}
		
	}else{
		return res.status(401).send({message: messages.relationship.del_permission});
	}
}