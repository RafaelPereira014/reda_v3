const models = require('../../models/index');
const dataUtil = require('../../utils/dataManipulation');
const { debug } = require('../../utils/dataManipulation');
const resFuncs = require('./resources');
const imgFuncs = require('./images');
const termsFuncs = require('./terms');
const comFuncs = require('./comments');
const genFuncs = require('./generic');
const appFuncs = require('./apps');
const scriptsFuncs = require('./scripts');

//  =============================================================
//
//  Migrate Terms 
//  Terms, tags, themes, years, systems, languages, formats
//
//  =============================================================
exports.terms = async () => {
    let results = [];
    results.push(await termsFuncs.domains());
    results.push(await termsFuncs.tags());
    results.push(await termsFuncs.themes());
    results.push(await termsFuncs.years());
    results.push(await termsFuncs.systems());
    results.push(await termsFuncs.languages());
    results.push(await termsFuncs.formats());
    results.push(await termsFuncs.modes());
    results.push(await termsFuncs.categories());

    let errs = [];
    let data = [];
    results.map(row => {
        if(row && row.err!=null){
            errs.push(row.err.message);
        }
    })
    results.map(row => {
        if(row && row.data!=null){
            data.push(row.data);
        }
    })

    // Return errors if any
    if(errs.length>0){
        return {data: null, errs}
    }

    // Return final data
    return {data, errs: null}
}

//  =============================================================
//
//  Migrate users
//
//  =============================================================
exports.users = async () => {
    //  =================
    //  First, get roles
    //  =================
    try{
        let prevRoles = await models.secondSq.query(`SELECT * from Roles;
        `, { type: models.secondSq.QueryTypes.SELECT});
        
        await Promise.all(prevRoles.map( async (role) => {
            return await models.Role.findOrCreate({
                where: {
                    id: role.id
                },
                defaults: role
            });
        }))
    }catch(err){
        debug(err,'migration');   
        return {data: null, errs: [err.message]}     
    }

    let prevUsers = null;

    try{

        //  =================
        //  Second, get users
        //  =================
        const schema = { 
            columnsUsers: ['id','email', 'password', 'recover_password_token', 'name', 'organization', 'hidden', 'newsletter', 'approved', 'status', 'role_id', 'acceptance', 'registration_id','created_at','updated_at'],
            columnsRegistrations: ['id','name','email','department','used']
        };
        const columns = [dataUtil.prefix('User',schema.columnsUsers), ...dataUtil.prefix('Reg',schema.columnsRegistrations)];
        prevUsers = await models.secondSq.query(`SELECT ${columns.join(',')} from Users as User
        LEFT JOIN Registrations as Reg on User.registration_id = Reg.id
            where User.password IS NOT NULL;
        `, { type: models.secondSq.QueryTypes.SELECT});

        /* debug(prevUsers, 'migration', 'users'); */
    }catch(err){
        debug(err,'migration');
        return {data: null, errs: [err.message]}
    }

    let finalArray = [];

    let addedUsers = null;
    
    prevUsers.map( (user) => {
        finalArray.push({
            id: user.User_id,
            email: user.User_email,
            name: user.User_name || user.Reg_name || null,
            password: user.User_password,
            recover_password_token: user.User_recover_password_token,
            organization: user.User_organization || user.Reg_department || null,
            hidden: user.User_hidden,
            newsletter: user.User_newsletter,
            approved: user.User_approved,
            status: user.User_status,
            acceptance: user.User_acceptance,
            role_id: user.User_role_id,
            created_at: user.User_created_at,
            updated_at: user.User_updated_at
        })
    });

    try{
        addedUsers = await models.User.bulkCreate(finalArray,                
        {
            ignoreDuplicates: true
        });
        
    }catch(err){
        debug(err,'migration');
        return {data: null, errs: [err.message]}
    }

    return {data: addedUsers, err: null}    
    
}

//  =============================================================
//
//  Migrate resources
//
//  =============================================================
exports.resources = async () => {
    
    //  ======================================================================
    //  RUN FUNCTIONS
    //  ======================================================================
    let data = [];
    let results = [];
    try{
        results.push(await resFuncs.resources());        
        results.push(await resFuncs.files()); 
        results.push(await resFuncs.terms()); 
        results.push(await resFuncs.favorites());
        results.push(await resFuncs.contacts());

        let errs = [];
        
        results.map(row => {
            if(row && row.err!=null){
                errs.push(row.err.message);
            }
            if(row && row.data!=null){
                data.push(row.data);
            }
        })

        // Return errors if any
        if(errs.length>0){
            return {data: null, errs}
        }
        
    }catch(err){
        debug(err,'migration','resources-error');
        return {data: null, errs: [err.message]}
    }

    return {data, errs: null}
}

//  =============================================================
//
//  Migrate images
//
//  =============================================================
exports.images = async () => {
    //  ======================================================================
    //  RUN MIGRATION
    //  ======================================================================
    let data = [];
    let results = [];
    try{
        results.push(await imgFuncs.images());

        let errs = [];
        
        results.map(row => {
            if(row.err!=null){
                errs.push(row.err.message);
            }
        })
        results.map(row => {
            if(row.data!=null){
                data.push(row.data);
            }
        })

        // Return errors if any
        if(errs.length>0){
            return {data: null, errs}
        }
        
    }catch(err){
        debug(err,'migration','images-error');
        return {data: null, errs: [err.message]}
    }

    return {data, errs: null}
}

//  =============================================================
//
//  Migrate comments
//
//  =============================================================
exports.comments = async () => {
//  ======================================================================
    //  RUN FUNCTIONS
    //  ======================================================================
    let data = [];
    let results = [];
    try{
        results.push(await comFuncs.comments());
        results.push(await comFuncs.nestedComments());

        let errs = [];
        
        results.map(row => {
            if(row && row.err!=null){
                errs.push(row.err.message);
            }
            if(row && row.data!=null){
                data.push(row.data);
            }
        })

        // Return errors if any
        if(errs.length>0){
            return {data: null, errs}
        }
        
    }catch(err){
        debug(err,'migration','comments:error');
        return {data: null, errs: [err.message]}
    }
    
    return {data, errs: null}
}

//  =============================================================
//
//  Migrate generic data
//
//  =============================================================
exports.generic = async () => {
    //  ======================================================================
    //  RUN FUNCTIONS
    //  ======================================================================
    let data = [];
    let results = [];
    try{
        results.push(await genFuncs.badwords());
        results.push(await genFuncs.messages());

        let errs = [];
        
        results.map(row => {
            if(row && row.err!=null){
                errs.push(row.err.message);
            }
            if(row && row.data!=null){
                data.push(row.data);
            }
        })

        // Return errors if any
        if(errs.length>0){
            return {data: null, errs}
        }
        
    }catch(err){
        debug(err,'migration','comments:error');
        return {data: null, errs: [err.message]}
    }

    return {data, errs: null}
}

//  =============================================================
//
//  Migrate apps
//
//  =============================================================
exports.apps = async () => {
    //  ======================================================================
    //  RUN FUNCTIONS
    //  ======================================================================
    let data = [];
    let results = [];

    try{
        results.push(await appFuncs.apps());
        /* results.push(await appFuncs.images()); */
        results.push(await appFuncs.terms());

        let errs = [];
        
        results.map(row => {
            if(row && row.err!=null){
                errs.push(row.err.message);
            }
            if(row && row.data!=null){
                data.push(row.data);
            }
        })

        // Return errors if any
        if(errs.length>0){
            return {data: null, errs}
        }
        
    }catch(err){
        debug(err,'migration','resources-error');
        return {data: null, errs: [err.message]}
    }

    return {data, errs: null}
}

//  =============================================================
//
//  Migrate scripts
//
//  =============================================================
exports.scripts = async () => {
    //  ======================================================================
    //  RUN FUNCTIONS
    //  ======================================================================
    let data = [];
    let results = [];

    try{
        results.push(await scriptsFuncs.scripts());
        results.push(await scriptsFuncs.terms());
        results.push(await scriptsFuncs.files());
        results.push(await resFuncs.resourceFirstScript());

        let errs = [];
        
        results.map(row => {
            if(row && row.err!=null){
                errs.push(row.err.message);
            }
            if(row && row.data!=null){
                data.push(row.data);
            }
        })

        // Return errors if any
        if(errs.length>0){
            return {data: null, errs}
        }
        
    }catch(err){
        debug(err,'migration','scripts:error');
        return {data: null, errs: [err.message]}
    }

    return {data, errs: null}
}