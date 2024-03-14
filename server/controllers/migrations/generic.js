const models = require('../../models/index');
const { debug } = require('../../utils/dataManipulation');

//  ======================================================================
//  Import badwords
//  ======================================================================
exports.badwords = async () => {
    let oldData = null;
    let finalData = [];

    //  ======================================================================
    //  Get badwords from old DB
    //  ======================================================================
    try{
        oldData = await models.secondSq.query(`SELECT Badwords.id,
            Badwords.title,
            Badwords.status,
            Badwords.created_at,
            Badwords.updated_at,
            Badwords.deleted_at
            FROM Badwords;
        `, { type: models.secondSq.QueryTypes.SELECT});

    }catch(err){
        debug(err,'migration','resources:badwords');
        return {data: null, err};
    }

    //  ======================================================================
    //  Add badwords to new db
    //  ======================================================================
    try{
        oldData.map(row => { 
            finalData.push({
                id: row.id,
                title: row.title,
                status: row.status,
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at
            });
        });

        let dbData = await models.Badword.bulkCreate(finalData,{
            ignoreDuplicates: true
        })

        return { data: dbData, err: null}

    }catch(err){
        return {data: null, err};
    }
}

//  ======================================================================
//  Import default messages for contacts
//  ======================================================================
exports.messages = async () => {
    let oldData = null;
    let finalData = [];

    //  ======================================================================
    //  Get messages from old DB
    //  ======================================================================
    try{
        oldData = await models.secondSq.query(`SELECT Messages.id,
            Messages.message,
            Messages.status,
            Messages.type,
            Messages.typeTitle,
            Messages.contentType,
            Messages.created_at,
            Messages.updated_at,
            Messages.deleted_at
            FROM Messages;
        `, { type: models.secondSq.QueryTypes.SELECT});

    }catch(err){
        debug(err,'migration','resources:messages');
        return {data: null, err};
    }

    //  ======================================================================
    //  Add messages to new db
    //  ======================================================================
    try{

        let dbTypes = await models.Type.findAll();
        let types = {
            rec: dbTypes.find(el => el.slug === 'RESOURCES'),
            scr: dbTypes.find(el => el.slug === 'RESOURCES')
        };

        oldData.map(row => {
            let type = null;
            switch(row.contentType){
                case 'REC':
                    type = types.rec;
                    break; 
                case 'SCR':
                    type = types.scr;
                    break;   
            }
            finalData.push({

                id: row.id,
                message: row.message,
                status: row.status,
                type: row.type,
                typeTitle: row.typeTitle,
                created_at: row.created_at,
                updated_at: row.updated_at,
                deleted_at: row.deleted_at,
                type_id: type.id
            });
        });

        let dbData = await models.Message.bulkCreate(finalData,{
            ignoreDuplicates: true
        })

        return { data: dbData, err: null}

    }catch(err){
        return {data: null, err};
    }
}