const { debug } = require('../dataManipulation');
const models = require('../../models/index');
const dataUtil = require('../dataManipulation');
const config = require('../../config/config.json');
const resourceTemplate = require('../templates/resource');
const Op = models.Sequelize.Op;
const _ = require('lodash');

//
//  Check if in domains there are any domains to use,
//  or to insert new ones
//
exports.getDomains = function(domains){
  var finalDomains = {
    existing: [],
    new: []
  }

  if (Array.isArray(domains)){
      finalDomains.existing = domains
    }else if((typeof domains === 'string' || domains instanceof String) && domains.length>0){
      let newDomains = domains.split(",");

      for(let domain of newDomains){
        finalDomains.new.push({title: domain});
      }
    }

    return finalDomains;
}

//
//	Get resource taxonomies based on scripts
//
exports.resourceTaxs = async function(resource, type = 'RESOURCES', taxs = []){
	let includesScripts = [
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
            // added main 1 to get only main scripts
            main: 1,
						resource_id: {
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
  
  let includesResc = [
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
					model: models.Resource.scope('all'),
					required: true,
					attributes: [],
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
  
  let setWhere = {};

  if(taxs.length>0){
    setWhere = {
      slug: {
        [Op.in]: taxs
      }
    }
  }

	let ScriptsTaxs = await models.Taxonomy.findAll({
    include: includesScripts,
    where: setWhere,
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
  
  let ResTaxs = await models.Taxonomy.findAll({
    include: includesResc,
    where: setWhere,
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
  
  let finalDataRes = _.cloneDeep(ResTaxs);
  let finalDataScripts = _.cloneDeep(ScriptsTaxs);

  // For each script tax
  finalDataScripts.map( curTax => {
    // Get taxonomy that is equal to current script taxonomy
    let existsInResTax = finalDataRes.filter( resTax => resTax.id === curTax.id);

    // If doesn't exist in resource taxonomies, push it to resource taxonomies
    if(existsInResTax.length==0){
      finalDataRes.push(curTax);

    // If exist
    }else{

      // Go for all terms in current taxonomy of script
      curTax.Terms.map(scriptCurTaxTerm => {

        // Check if current taxonomy of script term exist in resource taxonomy
        let existTermInResTax = existsInResTax[0].Terms.filter( resTaxTerm => resTaxTerm.id === scriptCurTaxTerm.id);

        // If not, push it to array
        if(existTermInResTax.length==0){
          
          existsInResTax[0].Terms.push(scriptCurTaxTerm);
        }
      })
    }
  });

  //
  //  Sort based on title
  //
  finalDataRes.map(tax => {
    //
    //  Get list of slugs
    //
    let titles = tax.Terms.reduce( (acc, cur) => [cur.title, ...acc], []);
    titles.sort(dataUtil.compareLists);

    tax.Terms = dataUtil.mapOrder(tax.Terms, titles, 'title');
  });

  return finalDataRes;
}

// Notify new resources
exports.notify = function(data){
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


      // Check if there are any subjects that don't have validator yet
      /* models.Term.findAll({
        attributes: [
          'id',
          'hasValidator'
        ],
        where: {
          id: {
            [Op.in]: data.terms
          },
          hasValidator: false
        }
      })
      .then(function(validationSubjects){ */

        // Notify function based on if subjects have or not validator
        const templateFunction = /* validationSubjects && validationSubjects.length>0 ? resourceTemplate.newResourceNoValidator :*/resourceTemplate.newResourceWithValidator;

        // Notify Users to email
        dataUtil.sendEmail({
          sender: config.teamName+" <"+config.teamEmail+">",
          to: data.user.name  + " <"+data.user.email+">",
          subject: "REDA - Novo recurso",
          html: templateFunction({
            "username": data.user.name,
            "resourceSlug": data.slug
          })
        }, function(err){
          if (err) debug(err);

          // Notify admins of new resource
          // If no error, send an email
          dataUtil.sendEmail({
            sender: config.teamName+" <"+config.teamEmail+">",
            to: dests,
            subject: "REDA - Novo recurso",
            html: resourceTemplate.newResource({
              "username": data.user.name,
              "resourceSlug": data.slug
            })
          }, function(err){
            if (err) debug(err);
          });
        });

        
      /* }); */
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
        subject: "REDA - Recurso atualizado",
        html: resourceTemplate.updateResource({
          "username": data.user.name,
          "resourceSlug": data.slug,
          "resourceTitle": data.resourceTitle
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
    html: resourceTemplate.notifyStatus({
      "message": data.message,
      "messagesList": data.messagesList,
      "resource": data.resource,
      "status": data.status,
      "statusResult": data.status ? 'Aprovado' : 'Reprovado'
    })
  }, function(err){
    if (err) debug(err);
  })
}