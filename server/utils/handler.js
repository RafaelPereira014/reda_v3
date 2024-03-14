const logger = require('./logger').Logger;

//
//	Print error and return a 403
//
exports.handleError = function(res, err, returnData = null){
    logger.error(JSON.stringify({
        message: err.message,
        stack: err.stack || null,
    }));

    let data = returnData;

    //  If no given data, set default
    if(!returnData){
        data = {
            message:err.message,
            stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
        };
    }

	return res.status(403).send(data);
}