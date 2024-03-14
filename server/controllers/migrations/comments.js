const models = require('../../models/index');
const { debug } = require('../../utils/dataManipulation');


//  ======================================================================
//  Comments
//  ======================================================================
exports.comments = async () => {
    let newRes = null;
    let oldData = null;
    let finalData = [];

    //  ======================================================================
    //  Get new resources and comments from old DB
    //  ======================================================================
    try{
        newRes = await models.Resource.scope(null).findAll({
            paranoid: false
        });

        oldData = await models.secondSq.query(`SELECT Comments.id,
        Comments.text,
        Comments.status,
        Comments.approved,
        Comments.created_at,
        Comments.updated_at,
        Comments.deleted_at,
        Comments.resource_id, 
        Resources.slug as res_slug, 
        Comments.user_id as user_id,
        Comments.level
        FROM Comments
        INNER JOIN Resources on Comments.resource_id = Resources.id;
        `, { type: models.secondSq.QueryTypes.SELECT});

    }catch(err){
        debug(err,'migration','resources:comments');
        return {data: null, err};
    }

    //  ======================================================================
    //  Add comments to new db
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
                    text: row.text,
                    status: row.status,
                    approved: row.approved,
                    level: row.level,
                    created_at: row.created_at,
                    updated_at: row.updated_at,
                    deleted_at: row.deleted_at
                })
            }

        });

        let dbData = await models.Comment.bulkCreate(finalData,{
            ignoreDuplicates: true
        })

        return { data: dbData, err: null}

    }catch(err){
        return {data: null, err};
    }
}

//  ======================================================================
//  Nested Comments
//  ======================================================================
exports.nestedComments = async () => {
    let oldData = null;
    let finalData = [];

    //  ======================================================================
    //  Get new resources and comments from old DB
    //  ======================================================================
    try{
        oldData = await models.secondSq.query(`SELECT NestedComments.id,
        NestedComments.parent_id,
        NestedComments.child_id,
        NestedComments.created_at,
        NestedComments.updated_at,
        NestedComments.deleted_at FROM NestedComments
        `, { type: models.secondSq.QueryTypes.SELECT});

    }catch(err){
        debug(err,'migration','resources:nestedComments');
        return {data: null, err};
    }

    //  ======================================================================
    //  Add nested comments to new db
    //  ======================================================================
    try{
        oldData.map(row => {
            finalData.push({
                id: row.id,
                parent_id: row.parent_id,
                child_id: row.child_id,                    
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at
            })
        });

        let dbData = await models.NestedComment.bulkCreate(finalData,{
            ignoreDuplicates: true
        })

        return { data: dbData, err: null}

    }catch(err){
        return {data: null, err};
    }
}