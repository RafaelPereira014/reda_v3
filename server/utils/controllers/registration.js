var Converter = require("csvtojson").Converter;
var iconv = require('iconv-lite');
const { debug } = require('../dataManipulation');

const dataUtil = require('../dataManipulation');
const config = require('../../config/config.json');
const registrationTemplate = require('../templates/registration');

exports.getTeachersFile = function(){
	var converter = new Converter({
		headers: ['Nome', 'Email', 'Escola','User_Name'],
		delimiter: [';']
	});

	//read from file 
	require("fs")
	.createReadStream("./server/utils/csv/registration_list.csv")
	.pipe(iconv.decodeStream('utf8'))
	.pipe(converter);

	return converter;
}

// Notify of signup
exports.notifySignup = function(data){
  debug(data);
  dataUtil.sendEmail({
    sender: config.teamName+" <"+config.teamEmail+">",
    to: data.email,
    subject: "REDA - Confirme o seu registo",
    html: registrationTemplate.notifySignup({
      "token": data.token
    })
  }, function(err){
    if (err) debug(err);
  })
}