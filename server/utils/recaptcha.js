const request = require('request-promise');
const config = require('../config/config.json');

//
//	Check if recaptcha is valid from google site verification
//
exports.verifyHumanity = function(req){
	const recaptchaResponse = req.body.recaptcha;

    var options = {
		method: 'POST',
		uri: 'https://www.google.com/recaptcha/api/siteverify',
		form: {
			secret:config.recaptcha,
			response: recaptchaResponse,
			remoteip:req.connection.remoteAddress
		}
	};

	return request(options)
	.then(function(res) {
        return JSON.parse(res);
    })
}