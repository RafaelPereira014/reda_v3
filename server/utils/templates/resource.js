const Handlebars = require('handlebars');

exports.newResource = function(data){
	var source = "<p>Foi adicionado um novo recurso na plataforma REDA pelo utilizador <strong>{{username}}</strong>.</p>"+
        "<p>Pode visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/recursos/detalhes-recurso/{{resourceSlug}}\">www.reda.azores.gov.pt/recursos/detalhes-recurso/{{resourceSlug}}</a></p>";
	var template = Handlebars.compile(source);

	return template(data);
}

exports.newResourceNoValidator = function(data){
	var source = "<p>O recurso que submeteu pertence a uma disciplina ainda sem validação científica disponível na plataforma. No entanto, a validação será efetuada com a maior brevidade possível.</p>"+
        "<p>Poderá  visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/recursos/detalhes-recurso/{{resourceSlug}}\">www.reda.azores.gov.pt/recursos/detalhes-recurso/{{resourceSlug}}</a> após a respetiva aprovação.</p>"+
        "<p>A equipa REDA agradece o seu contributo!</p>";
	var template = Handlebars.compile(source);

	return template(data);
}

exports.newResourceWithValidator = function(data){
	var source = "<p>O recurso submetido encontra-se em processo de validação.</p>" +		
        "<p>Poderá visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/recursos/detalhes-recurso/{{resourceSlug}}\">www.reda.azores.gov.pt/recursos/detalhes-recurso/{{resourceSlug}}</a> após a respetiva aprovação</p>"+
        "<p>A equipa REDA agradece o seu contributo!</p>";
	var template = Handlebars.compile(source);

	return template(data);
}

exports.updateResource = function(data){
	var source = "<p>Foi alterado o recurso <strong>{{resourceTitle}}</strong> na plataforma REDA pelo utilizador <strong>{{username}}</strong>.</p>"+
        "<p>Pode visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/recursos/detalhes-recurso/{{resourceSlug}}\">www.reda.azores.gov.pt/recursos/detalhes-recurso/{{resourceSlug}}</a></p>";
	var template = Handlebars.compile(source);

	return template(data);
}

exports.notifyStatus = function(data){
	var source = "<p>O seu recurso <strong>{{resource}}</strong> já passou pelo processo de validação com o seguinte resultado: <strong>{{statusResult}}</strong></p>"+
        "{{#unless status}}"+
        	"O seu recurso foi <strong>{{statusResult}}</strong> com a seguinte justificação: </br>"+
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