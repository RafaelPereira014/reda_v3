
const messages = require('../config/messages.json');
const recaptcha = require('../utils/recaptcha');
const feedbackUtils = require('../utils/controllers/feedback');

//
//	Send feedback Email
//
exports.sendFeedback = function(req, res){
	var subject = req.body.subject;
	var message = req.body.message;
	var name = req.body.name;
	var email = req.body.email;
	var acceptance = req.body.acceptance;

	var recaptchaResponse = req.body.recaptcha;

	if (subject && message && name && recaptchaResponse && acceptance){

		// Check recaptcha
		recaptcha.verifyHumanity(req)
		.then(function(response){

			// Recaptcha not valid
			if (response.success == false){
				return res.status(403).send({
					form_errors: {
						recaptcha: 'reCaptcha já expirou ou tornou-se inválido. Recarregue a página atual.'
					}
				})
			}

			// Send e-mail if all valid
			feedbackUtils.notify({
				subject: subject,
				message: message,
				name: name,
				email: email,
				acceptance: acceptance
			});

			return res.json({result: 'Enviado'})
		})
		.catch(function(err){
			return res.status(403).send({
				message:err.message,
				stack: process.env.NODE_ENV==='development' || process.env.NODE_ENV==='staging' ? err.stack : null
			});
		})
		
	}else{
		return res.status(401).send({message: messages.feedback.missing_fields});
	}
}