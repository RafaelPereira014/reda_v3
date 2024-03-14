const { debug } = require('../dataManipulation');
const dataUtil = require('../dataManipulation');
const config = require('../../config/config.json');
const contactsTemplate = require('../templates/contacts');

// Notify of contact message in a user resource
exports.notifyNew = function(data){
  debug(data);  
  dataUtil.sendEmail({
    sender: config.teamName+" <"+config.teamEmail+">",
    to: data.users,
    cc: config.teamEmail,
    subject: "REDA - Nova mensagem de contacto",
    html: contactsTemplate.notifyNew({
      "resource": data.resourceTitle,
      "resourceSlug": data.resourceSlug,
      "message": data.message,
      "teamEmail": config.teamEmail
    })
  }, function(err){
    if (err) debug(err);
  })
}