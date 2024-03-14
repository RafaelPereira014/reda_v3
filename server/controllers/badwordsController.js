const models = require('../models/index');
const config = require('../config/config.json');
const messages = require('../config/messages.json');
const validate = require('../utils/validation/validateBadwords').validate;
const Op = models.Sequelize.Op;

// Check if comment has bad wrods
exports.list  = async (req, res) =>{
	var limit = parseInt(req.query.limit) || config.limit;
	var page = parseInt(req.query.activePage) || 1;

    try{
        const badwords = await models.Badword.findAndCountAll({
            limit: limit,
            offset: ((page-1)*limit),
            order: [['title','ASC']]
        });
        
        return res.json({
            page,
            totalPages: Math.ceil(badwords.count/limit),
            limit,
            count: badwords.rows.length,
            total: badwords.count, 
            result: badwords.rows
        })
    }catch(err){
        return res.status(403).send({
            message:err.message,
            stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
        })
    }
	
}


// Add badword
exports.add = async (req, res) =>{
	var userExists = req.userExists;
	

	if (userExists){
        //
		//	Check form validation
		//
		const checkData = validate(req.body);
		if (Object.keys(checkData).length != 0 && checkData.constructor === Object){
			return res.status(403).send({form_errors: checkData});
		}

        try{
            var word = req.body.title;
            const result = await models.Badword.findOrCreate({
                where: {
                  title: word
                },
                defaults: { // set the default properties if it doesn't exist
                  title: word
                }
              })
              var wordInst = result[0], // the instance of the author
                  created = result[1]; // boolean stating if it was created or not
          
            if (!created) { // false if word already exists and was not created.
                return res.status(403).send({message: messages.badword.already_exists})
            }
                
            return res.json({result: wordInst});
        }catch(err){
            return res.status(403).send({
                message:err.message,
                stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
            });
        }
	}else{
		return res.status(401).send({message: messages.badword.create_permission})
	}
}

// Delete a badword
exports.delete = async (req, res) => {
	var userExists = req.userExists;
	var wordId = req.params.word;

	if (userExists){
        if (!wordId){
            return res.status(403).send({message: messages.badword.no_exist});
        }

        try{
            const badword = await models.Badword.findOne({
                where: {
                    id: {[Op.eq]: wordId}
                }
            })
    
            await badword.destroy();
    
            return res.status(200).send({});
        }catch(err){
            return res.status(403).send({
                message:err.message,
                stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
            })
        }
		
	}else{
		return res.status(401).send({message: messages.badword.del_permission})
	}
}