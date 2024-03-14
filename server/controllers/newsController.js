const dataUtils = require("../utils/dataManipulation");
const models = require('../models/index');
const config = require('../config/config.json');
const validate = require('../utils/validation/validateNews').validate;
const { redisClient, getAsync, makeKey } = require('../services/redis');
const consts = require('../config/const');
const messages = require('../config/messages.json');
const Op = models.Sequelize.Op;

exports.list = async (req, res) => {

    try{
        // Options from queryString
        let limit = parseInt(req.query.limit) || config.limit;
        let page = parseInt(req.query.activePage) || 1;
        let order = [['created_at', 'DESC']];

        // SET REDIS KEY
        const redisKey = makeKey("NEWS::SEARCH", {
            order,
            limit,
            page
        });

        let redisResult = await getAsync(redisKey);

        // If there are results to show from cache, just ditch all the other processing and go straight to fetch the data from cache
        let news = null;
        let shouldUpdate = false;

        if(redisResult){
            news = JSON.parse(redisResult);
        }else{
    
            news = await models.News.findAndCountAll({
                distinct: true,
                include: [
                    {
                        model: models.Image,
                        as: "Thumbnail"
                    },
                    {
                        model: models.User,
                        attributes: [
                            'name',
                            'email'
                        ]
                    }
                ],
                limit: limit,
                offset: ((page-1)*limit),
                order
            });

            shouldUpdate = true;
        }

        let tempData = {
			count: news.count, 
			rows: news.rows
		};

		if(shouldUpdate){
			// Set redis key
			// SECONDS - MINUTES - HOURS - DAYS
			redisClient.set(redisKey, JSON.stringify(tempData), 'EX', 60 * 60 * 24 * 2);
		}

        // Return final object
		return res.json({
			page,
			totalPages: Math.ceil(tempData.count/limit),
			limit,
			count: tempData.rows.length,
			total: tempData.count, 
			result: tempData.rows
		});
    }catch(err){
        return res.status(403).send({
            message:err.message,
            stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
        })
    }
}

exports.details = async (req, res) => {
	try{
		let result = await models.News.findOne({
			include: [
                {
                    model: models.Image,
                    as: "Thumbnail"
                },
                {
                    model: models.User,
                    attributes: [
                        'name',
                        'email'
                    ]
                }
            ],
			where: {
				slug: {
					[Op.eq]: req.params.slug
				}
			}
		});
	
		// Return final object
		return res.json({
			result
		});
	}catch(err){
		return res.status(403).send({
			message:err.message,
			stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
		})
	}	
}

exports.createOrUpdate = async (req, res) => {
	var userExists = req.userExists;

    //
    //	Check form validation
    //
    const checkData = validate(req.body);
    if (Object.keys(checkData).length != 0 && checkData.constructor === Object){
        return res.status(403).send({form_errors: checkData});
    }

    //
    //	Create app with everything prepared
    //
    var action = req.params.slug ? 'update' : 'create';

    upsert(req, res, action, userExists);
}

async function upsert(req, res, action, userExists){

	// REMOVE KEYS FROM REDIS
	redisClient.delWildcard(["NEWS::*"]);	

    //
    //	Get instance in order to update
    //
    try{
        if(userExists.Role.type==consts.ADMIN_ROLE){
            let news = null;

            //  Build object to send to each function
            let finalData = req.body;
            finalData.user = userExists;
            finalData.req = req;
            finalData.res = res;

            //  To update
            if (req.params.slug && action=='update'){
                finalData.slug = req.params.slug;
                news = await models.News.updateEl(finalData, models, dataUtils);

            //  To create
            }else if(action=='create'){
                finalData.slug = await dataUtils.createSlug(req.body.title, models.News, null, false, models);
                news = await models.News.createEl(finalData, models, dataUtils);
            }            
            
            return res.status(200).json({result: news});
        }else{
            return res.status(401).send({message: messages.news.create_permission});
        }
    }catch(err) {
        return res.status(403).send({
            message:err.message,
            stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
        });
    }
}

//
//	Delete news
//
exports.deleteEl = async (req, res) => {	
	var userExists = req.userExists;

	// Check AUTH
	if (userExists && req.params.slug){

		const news = await models.News.findOne({
			where: {
				slug: {[Op.eq]: req.params.slug}
			}
		});

		if (!news){
			return res.status(403).send({message: messages.news.no_exist});
		}
		
		if(news && userExists.Role.type==consts.ADMIN_ROLE){

			//
			//	Delete news
			//
			news.destroy()
			.then(() => {
				// REMOVE KEYS FROM REDIS
				redisClient.delWildcard(["NEWS::*"]);

				return res.status(200).send({});
			})
			.catch(function(err){
				return res.status(403).send({
                    message:err.message,
                    stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
                });
			});
			
		}else{
			return res.status(401).send({message: messages.news.del_permission});
		}
		
	}else{
		return res.status(401).send({message: messages.news.del_permission});
	}
}