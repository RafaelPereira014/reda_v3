const { debug } = require('../dataManipulation');
const models = require('../../models/index');
const dataUtil = require('../dataManipulation');
const config = require('../../config/config.json');
const scriptTemplates = require('../templates/scripts');
const consts = require('../../config/const');
const Op = models.Sequelize.Op;

//
//  Used more for scripts, check if inner array has any errors
//
exports.scriptsHasErrors = function(scripts){
  var hasErrors = false;
  scripts.map(function(script){
    hasErrors = (Object.keys(script).length != 0 && script.constructor === Object) || hasErrors;
  });

  return hasErrors;
}


// Notify new script
exports.notify = function(data, multiple){
  // Only for non admins that are the author
  if (data.user.Role.type!=consts.ADMIN_ROLE){
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

        // If no error, send an email
        dataUtil.sendEmail({
          sender: config.teamName+" <"+config.teamEmail+">",
          to: dests,
          subject: "REDA - Novas propostas de operacionalização",
          html: multiple ? scriptTemplates.newScripts(data) : scriptTemplates.newScript(data)
        }, function(err){
          if (err) debug(err);
        })
      }
    }) 
  }
}

// Notify of status
exports.notifyStatus = function(data){
  dataUtil.sendEmail({
    sender: config.teamName+" <"+config.teamEmail+">",
    to: data.user.email,
    subject: "REDA - Aprovação de proposta de operacionalização",
    html: scriptTemplates.notifyStatus({
      "message": data.message,
      "messagesList": data.messagesList,
      "resource": data.resource,
      "status": data.status,
      "statusResult": data.status ? 'Aprovada' : 'Reprovada'
    })
  }, function(err){
    if (err) debug(err);
  })
}

//
//	Get script taxonomies
//
exports.scriptTaxs = async function(script, type = 'SCRIPTS'){
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
					model: models.Script,
					required: true,
					attributes: [],
					where: {
						id: {
							[Op.eq]: script
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
		order: [['title', 'ASC']]
  });
  
  //
  //  Sort based on title
  //
  taxs.map(tax => {
    //
    //  Get list of slugs
    //
    let titles = tax.Terms.reduce( (acc, cur) => [cur.title, ...acc], []);
    titles.sort(dataUtil.compareLists);

    tax.Terms = dataUtil.mapOrder(tax.Terms, titles, 'title');
  });

  return taxs;
}