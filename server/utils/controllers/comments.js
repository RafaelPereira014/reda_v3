const { debug } = require('../dataManipulation');
const models = require('../../models/index');
const dataUtil = require('../dataManipulation');
const config = require('../../config/config.json');
const commentsTemplate = require('../templates/comments');
// Notify of status
exports.notifyStatus = function(data){
  debug(data);
  dataUtil.sendEmail({
    sender: config.teamName+" <"+config.teamEmail+">",
    to: data.user.email,
    subject: "REDA - Aprovação de comentário",
    html: commentsTemplate.notifyStatus({
      "message": data.message,
      "resource": data.resource,
      "statusResult": data.status ? 'Aprovado' : 'Reprovado'
    })
  }, function(err){
    if (err) debug(err);
  })
}

// Notify of new comment
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

      debug(data);
      dataUtil.sendEmail({
        sender: config.teamName+" <"+config.teamEmail+">",
        to:dests,
        subject: "REDA - Adicionado novo comentário",
        html: commentsTemplate.notifyNew({
          "resource": data.resourceTitle,
          "resourceSlug": data.resourceSlug,
          "comment": data.comment
        })
      }, function(err){
        if (err) debug(err);
      })
    }
  });
}

// Notify of response
exports.notifyReply = function(data){
  debug(data);
  dataUtil.sendEmail({
    sender: config.teamName+" <"+config.teamEmail+">",
    to: data.user.email,
    subject: "REDA - Resposta a comentário",
    html: commentsTemplate.notifyReply({
      "resource": data.resourceTitle,
      "resourceSlug": data.resourceSlug
    })
  }, function(err){
    if (err) debug(err);
  })
}