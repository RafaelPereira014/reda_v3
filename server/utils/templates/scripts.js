const Handlebars = require('handlebars');

// Single script
exports.newScript = function(data){
	var source = "<p>Foi adicionada uma nova proposta de operacionalização ao recurso <strong>{{resource.title}}</strong>.</p>"+
        "<p>Pode visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/recursos/detalhes-recurso/{{resource.slug}}\">www.reda.azores.gov.pt/recursos/detalhes-recurso/{{resource.slug}}</a></p>"+
        "<h2>Descrição</h2>" +
        "<p>{{script.operation}}</p>"+
        "<small>Autor: {{#if user.name}}{{user.name}}{{else}}{{user.Registration.name}}{{/if}}</small>";
	var template = Handlebars.compile(source);

	return template(data);
}

// Multiple scripts
exports.newScripts = function(data){
	var source = "<p>Foram adicionadas propostas de operacionalização ao recurso <strong>{{resource.title}}</strong>.</p>"+
        "<p>Pode visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/recursos/detalhes-recurso/{{resource.slug}}\">www.reda.azores.gov.pt/recursos/detalhes-recurso/{{resource.slug}}</a></p>"+
        "{{#scripts}}" +
	        "<h2>Descrição</h2>" +
	        "<p>{{op_proposal}}</p>"+
	        "<small>Autor: {{#if ../user.name}}{{../user.name}}{{else}}{{../user.Registration.name}}{{/if}}</small>"+
        "{{/scripts}}";
	var template = Handlebars.compile(source);

	return template(data);
}

exports.notifyStatus = function(data){
	var source = "<p>A sua proposta de operacionalização do recurso <strong>{{resource.title}}</strong> já passou pelo processo de validação com o seguinte resultado: <strong>{{statusResult}}</strong></p>"+
		"{{#if status}}" +
			"<p>Pode visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/recursos/detalhes-recurso/{{resource.slug}}\">www.reda.azores.gov.pt/recursos/detalhes-recurso/{{resource.slug}}</a></p>"+
		"{{/if}}" +
        "{{#unless status}}"+
        	"A sua proposta de operacionalização foi <strong>{{statusResult}}</strong> com a seguinte justificação: </br>"+
        	"{{#if messagesList}}" +
        		"<ul>" +
	        	"{{#messagesList}}"+
	        		"<li>{{this}}</li>" +
	        	"{{/messagesList}}"+ 
	        	"</ul>" +
        	"{{/if}}" +
        	"{{#if message}}" +
        		"<ul>" +
	        		"<li>{{message}}</li>" +
	        	"</ul>" +
        	"{{/if}}" +
        "{{/unless}}";
	var template = Handlebars.compile(source);

	return template(data);
}