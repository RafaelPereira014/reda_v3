const Handlebars = require('handlebars');

// Notify a new feedback message
exports.newFeedback = function(data){
	var source = "<p>Recebeu uma nova mensagem de <em>Feedback</em>, enviada através da plataforma REDA</p>"+
        "{{#if subject}}"+
        	"<h2>Assuntos</h2>"+
        	"<ul>" +
        	"{{#subject}}"+
        		"<li>{{this}}</li>" +
        	"{{/subject}}"+ 
        	"</ul>" +       	
        "{{/if}}"+
        "{{#if name}}"+
        	"<h2>Nome do remetente</h2>"+
        	"{{name}}" +
        "{{/if}}"+
        "{{#if email}}"+
        	"<h2>Email do remetente</h2>"+
        	"<a href=\"mailto:{{email}}\">{{email}}</a>" +
        "{{/if}}"+
        "{{#if message}}"+
        	"<h2>Mensagem</h2>"+
        	"<em>{{message}}</em>" +
		"{{/if}}"+
		"{{#if acceptance}}"+
			"<h2>Aceitação</h2>"+
        	"<p>O utilizador aceitou os termos expostos na política de privacidade da plataforma REDA.</p>"+
        "{{/if}}";
	var template = Handlebars.compile(source);

	return template(data);
}