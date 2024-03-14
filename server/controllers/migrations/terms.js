const models = require('../../models/index');
const dataUtil = require('../../utils/dataManipulation');
const { debug } = require('../../utils/dataManipulation');
const Op = models.Sequelize.Op;

exports.domains = async () => {
    try{
        const schema = { columns: ['id','title', 'created_at', 'updated_at', 'deleted_at'] };
        const columns = [dataUtil.prefix('Dom',schema.columns), ...dataUtil.prefix('Sub',schema.columns)];

        // Get subjects with domains
        let prevDbDomains = await models.secondSq.query(`SELECT ${columns.join(',')} from Domains as Dom
            INNER JOIN domain_subject on domain_subject.domain_id = Dom.id
            INNER JOIN Subjects as Sub on domain_subject.subject_id = Sub.id
            ORDER BY Sub.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

        let finalStructure = [];
        let curSubject = null;
        let subCounter = 0;

        // Get subject and domains tax
        let subTax = await models.Taxonomy.findOne({
            where: {
                slug: {
                    [Op.eq]: 'areas_resources'
                }
            }
        });
        let domTax = await models.Taxonomy.findOne({
            where: {
                slug: {
                    [Op.eq]: 'dominios_resources'
                }
            }
        });    
        
        // For each domains, build object
        prevDbDomains.map( (row, idx) => {

            // Update current subject if is different now
            if (curSubject!==row.Sub_id ){
                curSubject = row.Sub_id;
                if(idx>0){
                    subCounter++;
                }
                
            }

            // Check if is new subject
            if(finalStructure[subCounter] == null){
                finalStructure[subCounter] = {
                    id: row.Sub_id,
                    title: row.Sub_title,
                    Domains: []
                };
            }

            // Add domain to current subject
            finalStructure[subCounter].Domains.push({
                id: row.Dom_id,
                title: row.Dom_title
            });
        });

        /* return res.status(200).json({result: finalStructure}); */


        // ===========================
        // STARTING TO PUSH TO NEW DATABASE
        // ===========================
        if(finalStructure && finalStructure.length>0){
            
            // Each row is a subject
            // Add if doesn't exist
            await Promise.all(finalStructure.map(async (row) => {
                // Find or create subject
                let addSub = await models.Term.findOrCreate({
                    where: {
                        title: row.title,
                        taxonomy_id: subTax.id
                    }, 
                    defaults: {
                        slug: await dataUtil.createSlug(row.title, models.Term, null, false, models)
                    }
                });

                
                // Get subject relationships (level 2)
                let subRels = await models.Term.findAll({
                    include: [
                        {
                            model: models.TermRelationship,
                            as: 'Relationship',
                            required: true,
                            attributes: ['id']
                        }
                    ],
                    where: {
                        id: addSub[0].id
                    }
                });

                // If there is no relationship, create one with level 3

                if(subRels && subRels.length>0){
                    let finalRels = [];
                    subRels.map( el => {
                        el.Relationship.map(rel => finalRels.push(rel.id));
                    });
                    subRels = finalRels;
                }

                // For each domain, add if doesn't exist
                await Promise.all(row.Domains.map( async (domain) => {
                    
                    // Find or create new domain
                    await models.Term.findOrCreate({
                        where: {
                            title: domain.title,
                            taxonomy_id: domTax.id
                        }, 
                        defaults: {
                            slug: await dataUtil.createSlug(domain.title, models.Term, null, false, models)
                        }
                    });

                    // ==================================
                    // Set relationship
                    // ==================================

                    // Check if term already has relationships (level 4)
                    /* let domainRels = await models.Term.findAll({
                        include: [
                            {
                                model: models.TermRelationship,
                                as: 'Relationship',
                                required: true,
                                attributes: ['id'],
                                through: {
                                    level: 4
                                }
                            }
                        ],
                        where: {
                            id: addDomain[0].id,
                        }
                    }); */                    

                    // Check if relationship already exists based on previous queries
                    /* let relExists = false;
                    if(domainRels && domainRels.length>0 && subRels && subRels.length>0){
                        let finalRels = [];
                        domainRels.map( el => {
                            el.Relationship.map(rel => finalRels.push(rel.id));
                        });
                        domainRels = finalRels;
                        relExists = domainRels.filter(el => subRels.indexOf(el));
                    } */

                    // If one of the elements doesn't have relationships,
                    // or both have relationships but none are the same, create new
                    /* if(!domainRels || domainRels.length==0 || !subRels || subRels.length==0 || !relExists){
                        let newRel = await models.TermRelationship.create({});
                        newRel.setTerms([addSub[0].id], { through: {level: 3 }});
                        newRel.setTerms([addDomain[0].id], { through: {level: 4 }});
                    } */
                }));

            }));
        }

        return {data: finalStructure, err: null};

    }catch(err){
        debug(err,'migration');
        return {data: null, err: err};
    }
}

exports.tags = async () => {
    let prevTags = null;
    let recTags = null;
    let appTags = null;
    let toolsTags = null;
    let studentsTags = null;

    try{

        // Get tags
        prevTags = await models.secondSq.query(`SELECT id, title, type, created_at, updated_at, deleted_at from Tags
            where deleted_at IS NULL;
        `, { type: models.secondSq.QueryTypes.SELECT});

        recTags = await models.Taxonomy.findOne({
            where: {
                slug: 'tags_resources'
            }
        });

        appTags = await models.Taxonomy.findOne({
            where: {
                slug: 'tags_apps'
            }
        });

        toolsTags = await models.Taxonomy.findOne({
            where: {
                slug: 'tags_tools'
            }
        });

        studentsTags = await models.Taxonomy.findOne({
            where: {
                slug: 'tags_students'
            }
        });
    }catch(err){
        debug(err,'migration');
        return {data:null, err};
    }
    
    let curType = null;
    let curTerms = null;

    //  ======================================================================
    //  Get terms from new DB with slug and ID
    //  ======================================================================
    try{
        curTerms = await models.Term.findAll(
            {
                paranoid: false,
                attributes: [
                    'id',
                    'title',
                    'slug',
                ],
                include: [
                    {
                        model: models.Taxonomy
                    }
                ]
            }
        );

    }catch(err){
        return {data:null, err};
    }

    let finalData = [];
    let newData = null;

    prevTags.map( (tag) => {   
        switch(tag.type){
            case 'RES':
                curType = recTags.id;
                break;
            case 'HINT':
                curType = toolsTags.id;
                break;
            case 'REC':
                curType = studentsTags.id;
                break; 
            case 'TRY':
                curType = toolsTags.id;
                break;    
            case 'APP':
                curType = appTags.id;
                break;   
        }

        const {
            title,
            created_at,
            updated_at,
            deleted_at,
        } = tag;

        let toImport = {
            title,
            created_at,
            updated_at,
            deleted_at,
            taxonomy_id: curType
        };

        // Check if slug based on title already exists in new DB
        /* let slug = await dataUtil.createSlug(tag.title, models.Term, null, true, models); */

        // Check if slug already exists in new DB            
        let exists = curTerms.find(e => {
            /* let elSlug = e.slug.replace(/-?([0-9])+$/, ''); */
            return e.title === title && e.Taxonomy.id == curType;
        });
        
        // If exists, set ID as that one in order to updateOnDuplicateKey
        if(exists){
            toImport.id = exists.id;
        }/* else{
            slug = await dataUtil.createSlug(tag.title, models.Term, null, false, models);
        } */
        /* toImport.slug = slug; */

        finalData.push(toImport);
    });

    try{
        newData = await models.Term.bulkCreate(finalData,                
        {
            ignoreDuplicates: true
        });

        return {data: newData, err: null};

        
    }catch(err){
        debug(err,'migration','resources');
        return {data:null, err};
    }

}

exports.themes = async () => {

    let curTerms = null;
    let prevEls = null;
    let appsThemes = null;
    let finalData = [];

    try{
        prevEls = await models.secondSq.query(`SELECT id, title, status, created_at, updated_at, deleted_at from Themes;
        `, { type: models.secondSq.QueryTypes.SELECT});

        appsThemes = await models.Taxonomy.findOne({
            where: {
                slug: 'temas_apps'
            }
        });

        // Terms in new DB
        curTerms = await models.Term.findAll(
            {
                paranoid: false,
                attributes: [
                    'id',
                    'title',
                    'slug',
                ],
                include: [
                    {
                        model: models.Taxonomy
                    }
                ]
            }
        );

        await Promise.all(prevEls.map(async (el) => {
            const {
                title,
                status,
                updated_at,
                created_at,
                deleted_at
            } = el;

            let toImport = {
                title,
                status,
                updated_at,
                created_at,
                deleted_at,
                taxonomy_id: appsThemes.id,
            };

            // Check if slug based on title already exists in new DB
            let slug = await dataUtil.createSlug(el.title, models.Term, null, true, models);

            // Check if slug already exists in new DB            
            let exists = curTerms.find(e => {
                let elSlug = e.slug ? e.slug.replace(/-?([0-9])+$/, '') : null;
                return elSlug === slug && e.Taxonomy.id == appsThemes.id;
            });
            
            // If exists, set ID as that one in order to updateOnDuplicateKey
            if(exists){
                toImport.id = exists.id;
            }else{
                slug = await dataUtil.createSlug(el.title, models.Term, null, false, models);
            }
            toImport.slug = slug;

            finalData.push(toImport);
        }));

    }catch(err){
        debug(err,'migration');
        return {data: null, err: err};
    }

    try{
        let newData = await models.Term.bulkCreate(finalData,                
        {
            ignoreDuplicates: true
        });

        return {data: newData, err: null};
        
    }catch(err){
        debug(err,'migration','resources');
        return {data:null, err};
    }
}

exports.years = async () => {
    try{
        let prevEls = await models.secondSq.query(`SELECT id, title from Years
            where deleted_at IS NULL;
        `, { type: models.secondSq.QueryTypes.SELECT});

        let taxonomy = await models.Taxonomy.findOne({
            where: {
                slug: 'anos_resources'
            }
        });

        let addToDb = await Promise.all(prevEls.map(async (el) => {    

            return await models.Term.findOrCreate({
                where: {
                    title: el.title,
                    taxonomy_id: taxonomy.id
                }, 
                defaults: {
                    slug: await dataUtil.createSlug(el.title, models.Term, null, false, models),
                }
            });
        }));

        return {data: addToDb, err: null};

    }catch(err){
        debug(err,'migration');
        return {data: null, err: err};
    }
}

exports.systems = async () => {
    try{
        let prevEls = await models.secondSq.query(`SELECT id, title, icon from Systems
            where deleted_at IS NULL;
        `, { type: models.secondSq.QueryTypes.SELECT});

        let taxonomy = await models.Taxonomy.findOne({
            where: {
                slug: 'sistemas_apps'
            }
        });

        let addToDb = await Promise.all(prevEls.map(async (el) => {    

            return await models.Term.findOrCreate({
                where: {
                    title: el.title,
                    taxonomy_id: taxonomy.id
                }, 
                defaults: {
                    slug: await dataUtil.createSlug(el.title, models.Term, null, false, models),
                    icon: el.icon
                }
            });
        }));

        return {data: addToDb, err: null};

    }catch(err){
        debug(err,'migration');
        return {data: null, err: err};
    }
}

exports.languages = async () => {
    try{
        let prevEls = await models.secondSq.query(`SELECT id, title from Languages
            where deleted_at IS NULL;
        `, { type: models.secondSq.QueryTypes.SELECT});

        let taxonomy = await models.Taxonomy.findOne({
            where: {
                slug: 'lang_resources'
            }
        });

        let addToDb = await Promise.all(prevEls.map(async (el) => {    

            return await models.Term.findOrCreate({
                where: {
                    title: el.title,
                    taxonomy_id: taxonomy.id
                }, 
                defaults: {
                    slug: await dataUtil.createSlug(el.title, models.Term, null, false, models),
                    icon: el.icon
                }
            });
        }));

        return {data: addToDb, err: null};

    }catch(err){
        debug(err,'migration');
        return {data: null, err: err};
    }
}

exports.formats = async () => {
    try{
        let prevEls = await models.secondSq.query(`SELECT id, title, type, color, image_id from Formats
            where deleted_at IS NULL;
        `, { type: models.secondSq.QueryTypes.SELECT});

        let taxonomy = await models.Taxonomy.findOne({
            where: {
                slug: 'formato_resources'
            }
        });

        let addToDb = await Promise.all(prevEls.map(async (el) => {    

            let term = await models.Term.findOrCreate({
                where: {
                    title: el.title,
                    taxonomy_id: taxonomy.id
                }, 
                defaults: {
                    slug: await dataUtil.createSlug(el.type, models.Term, null, false, models),
                    color: el.color,
                    type: el.type
                }
            });

            // Set term image
            if(term[0]){
                let prevImg = await models.secondSq.query(`SELECT id, name, extension from Images
                    where id=:id AND deleted_at IS NULL;
                `,{ replacements: { id: el.image_id }, type: models.secondSq.QueryTypes.SELECT});

                prevImg.map(async (img) => {
                    let image = await models.Image.findOrCreate({
                        where: {
                            id: img.id,
                        },
                        defaults: {
                            name: img.name,
                            extension: img.extension
                        }                        
                    });

                    let newTerm = await models.Term.findById(term[0].id);
                    await newTerm.setImage(image[0]);
                });
            }

            return term;
        }));

        return {data: addToDb, err: null};

    }catch(err){
        debug(err,'migration');
        return {data: null, err: err};
    }
}

exports.modes = async () => {
    let curTerms = null;
    let finalData = [];
    let newData = null;

    //  ======================================================================
    //  Get terms from new DB with slug and ID
    //  ======================================================================
    try{
        curTerms = await models.Term.findAll(
            {
                paranoid: false,
                attributes: [
                    'id',
                    'title',
                    'slug',
                ],
                include: [
                    {
                        model: models.Taxonomy
                    }
                ]
            }
        );

    }catch(err){
        return {data:null, err};
    }

    //  ======================================================================
    //  Get modes from old and add to new
    //  ======================================================================
    try{
        let prevEls = await models.secondSq.query(`SELECT id, title, type, created_at, updated_at from Modes
            where deleted_at IS NULL;
        `, { type: models.secondSq.QueryTypes.SELECT});

        let taxonomy = await models.Taxonomy.findOne({
            where: {
                slug: 'modos_resources'
            }
        });

        await Promise.all(prevEls.map(async (el) => {

            let toImport = {
                title: el.title,
                taxonomy_id: taxonomy.id,
                type: el.type
            };

            // Check if slug based on title already exists in new DB
            let slug = await dataUtil.createSlug(el.title, models.Term, null, true, models);

            // Check if slug already exists in new DB
            
            let exists = curTerms.find(e => {
                let elSlug = e.slug ? e.slug.replace(/-?([0-9])+$/, '') : null;
                return elSlug === slug && e.Taxonomy.id == taxonomy.id;
            });
            
            // If exists, set ID as that one in order to updateOnDuplicateKey
            if(exists){
                toImport.id = exists.id;
            }else{
                slug = await dataUtil.createSlug(el.title, models.Term, null, false, models);
            }
            toImport.slug = slug;

            finalData.push(toImport);
        }));

    }catch(err){
        debug(err,'migration');
        return {data: null, err: err};
    }

    try{
        newData = await models.Term.bulkCreate(finalData,                
        {
            ignoreDuplicates: true
        });

        return {data: newData, err: null};
        
    }catch(err){
        debug(err,'migration','resources');
        return {data:null, err};
    }
}

exports.categories = async () => {
    let curTerms = null;
    let finalData = [];
    let newData = null;

    //  ======================================================================
    //  Get terms from new DB with slug and ID
    //  ======================================================================
    try{
        curTerms = await models.Term.findAll(
            {
                paranoid: false,
                attributes: [
                    'id',
                    'title',
                    'slug',
                ],
                include: [
                    {
                        model: models.Taxonomy
                    }
                ]
            }
        );

    }catch(err){
        return {data:null, err};
    }

    //  ======================================================================
    //  Get modes from old and add to new
    //  ======================================================================
    try{
        let prevEls = await models.secondSq.query(`SELECT id, title, type, status, created_at, updated_at, deleted_at from Categories where type LIKE "APPS";
        `, { type: models.secondSq.QueryTypes.SELECT});

        let appCatsTax = await models.Taxonomy.findOne({
            where: {
                slug: 'categorias_apps'
            }
        });

        await Promise.all(prevEls.map(async (el) => {
            const {
                title,
                status,
                updated_at,
                created_at,
                deleted_at
            } = el;

            let toImport = {
                title,
                status,
                updated_at,
                created_at,
                deleted_at,
                taxonomy_id: appCatsTax.id,
            };

            // Check if slug based on title already exists in new DB
            let slug = await dataUtil.createSlug(el.title, models.Term, null, true, models);

            // Check if slug already exists in new DB
            
            let exists = curTerms.find(e => {
                let elSlug = e.slug ? e.slug.replace(/-?([0-9])+$/, '') : null;
                return elSlug === slug && e.Taxonomy.id == appCatsTax.id;
            });
            
            // If exists, set ID as that one in order to updateOnDuplicateKey
            if(exists){
                toImport.id = exists.id;
            }else{
                slug = await dataUtil.createSlug(el.title, models.Term, null, false, models);
            }
            toImport.slug = slug;

            finalData.push(toImport);
        }));

    }catch(err){
        debug(err,'migration');
        return {data: null, err: err};
    }

    try{
        newData = await models.Term.bulkCreate(finalData,                
        {
            ignoreDuplicates: true
        });

        return {data: newData, err: null};
        
    }catch(err){
        debug(err,'migration','resources');
        return {data:null, err};
    }
}