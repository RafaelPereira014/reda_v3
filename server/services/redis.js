const { debug } = require('../utils/dataManipulation');
var path = require("path");
const _ = require('lodash')

//  ================================================================================
//  IMPORT CONFIG
//  ================================================================================
var config    = require(path.join(__dirname, '..', 'config', 'config.json'))[process.env.NODE_ENV || "development"];

//  ================================================================================
//  IMPORTS
//  ================================================================================
// Get and init redis
var redis = require('redis');
var redisClient = redis.createClient(config.redis);

// Promisify
const {promisify} = require('util');
const getAsync = promisify(redisClient.get).bind(redisClient);

//  ================================================================================
//  HANDLERS
//  ================================================================================
redisClient.on('connect', function() {
    debug('Redis client connected', 'Redis', 'Connect');
    /* console.log('Redis client connected'); */
});

redisClient.on('error', function (err) {
    debug('Something went wrong ' + err, 'Redis', 'Error');
    /* console.log('Something went wrong ' + err); */
});

//  ================================================================================
//  SET UTILS
//  ================================================================================
redis.RedisClient.prototype.delWildcard = function(keys) {
	var redis = this;
    
    keys.map( curKey => {
        redis.keys(curKey, function(err, rows) {
            for(var i = 0, j = rows.length; i < j; ++i) {
                redis.del(rows[i])
            }
         });
    })
	
}

//  ================================================================================
//  EXPORTS
//  ================================================================================
exports.redis = redis;

// Get values in key asynchronously
exports.getAsync = getAsync;

// Export redis client
exports.redisClient = redisClient;

// Generate key based on prefix and data provided
exports.makeKey = (prefix, dataForName = {}) => {
    var data = _.cloneDeep(dataForName);
    let finalString = '';

    // Get keys of object
    const keys = Object.keys(data).sort();

    // If has keys, loop for each one
    keys.map( key => {

        // If value is array, loop for each value and add to string
        if(data[key] && Array.isArray(data[key]) && data[key].length>0){
            finalString+=":"+key.toUpperCase()+":{";

            data[key].sort();

            data[key].map((value, idx) => {
                if(idx>0){
                    finalString+=","; 
                }
                finalString+=value;
            });
            finalString+="}";

        // If value is string, add to final string
        }else if(data[key] && !Array.isArray(data[key]) && Object.prototype.toString.call(data[key])!=='[object Object]'){
            finalString+=":"+key.toUpperCase()+":"+dataForName[key];
        }
        
    })

    return prefix+(finalString!=='' ? ":"+finalString+":" : "");
}