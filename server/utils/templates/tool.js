const Handlebars = require('handlebars');

exports.new = function(data){
	var source = "<p>Foi adicionada uma nova ferramenta na plataforma REDA pelo utilizador <strong>{{username}}</strong>.</p>"+
        "<p>Pode visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/editarferramenta/{{slug}}\">www.reda.azores.gov.pt/editarferramenta/{{slug}}</a></p>";
	var template = Handlebars.compile(source);

	return template(data);
}
exports.newWithValidator = function(data){
	var source = "<p>A ferramenta submetida encontra-se em processo de validação.</p>" +		
        "<p>Poderá visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/ferramentas\">www.reda.azores.gov.pt/ferramentas</a> após a respetiva aprovação</p>"+
        "<p>A equipa REDA agradece o seu contributo!</p>";
	var template = Handlebars.compile(source);

	return template(data);
}

exports.update = function(data){
	var source = "<p>Foi alterada a ferramenta <strong>{{title}}</strong> na plataforma REDA pelo utilizador <strong>{{username}}</strong>.</p>"+
        "<p>Pode visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/editarferramenta/{{slug}}\">www.reda.azores.gov.pt/editarferramenta/{{slug}}</a></p>";
	var template = Handlebars.compile(source);

	return template(data);
}

exports.notifyStatus = function(data){
	var source = "<p>A sua ferramenta <strong>{{tool}}</strong> já passou pelo processo de validação com o seguinte resultado: <strong>{{statusResult}}</strong></p>"+
        "{{#unless status}}"+
        	"A sua ferramenta <strong>{{statusResult}}</strong> com a seguinte justificação: </br>"+
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