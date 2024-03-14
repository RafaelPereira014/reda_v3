const { debug } = require('../dataManipulation');
const dataUtil = require('../dataManipulation');
const config = require('../../config/config.json');
const feedbackTemplate = require('../templates/feedback');

// Notify new feedback
exports.notify = function(data){
  dataUtil.sendEmail({
    sender: config.teamName+" <"+config.teamEmail+">",
    to: config.teamEmail+','+config.techEmail,
    //to: config.techEmail,
    subject: "REDA - Nova mensagem de Feedback",
    html: feedbackTemplate.newFeedback(data)
  }, function(err){
    if (err) debug(err);
  })  
}