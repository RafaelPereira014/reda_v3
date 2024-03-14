const models = require('../models/index');
const Op = models.Sequelize.Op;

//
//  Return resume of special data
//
exports.resume = async (req, res) => {

    try{
        let today = new Date();
        var lastMonth = new Date();
        lastMonth.setHours(0,0,0,0);
        lastMonth.setDate(1);
 

        let thisMonthResources = await models.Resource.scope('resources').count({
            where: {
                created_at: {
                    [Op.between]: [lastMonth, today]
                }
            }
        });

        let thisMonthUsers = await models.User.count({
            where: {
                created_at: {
                    [Op.between]: [lastMonth, today]
                }
            }
        });

        let thisMonthApps = await models.Resource.scope('apps').count({
            where: {
                created_at: {
                    [Op.between]: [lastMonth, today]
                }
            }
        });

        let thisMonthTools = await models.Resource.scope('tools').count({
            where: {
                created_at: {
                    [Op.between]: [lastMonth, today]
                }
            }
        });

        let thisMonthActiveUsers = await models.sequelize.query(`SELECT Count(Users.id) as totalResources, Users.name, Users.email FROM reda_3.Users
        INNER JOIN Resources on Resources.user_id = Users.id
        where Resources.created_at <= :today AND Resources.created_at >= :lastMonth
        GROUP BY Users.id
        ORDER BY totalResources DESC
        LIMIT 10
        `, 
            {
                replacements: {
                    lastMonth,
                    today
                },
                type: models.sequelize.QueryTypes.SELECT
            }
        );

        return res.json({
            result: {
                thisMonthResources,
                thisMonthActiveUsers: thisMonthActiveUsers,
                thisMonthUsers,
                thisMonthApps,
                thisMonthTools
            }
            
        })
    }catch(err){
        return res.status(403).send({
            message:err.message,
            stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
        });
    }

    
}