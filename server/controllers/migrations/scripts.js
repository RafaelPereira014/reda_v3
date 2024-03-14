const models = require('../../models/index');
const { debug } = require('../../utils/dataManipulation');
const Op = models.Sequelize.Op;

//  ======================================================================
//  Import scripts
//  ======================================================================
exports.scripts = async () => {
    let oldData = null;
    let newRes = null;
    let finalData = [];

    try{
        oldData = await models.secondSq.query(`SELECT Scripts.id,
            Scripts.title,
            Scripts.description,
            Scripts.operation,
            Scripts.approved,
            Scripts.status,
            Scripts.created_at,
            Scripts.updated_at,
            Scripts.deleted_at,
            Scripts.resource_id,
            Scripts.user_id,
            Scripts.approvedScientific,
            Scripts.approvedLinguistic,
            Resources.slug as res_slug
        FROM Scripts
            INNER JOIN Resources on Scripts.resource_id = Resources.id
            ORDER BY id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        newRes = await models.Resource.scope(null).findAll({
            paranoid: false
        });
    }catch(err){
        debug(err,'migration','scripts');
        return {data: null, err};
    }
    
    try{
        oldData.map(row => {
            //  Get resource from new DB, based on resource slug
            let thisResObj = newRes.find(el => {
                return el.slug === row.res_slug;
            })

            if(thisResObj){
                finalData.push({
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    operation: row.operation,
                    approved: row.approved,
                    status: row.status,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    deleted_at: row.deleted_at,
                    user_id: row.user_id,
                    approvedScientific: row.approvedScientific,
                    approvedLinguistic: row.approvedLinguistic,
                    resource_id: thisResObj.id,
                })
            }

        });

        let dbData = await models.Script.bulkCreate(finalData,{
            ignoreDuplicates: true
        })

        return { data: dbData, err: null}
    }catch(err){
        debug(err,'migration','scripts');
        return {data: null, err};
    }
}

//  ======================================================================
//  Associate terms
//  ======================================================================
exports.terms = async () => {
    let newTerms = null;
    let oldData = {};
    let finalData = [];

    //  ======================================================================
    //  Get old and new resources 
    //  ======================================================================
    try{

        newTerms = await models.Term.scope(null).findAll({
            include: [
                {
                    model: models.Taxonomy,
                    attributes: ['id', 'slug'],
                    where: {
                        slug: {
                            [Op.in]: ['areas_resources','dominios_resources','anos_resources', 'lang_resources']
                        }
                    }
                }
            ],
            paranoid: false
        })

    }catch(err){
        debug(err,'migration','scripts:terms');
        return {data: null, err};
    }

    try{
        //  ============================================================================================================================================
        //  Get connections from old DB via resource_domain, resource_language, resource_mode, resource_subject, resource_tag, resource_year
        //  ============================================================================================================================================
        oldData.dominios_resources = await models.secondSq.query(`SELECT script_domain.script_id, script_domain.domain_id as term_id, Domains.title as term_title
        FROM script_domain
        INNER JOIN Domains on script_domain.domain_id = Domains.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        oldData.lang_resources = await models.secondSq.query(`SELECT script_language.script_id, script_language.language_id as term_id, Languages.title as term_title
        FROM script_language
        INNER JOIN Languages on script_language.language_id = Languages.id;
        `, { type: models.secondSq.QueryTypes.SELECT});
        
        oldData.areas_resources = await models.secondSq.query(`SELECT script_subject.script_id, script_subject.subject_id as term_id, Subjects.title as term_title
        FROM script_subject
        INNER JOIN Subjects on script_subject.subject_id = Subjects.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        oldData.anos_resources = await models.secondSq.query(`SELECT script_year.script_id, script_year.year_id as term_id, Years.title as term_title
        FROM script_year 
        INNER JOIN Years on script_year.year_id = Years.id
        `, { type: models.secondSq.QueryTypes.SELECT});

    }catch(err){
        debug(err,'migration','scripts:terms');
        return {data: null, err};
    }

    try{
        //  ============================================================================================================================================
        //  Add to relationship based on taxonomy
        //  ============================================================================================================================================

        Object.keys(oldData).map(key => {
            oldData[key].map(obj => {
                //  Get term from new DB, based on taxonomy slug (KEY) and term title
                let thisTermObj = newTerms.find(el => {
                    return el.Taxonomy.slug === key && el.title == obj.term_title;
                });

                if(thisTermObj){
                    finalData.push({
                        term_id: thisTermObj.id,
                        script_id: obj.script_id
                    })
                }
            })

        });

        let dbData = await models.script_term.bulkCreate(finalData,{
            ignoreDuplicates: true
        })

        return { data: dbData, err: null}
        

    }catch(err){
        debug(err,'migration','scripts:terms');
        return {data: null, err};
    }
}

//  ======================================================================
//  Import scripts files
//  ======================================================================
exports.files = async () => {
    let prevData = null;
    let finalFiles = [];

    //  ======================================================================
    //  Get older files, the new resources and the old ones
    //  ======================================================================
    try{
        // Files from old DB
        prevData = await models.secondSq.query(`SELECT * from script_file;
        `, { type: models.secondSq.QueryTypes.SELECT});
    }catch(err){
        debug(err,'migration','scripts:files');
        return {data: null, err};
    }

    //  ======================================================================
    //  Add Files to the new DB
    //  ======================================================================

    try{ 
        let finalData = [];
            
        prevData.map(file => {
            const { 
                file_id,
                script_id,
                updated_at,
                created_at
             } = file;

             finalData.push({
                file_id,
                script_id,
                updated_at,
                created_at
            });
        });

        finalFiles = await models.script_file.bulkCreate(finalData,
        {
            ignoreDuplicates: true
        });
        
        return {data: finalFiles, err: null};
    }catch(err){
        debug(err,'migration','scripts:files');
        return {data: null, err};
    }

    
}