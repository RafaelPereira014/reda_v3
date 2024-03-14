const { debug } = require('../dataManipulation');
const models = require('../../models/index');
const appTemplate = require('../templates/app');
const dataUtil = require('../dataManipulation');
const config = require('../../config/config.json');
const Op = models.Sequelize.Op;


//
//	Get app taxonomies
//
exports.taxs = async function(resource, type = 'APPS'){
	let includes = [
		{
			model: models.Term,
			attributes: ['id', 'title', 'slug', 'icon', 'color', 'image_id', 'parent_id'],
            required: true,            
			include: [
				{
					model: models.Image,
					required:false
				},
				{
					model: models.Resource.scope('normal'),
                    required: true,
                    attributes: ['id'],
                    through:{
                        attributes: ['metadata']
                    },
					where: {
						id: {
							[Op.eq]: resource
						}
					}
				}
			]
		},
		{
            model: models.Type,
            attributes: [],
			where: {
				slug: {[Op.eq]: type}
			}
		}
	];

	let taxs = await models.Taxonomy.findAll({
		include: includes,
		attributes: [
			'id',
			'title',
			'slug',
			'locked',
			'created_at',
			'updated_at',
			'type_id'
		],
		order: [
			['title', 'ASC'],
		]
    });
    
    let finalData = [];

    taxs.map(tax => {
        let tempTerms = [];
        
        tax.Terms.map(term => {
            let tempData = term.toJSON();
            const metadata = term.Resources[0].resource_term.metadata;

            delete tempData.Resources;

            tempTerms.push({
                ...tempData,
                metadata
            })
        })

        let tempData = tax.toJSON();
        tempData.Terms = tempTerms;
        finalData.push(tempData);	
    })

    return finalData;
}

// Notify new resources
exports.notifyNew = function(data){
  models.User.findAll({
    include: [
      {
        model: models.Role,
        where: {
          type: 'admin'
        }
      }
    ]
  })
  .then(function(users){
    if (users && users.length>0){
      var dests = '';

      for (var user of users){
        if (dests.length>0){
          dests += ','
        }

        var curUser = user.name;

        dests += curUser + " <"+user.email+">";
      }

      // Notify
      const templateFunction = appTemplate.newWithValidator;

      // Notify Users to email
      dataUtil.sendEmail({
        sender: config.teamName+" <"+config.teamEmail+">",
        to: data.user.name  + " <"+data.user.email+">",
        subject: "REDA - Nova aplicação",
        html: templateFunction({
          "username": data.user.name,
          "slug": data.slug
        })
      }, function(err){
        if (err) debug(err);

        // Notify admins of new resource
        // If no error, send an email
        dataUtil.sendEmail({
          sender: config.teamName+" <"+config.teamEmail+">",
          to: dests,
          subject: "REDA - Nova aplicação",
          html: appTemplate.new({
            "username": data.user.name,
            "slug": data.slug
          })
        }, function(err){
          if (err) debug(err);
        });
      });
    }
  })
}

// Notify new resources
exports.notifyUpdate = function(data){
  models.User.findAll({
    include: [
      {
        model: models.Role,
        where: {
          type: 'admin'
        }
      },
    ]
  })
  .then(function(users){
    if (users && users.length>0){
      var dests = '';

      for (var user of users){
        if (dests.length>0){
          dests += ','
        }

        var curUser = user.name;

        dests += curUser + " <"+user.email+">";
      }


      // If no error, send an email
      dataUtil.sendEmail({
        sender: config.teamName+" <"+config.teamEmail+">",
        to: dests,
        subject: "REDA - Aplicação atualizada",
        html: appTemplate.update({
          "username": data.user.name,
          "slug": data.slug,
          "title": data.title
        })
      }, function(err){
        if (err) debug(err);
      })
    }
  })
}

// Notify of status
exports.notifyStatus = function(data){
  dataUtil.sendEmail({
    sender: config.teamName+" <"+config.teamEmail+">",
    to: data.user.email,
    subject: "REDA - Resultado de processo de validação",
    html: appTemplate.notifyStatus({
      "message": data.message,
      "messagesList": data.messagesList,
      "app": data.app,
      "status": data.status,
      "statusResult": data.status ? 'Aprovada' : 'Reprovada'
    })
  }, function(err){
    if (err) debug(err);
  })
}