const { debug } = require('../dataManipulation');
const dataUtil = require('../dataManipulation');
const config = require('../../config/config.json');
const usersTemplate = require('../templates/users');

// Notify of status
exports.notifyPasswordChangeRequest = function(data){
  debug(data);
  dataUtil.sendEmail({
    sender: config.teamName+" <"+config.teamEmail+">",
    to: data.email,
    subject: "REDA - Pedido de alteração de palavra-passe",
    html: usersTemplate.notifyPasswordChangeRequest({
      "token": data.token
    })
  }, function(err){
    if (err) debug(err);
  })
}