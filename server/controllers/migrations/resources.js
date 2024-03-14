const models = require('../../models/index');
const dataUtil = require('../../utils/dataManipulation');
const { debug } = require('../../utils/dataManipulation');
const Op = models.Sequelize.Op;

//  ======================================================================
//  Import resources and ratings
//  ======================================================================
exports.resources = async () => {
    let newData = null;
    let curResources = null;

    //  ======================================================================
    //  Get resources from old DB and Type from new one
    //  ======================================================================
    let prevData = null;
    let type = null;
    try{
        prevData = await models.secondSq.query(`SELECT * from Resources ORDER BY id;
        `, { type: models.secondSq.QueryTypes.SELECT});
        
        type = await models.Type.findOne({
            where: {
                slug: 'RESOURCES'
            }
        });

    }catch(err){
        return {data: null, err};
    }

    //  ======================================================================
    //  Get resources from new DB with slug and ID
    //  ======================================================================
    try{
        curResources = await models.Resource.scope('all').findAll(
            {
                paranoid: false,
                include: [
                    {
                        model: models.Type,
                        attributes:[],
                        where: {
                            id: type.id
                        }
                    }
                ],
                attributes: [
                    'id',
                    'slug'
                ],
                raw: true,
            }
        );

    }catch(err){
        return {data: null, err};
    }

    let finalData = [];

    prevData.map((res) => {    
        const {
            title,
            slug,
            description,
            operation,
            operation_author,
            techResources,
            author,
            organization,
            duration,
            email,
            highlight,
            exclusive,
            embed,
            link,
            approved,
            approvedScientific,
            approvedLinguistic,
            status,
            created_at,
            updated_at,
            deleted_at,
            user_id
        } = res;

        let toImport = {
            title,
            slug,
            description,
            operation,
            operation_author,
            techResources,
            author,
            organization,
            duration,
            email,
            highlight,
            exclusive,
            embed,
            link,
            approved,
            approvedScientific,
            approvedLinguistic,
            status,
            created_at,
            updated_at,
            deleted_at,
            user_id,
            type_id: type.id
        };

        // Check if slug already exists in new DB
        let exists = curResources.find(e => e.slug === res.slug);
        
        // If exists, set ID as that one in order to updateOnDuplicateKey
        if(exists){
            
            toImport.id = exists.id;
        }

        finalData.push(toImport);
    });

    try{
        newData = await models.Resource.bulkCreate(finalData,                
        {
            ignoreDuplicates: true
        });
        
    }catch(err){
        debug(err,'migration','resources');
        return {data: null, err};
    }

    //  ======================================================================
    //  DEAL WITH RATINGS
    //  ======================================================================
    let prevRatings = null;
    let newResources = null;
    let finalRatings = [];
    try{
        // Ratings from old DB
        prevRatings = await models.secondSq.query(`SELECT * from Ratings ORDER BY id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        // Resources added
        newResources = await models.Resource.scope(null).findAll({
            paranoid: false,
            raw: true,
            attributes: [
                'id',
                'title',
                'slug'
            ]
        });
    }catch(err){
        debug(err,'migration','resources-ratings');
        return {data: null, err};
    }

    let newRatings = null;
    try{
        prevRatings.map(rating => {

            const { id, value, status, created_at, updated_at, user_id, resource_id } = rating;

            // Get old resource object
            let oldRes = prevData.find(e => e.id === resource_id);

            // Compare old resource object with new one based on slug
            let newRes = oldRes ? newResources.find(e => e.slug === oldRes.slug) : null;

            finalRatings.push({
                id,
                value,
                status,
                created_at,
                updated_at,
                user_id,
                resource_id: newRes ? newRes.id : null
            })
        });

    
        newRatings = await models.Rating.bulkCreate(finalRatings,                
        {
            ignoreDuplicates: true
        });

        return {data: {resources: newData, ratings: newRatings}, err:null};
        
    }catch(err){
        debug(err,'migration','resources');
        return {data: null, err};
    }
}

//  ======================================================================
//  Import resources files
//  ======================================================================
exports.files = async () => {
    let prevFiles = null;
    let newResources = null;
    let finalFiles = [];
    let prevData = null;

    //  ======================================================================
    //  Get older files, the new resources and the old ones
    //  ======================================================================
    try{
        // Files from old DB
        prevFiles = await models.secondSq.query(`SELECT * from Files ORDER BY id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        prevData = await models.secondSq.query(`SELECT * from Resources ORDER BY id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        // Resources added
        newResources = await models.Resource.scope(null).findAll({
            paranoid: false,
            attributes: [
                'id',
                'title',
                'slug'
            ]
        });
    }catch(err){
        debug(err,'migration','resources-files');
        return {data: null, err};
    }

    //  ======================================================================
    //  Add Files to the new DB
    //  ======================================================================
    try{
        
        prevFiles.map(file => {

            const { 
                id,
                name,
                extension,
                status,
                created_at,
                updated_at,
             } = file;

            finalFiles.push({
                id,
                name,
                extension,
                status,
                created_at,
                updated_at,
            })
        });

    
        await models.File.bulkCreate(finalFiles,                
        {
            ignoreDuplicates: true
        });
        
    }catch(err){
        debug(err,'migration','resources');
        return {data: null, err};
    }

    //  ======================================================================
    //  For each file, associate a resource
    //  ======================================================================
    try{ 
        let finalData = [];
            
        prevFiles.map(file => {
            const { 
                id,
                resource_id
             } = file;

            // Get old resource object
            let oldRes = prevData.find(e => e.id === resource_id);

            // Compare old resource object with new one based on slug
            let newRes = oldRes ? newResources.find(e => e.slug === oldRes.slug) : null;

            if(newRes){
                finalData.push({
                    file_id: id,
                    resource_id: newRes.id
                })
            }
        });

        await models.resource_file.bulkCreate(finalData,
        {
            ignoreDuplicates: true
        });

    }catch(err){
        debug(err,'migration','resources');
        return {data: null, err};
    }

    return {data: true, err: null};
}

//  ======================================================================
//  Associate terms
//  ======================================================================
exports.terms = async () => {
    let newRes = null;
    let newTerms = null;
    let oldDbMark = null;
    let oldData = {};
    let finalData = [];

    //  ======================================================================
    //  Get old and new resources 
    //  ======================================================================
    try{
        newRes = await models.Resource.scope(null).findAll({
            paranoid: false
        });

        newTerms = await models.Term.scope(null).findAll({
            include: [
                {
                    model: models.Taxonomy,
                    attributes: ['id', 'slug'],
                    where: {
                        slug: {
                            [Op.in]: ['areas_resources','dominios_resources','anos_resources', 'formato_resources', 'lang_resources', 'modos_resources', 'tags_resources']
                        }
                    }
                }
            ],
            paranoid: false
        });

        oldDbMark = await models.Term.scope(null).findOne({
            where:{
                slug: {
                    [Op.eq]: "v3-version"
                }
            },
            include: [
                {
                    model: models.Taxonomy,
                    attributes: ['id', 'slug'],
                    where: {
                        slug: {
                            [Op.in]: ['versao_reda']
                        }
                    }
                }
            ]
        })

    }catch(err){
        debug(err,'migration','resources:terms');
        return {data: null, err};
    }

    try{
        //  ============================================================================================================================================
        //  Get connections from old DB via resource_domain, resource_language, resource_mode, resource_subject, resource_tag, resource_year
        //  ============================================================================================================================================
        /* oldData.dominios_resources = await models.secondSq.query(`SELECT resource_domain.resource_id, Resources.slug as res_slug, resource_domain.domain_id as term_id, Domains.title as term_title
        FROM resource_domain
        INNER JOIN Domains on resource_domain.domain_id = Domains.id
        INNER JOIN Resources on resource_domain.resource_id = Resources.id;
        `, { type: models.secondSq.QueryTypes.SELECT});      

        oldData.areas_resources = await models.secondSq.query(`SELECT resource_subject.resource_id, Resources.slug as res_slug, resource_subject.subject_id as term_id, Subjects.title as term_title
        FROM resource_subject
        INNER JOIN Subjects on resource_subject.subject_id = Subjects.id
        INNER JOIN Resources on resource_subject.resource_id = Resources.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        oldData.tags_resources = await models.secondSq.query(`SELECT resource_tag.resource_id, Resources.slug as res_slug, resource_tag.tag_id as term_id, Tags.title as term_title
        FROM resource_tag
        INNER JOIN Tags on resource_tag.tag_id = Tags.id
        INNER JOIN Resources on resource_tag.resource_id = Resources.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        oldData.anos_resources = await models.secondSq.query(`SELECT resource_year.resource_id, Resources.slug as res_slug, resource_year.year_id as term_id, Years.title as term_title 
        FROM resource_year 
        INNER JOIN Years on resource_year.year_id = Years.id
        INNER JOIN Resources on resource_year.resource_id = Resources.id;
        `, { type: models.secondSq.QueryTypes.SELECT}); */

        oldData.lang_resources = await models.secondSq.query(`SELECT resource_language.resource_id, Resources.slug as res_slug, resource_language.language_id as term_id, Languages.title as term_title
        FROM resource_language
        INNER JOIN Languages on resource_language.language_id = Languages.id
        INNER JOIN Resources on resource_language.resource_id = Resources.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        oldData.modos_resources = await models.secondSq.query(`SELECT resource_mode.resource_id, Resources.slug as res_slug, resource_mode.mode_id as term_id, Modes.title as term_title
        FROM resource_mode
        INNER JOIN Modes on resource_mode.mode_id = Modes.id
        INNER JOIN Resources on resource_mode.resource_id = Resources.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        oldData.formato_resources = await models.secondSq.query(`SELECT Resources.id as resource_id, Resources.slug as res_slug, Resources.format_id as term_id, Formats.title as term_title 
        FROM Resources
        INNER JOIN Formats on Resources.format_id = Formats.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

    }catch(err){
        debug(err,'migration','resources:terms');
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
                let thisResObj = newRes.find(el => {
                    return el.slug === obj.res_slug;
                })

                if(thisTermObj && thisResObj){
                    finalData.push({
                        term_id: thisTermObj.id,
                        resource_id: thisResObj.id
                    })
                }
            })
        });

        // Mark these resources as coming from old BD
        if(oldDbMark){
            newRes.map(el => {
                finalData.push({
                    term_id: oldDbMark.id,
                    resource_id: el.id
                });
            })
        }
        

        let dbData = await models.resource_term.bulkCreate(finalData,{
            ignoreDuplicates: true
        })

        return { data: dbData, err: null}
        

    }catch(err){
        debug(err,'migration','resources:terms');
        return {data: null, err};
    }
}

//  ======================================================================
//  Favorites
//  ======================================================================
exports.favorites = async () => {
    let newRes = null;
    let oldData = null;
    let finalData = [];

    //  ======================================================================
    //  Get new resources and favorites from old DB
    //  ======================================================================
    try{
        newRes = await models.Resource.scope(null).findAll({
            paranoid: false
        });

        oldData = await models.secondSq.query(`SELECT resource_favorite.resource_id, Resources.slug as res_slug, resource_favorite.user_id as user_id
        FROM resource_favorite
        INNER JOIN Resources on resource_favorite.resource_id = Resources.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

    }catch(err){
        debug(err,'migration','resources:favorites');
        return {data: null, err};
    }

    //  ======================================================================
    //  Add favorites to new db
    //  ======================================================================
    try{
        oldData.map(row => {
            //  Get resource from new DB, based on resource slug
            let thisResObj = newRes.find(el => {
                return el.slug === row.res_slug;
            })

            if(thisResObj){
                finalData.push({
                    user_id: row.user_id,
                    resource_id: thisResObj.id
                })
            }

        });

        let dbData = await models.resource_favorite.bulkCreate(finalData,{
            ignoreDuplicates: true
        })

        return { data: dbData, err: null}

    }catch(err){
        debug(err,'migration','resources:favorites');
        return {data: null, err};
    }
}

//  ======================================================================
//  Contacts
//  ======================================================================
exports.contacts = async () => {
    let oldData = null;
    let finalData = [];
    let newRes = null;

    //  ======================================================================
    //  Get new resources and contacts from old DB
    //  ======================================================================
    try{
        newRes = await models.Resource.scope(null).findAll({
            paranoid: false
        });

        oldData = await models.secondSq.query(`SELECT Contacts.id,
        Contacts.description,
        Contacts.status,
        Contacts.created_at,
        Contacts.updated_at,
        Contacts.deleted_at,
        Contacts.resource_id, 
        Resources.slug as res_slug, 
        Contacts.user_id as user_id
        FROM Contacts
        INNER JOIN Resources on Contacts.resource_id = Resources.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

    }catch(err){
        debug(err,'migration','resources:contacts');
        return {data: null, err};
    }

    //  ======================================================================
    //  Add favorites to new db
    //  ======================================================================
    try{
        oldData.map(row => {
            //  Get resource from new DB, based on resource slug
            let thisResObj = newRes.find(el => {
                return el.slug === row.res_slug;
            })

            if(thisResObj){
                finalData.push({
                    id: row.id,
                    user_id: row.user_id,
                    resource_id: thisResObj.id,
                    description: row.description,
                    status: 'READ',
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    deleted_at: row.deleted_at
                })
            }

        });

        let dbData = await models.Contact.bulkCreate(finalData,{
            ignoreDuplicates: true
        })

        return { data: dbData, err: null}

    }catch(err){
        return {data: null, err};
    }
}

//  ======================================================================
//  Convert resource first script to seperated one
//  ======================================================================
exports.resourceFirstScript = async () => {
    let newRes = null;
    let type = null;
    let oldData = {};
    let newScripts = null;
    let newTerms = null;

    try{
        //  ============================================================================================================================================
        //  Get connections from old DB via resource_domain, resource_language, resource_mode, resource_subject, resource_tag, resource_year
        //  ============================================================================================================================================
        oldData.dominios_resources = await models.secondSq.query(`SELECT resource_domain.resource_id, Resources.slug as res_slug, resource_domain.domain_id as term_id, Domains.title as term_title
        FROM resource_domain
        INNER JOIN Domains on resource_domain.domain_id = Domains.id
        INNER JOIN Resources on resource_domain.resource_id = Resources.id;
        `, { type: models.secondSq.QueryTypes.SELECT});


        oldData.areas_resources = await models.secondSq.query(`SELECT resource_subject.resource_id, Resources.slug as res_slug, resource_subject.subject_id as term_id, Subjects.title as term_title
        FROM resource_subject
        INNER JOIN Subjects on resource_subject.subject_id = Subjects.id
        INNER JOIN Resources on resource_subject.resource_id = Resources.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        oldData.tags_resources = await models.secondSq.query(`SELECT resource_tag.resource_id, Resources.slug as res_slug, resource_tag.tag_id as term_id, Tags.title as term_title
        FROM resource_tag
        INNER JOIN Tags on resource_tag.tag_id = Tags.id
        INNER JOIN Resources on resource_tag.resource_id = Resources.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        oldData.anos_resources = await models.secondSq.query(`SELECT resource_year.resource_id, Resources.slug as res_slug, resource_year.year_id as term_id, Years.title as term_title 
        FROM resource_year 
        INNER JOIN Years on resource_year.year_id = Years.id
        INNER JOIN Resources on resource_year.resource_id = Resources.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

    }catch(err){
        debug(err,'migration','resources:terms');
        return {data: null, err};
    }

    //  ======================================================================
    //  Get resources from new DB
    //  ======================================================================
    try{
        type = await models.Type.findOne({
            where: {
                slug: 'RESOURCES'
            }
        });

        newTerms = await models.Term.scope(null).findAll({
            include: [
                {
                    model: models.Taxonomy,
                    attributes: ['id', 'slug'],
                    where: {
                        slug: {
                            [Op.in]: ['areas_resources','dominios_resources','anos_resources', 'tags_resources']
                        }
                    }
                }
            ],
            paranoid: false
        });

        newRes = await models.Resource.scope('all').findAll(
            {
                paranoid: false,
                include: [
                    {
                        model: models.Type,
                        attributes:[],
                        where: {
                            id: type.id
                        }
                    },
                    {
                        model: models.Script,
                        as: "Scripts",
                        required: false,
                        where: {
                            main: true
                        }
                    }
                ],
                attributes: [
                    'id',
                    'slug',
                    'operation',
                    'approved',
                    'status',
                    'created_at',
                    'updated_at',
                    'deleted_at',
                    'user_id',
                    'approvedScientific',
                    'approvedLinguistic'
                ],
            }
        );

    }catch(err){
        return {data: null, err};
    }
    
    //  ======================================================================
    //  For each resource, create a main script if doesn't exist already
    //  ======================================================================
    try{
        if(newRes){
            let finalData = [];

            await Promise.all(newRes.map(async res => {
                let data = {
                    operation: res.operation,
                    approved: res.approved,
                    status: res.status,
                    created_at: res.created_at,
                    updated_at: res.updated_at,
                    deleted_at: res.deleted_at,
                    user_id: res.user_id,
                    approvedScientific: res.approvedScientific,
                    approvedLinguistic: res.approvedLinguistic,
                    resource_id: res.id,
                    main: true
                };

                if (res.Scripts.length>0){
                    data.id = res.Scripts[0].id;
                }

                finalData.push(data);
            }));

            await models.Script.bulkCreate(finalData,{
                ignoreDuplicates: true
            }); 

            newScripts = await models.Script.findAll({
                paranoid: false,
                attributes: ['id', 'resource_id'],
                include: [
                    {
                        model: models.Resource,
                        attributes: ['id', 'slug']
                    }
                ],
                where: {
                    main: true
                }
            });
        }
    }catch(err){
        return {data: null, err};
    }
    
    //  ======================================================================
    //  For each script, set terms
    //  ======================================================================
    if(newScripts && newScripts.length>0){
        let finalScriptsTerms = [];
        let dbData = null;

        try{
            //  ============================================================================================================================================
            //  Add script terms based on taxonomy
            //  oldData -> List of taxonomies
            //  ============================================================================================================================================
            Object.keys(oldData).map(key => {
                oldData[key].map(obj => {
                    //  Get term from new DB, based on taxonomy slug (KEY) and term title
                    let thisTermObj = newTerms.find(el => {
                        return el.Taxonomy.slug === key && el.title == obj.term_title;
                    });
    
                    //  Get script from new DB, based on resource id
                    let thisScriptObj = newScripts.find(script => {
                        return script.Resource.slug === obj.res_slug;
                    })
    
                    if(thisTermObj && thisScriptObj){
                        finalScriptsTerms.push({
                            term_id: thisTermObj.id,
                            script_id: thisScriptObj.id
                        })
                    }
                })
            });
    
            dbData = await models.script_term.bulkCreate(finalScriptsTerms,{
                ignoreDuplicates: true
            });         
    
        }catch(err){
            debug(err,'migration','resources_script:terms:Error');
            return {data: null, err};
        }

        //  ============================================================================================================================================
        //  Create tag with name of Resource and add it to script
        //  ============================================================================================================================================
        try{
            const tagsTax = models.Taxonomy.findOne({
                where: {
                    slug: 'tags_resources'
                }
            });

            newRes = await models.Resource.scope('all').findAll(
                {
                    paranoid: false,
                    include: [
                        {
                            model: models.Type,
                            attributes:[],
                            where: {
                                id: type.id
                            }
                        },
                        {
                            model: models.Script,
                            as: "Scripts",
                            required: false,
                            where: {
                                main: true
                            }
                        }
                    ],
                    attributes: [
                        'id',
                        'title',
                        'slug',
                        'operation',
                        'approved',
                        'status',
                        'created_at',
                        'updated_at',
                        'deleted_at',
                        'user_id',
                        'approvedScientific',
                        'approvedLinguistic'
                    ],
                }
            );

            if(!tagsTax){
                throw new Error("No tax for tags");
            }

            let finalTags = [];
            
            if(newRes && newRes.length>0){
                //  Build final tags based on resource title
                await Promise.all(newRes.map(async res => {
                    finalTags.push({
                        title: res.title,
                        taxonomy_id: tagsTax.id,
                        slug: await dataUtil.createSlug(res.title, models.Term, null, false, models)
                    })
                }));
            }
            

            //  Add tags to BD
            await models.Term.bulkCreate(finalTags,                
            {
                ignoreDuplicates: true
            });

            //  Get tags
            newTerms = await models.Term.scope(null).findAll({
                include: [
                    {
                        model: models.Taxonomy,
                        attributes: ['id', 'slug'],
                        where: {
                            slug: {
                                [Op.in]: ['tags_resources']
                            }
                        }
                    }
                ],
                paranoid: false
            });

            let finalScriptsTerms = [];
            newRes.map(res => {
                //  Get term from new DB, based on term title if is equal to resource title
                let thisTermObj = newTerms.find(term => {
                    return term.title == res.title;
                });

                if(thisTermObj && res.Scripts && res.Scripts.length>0){
                    finalScriptsTerms.push({
                        term_id: thisTermObj.id,
                        script_id: res.Scripts[0].id
                    })
                }
            })

            dbData = await models.script_term.bulkCreate(finalScriptsTerms,{
                ignoreDuplicates: true
            }); 

            return { data: dbData, err: null}
            

            

        }catch(err){
            debug(err,'migration','resources_script:terms:Error');
            return {data: null, err};
        }
    }

    return { data: null, err: null}
}