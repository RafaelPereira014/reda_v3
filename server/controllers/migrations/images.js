const models = require('../../models/index');
const { debug } = require('../../utils/dataManipulation');

//  ======================================================================
//  Import images
//  ======================================================================
exports.images = async () => {
    let prevImages = null;

    //  ======================================================================
    //  Get old resources and images
    //  ======================================================================
    try{
        prevImages = await models.secondSq.query(`SELECT * from Images ORDER BY id;
        `, { type: models.secondSq.QueryTypes.SELECT});

    }catch(err){
        debug(err,'migration','resources');
        return {data: null, err};
    }

    //  ======================================================================
    //  Add images to DB
    //  ======================================================================
    try{
        let finalData = [];
            
        prevImages.map(file => {
            finalData.push(file)            
        });

        let newData = await models.Image.bulkCreate(finalData,
            {
                ignoreDuplicates: true
            });
        
        return {data: newData, err: null};
    }catch(err){
        debug(err,'migration','resources');
        return {data: null, err};
    }
}