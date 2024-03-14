const models = require('../../models/index');
const { debug } = require('../../utils/dataManipulation');
const Op = models.Sequelize.Op;

//  ======================================================================
//  Import apps
//  ======================================================================
exports.apps = async () => {
    let oldData = null;
    let type = null;
    let curResources = null;
    let finalData = [];

    //  ======================================================================
    //  Get apps from old DB
    //  ======================================================================
    try{
        oldData = await models.secondSq.query(`SELECT *
            FROM Apps;
        `, { type: models.secondSq.QueryTypes.SELECT});

        curResources = await models.Resource.scope('all').findAll({
            paranoid: false,
            attributes: [
                'id',
                'slug'
            ],
        });

        type = await models.Type.findOne({
            where: {
                slug: 'APPS'
            }
        })

    }catch(err){
        debug(err,'migration','apps');
        return {data: null, err};
    }

    //  ======================================================================
    //  Add apps to new db
    //  ======================================================================
    try{

        oldData.map(row => {

            let toImport = {
                title: row.title,
                slug: row.slug,
                description: row.description,
                status: row.status,
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at,
                user_id: row.user_id,
                type_id: type.id,
                image_id: row.image_id,
                approved: 1,
                approvedScientific: 1,
                approvedLinguistic: 1
            };

            // Check if slug already exists in new DB
            let exists = curResources.find(e => e.slug === row.slug && e.type_id===type.id);
            
            // If exists, set ID as that one in order to updateOnDuplicateKey
            if(exists){                
                toImport.id = exists.id;
            }

            finalData.push(toImport);
        });

        let dbData = await models.Resource.bulkCreate(finalData,{
            ignoreDuplicates: true
        })

        return { data: dbData, err: null}

    }catch(err){
        debug(err,'migration','apps');
        return {data: null, err};
    }
}

exports.images = async () => {
    let oldData = null;
    let curResources = null;
    let finalData = [];

    //  ======================================================================
    //  Get apps from old DB
    //  ======================================================================
    try{
        oldData = await models.secondSq.query(`SELECT slug, image_id
            FROM Apps;
        `, { type: models.secondSq.QueryTypes.SELECT});

        curResources = await models.Resource.scope('all').findAll({
            paranoid: false,
            attributes: [
                'id',
                'slug'
            ],
            include: [
                {
                    model: models.Type,
                    where: {
                        slug: 'APPS'
                    }
                }
            ]
        });

    }catch(err){
        debug(err,'migration','apps:images');
        return {data: null, err};
    }

    //  ======================================================================
    //  Add apps to new db
    //  ======================================================================
    try{

        oldData.map(row => {

            let toImport = {
                image_id: row.image_id
            };

            // Check if slug already exists in new DB
            let exists = curResources.find(e => e.slug === row.slug);
            
            // If exists, set ID as that one in order to updateOnDuplicateKey
            if(exists){                
                toImport.resource_id = exists.id;
                finalData.push(toImport);
            }
        });

        let dbData = await models.resource_image.bulkCreate(finalData,{
            ignoreDuplicates: true
        })

        return { data: dbData, err: null}

    }catch(err){
        debug(err,'migration','apps:images');
        return {data: null, err};
    }
}

//  ======================================================================
//  Associate terms
//  ======================================================================
exports.terms = async () => {
    let newApps = null;
    let newTerms = null;
    let oldData = {};
    let finalData = [];

    //  ======================================================================
    //  Get new apps and terms
    //  ======================================================================
    try{
        newApps = await models.Resource.scope(null).findAll({
            paranoid: false
        });

        newTerms = await models.Term.scope(null).findAll({
            include: [
                {
                    model: models.Taxonomy,
                    attributes: ['id', 'slug'],
                    where: {
                        slug: {
                            [Op.in]: ['categorias_apps','temas_apps','sistemas_apps', 'tags_apps']
                        }
                    }
                }
            ],
            paranoid: false
        })

    }catch(err){
        debug(err,'migration','apps:terms');
        return {data: null, err};
    }

    try{
        //  ============================================================================================================================================
        //  Get connections from old DB via app_category, app_systems, app_tag, app_theme
        //  ============================================================================================================================================
        oldData.categorias_apps = await models.secondSq.query(`SELECT app_category.app_id, Apps.slug as app_slug, app_category.category_id as term_id, Categories.title as term_title
        FROM app_category
        INNER JOIN Apps on app_category.app_id = Apps.id
        INNER JOIN Categories on app_category.category_id = Categories.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        oldData.sistemas_apps = await models.secondSq.query(`SELECT app_systems.app_id, app_systems.link as metadata, Apps.slug as app_slug, app_systems.system_id as term_id, Systems.title as term_title
        FROM app_systems
        INNER JOIN Apps on app_systems.app_id = Apps.id
        INNER JOIN Systems on app_systems.system_id = Systems.id;
        `, { type: models.secondSq.QueryTypes.SELECT});
        
        oldData.tags_apps = await models.secondSq.query(`SELECT app_tag.app_id, Apps.slug as app_slug, app_tag.tag_id as term_id, Tags.title as term_title
        FROM app_tag
        INNER JOIN Apps on app_tag.app_id = Apps.id
        INNER JOIN Tags on app_tag.tag_id = Tags.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        oldData.temas_apps = await models.secondSq.query(`SELECT app_theme.app_id, Apps.slug as app_slug, app_theme.theme_id as term_id, Themes.title as term_title
        FROM app_theme
        INNER JOIN Apps on app_theme.app_id = Apps.id
        INNER JOIN Themes on app_theme.theme_id = Themes.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

    }catch(err){
        debug(err,'migration','apps:terms');
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

                //  Get resource from new DB, based on resource slug
                let thisAppObj = newApps.find(el => {
                    return el.slug === obj.app_slug;
                })

                if(thisTermObj && thisAppObj){
                    let toImport = {
                        term_id: thisTermObj.id,
                        resource_id: thisAppObj.id
                    };

                    if(obj.metadata){
                        toImport.metadata = obj.metadata;
                    }
                    finalData.push(toImport);
                }
            })

        });

        let dbData = await models.resource_term.bulkCreate(finalData,{
            ignoreDuplicates: true
        })

        return { data: dbData, err: null}
        

    }catch(err){
        debug(err,'migration','apps:terms');
        return {data: null, err};
    }
}