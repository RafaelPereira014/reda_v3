const Handlebars = require('handlebars');

exports.new = function(data){
	var source = "<p>Foi adicionada uma nova aplicação na plataforma REDA pelo utilizador <strong>{{username}}</strong>.</p>"+
        "<p>Pode visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/editarapp/{{slug}}\">www.reda.azores.gov.pt/editarapp/{{slug}}</a></p>";
	var template = Handlebars.compile(source);

	return template(data);
}
exports.newWithValidator = function(data){
	var source = "<p>A aplicação submetida encontra-se em processo de validação.</p>" +		
        "<p>Poderá visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/aplicacoes\">www.reda.azores.gov.pt/aplicacoes</a> após a respetiva aprovação</p>"+
        "<p>A equipa REDA agradece o seu contributo!</p>";
	var template = Handlebars.compile(source);

	return template(data);
}

exports.update = function(data){
	var source = "<p>Foi alterada a aplicação <strong>{{title}}</strong> na plataforma REDA pelo utilizador <strong>{{username}}</strong>.</p>"+
        "<p>Pode visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/editarapp/{{slug}}\">www.reda.azores.gov.pt/editarapp/{{slug}}</a></p>";
	var template = Handlebars.compile(source);

	return template(data);
}

exports.notifyStatus = function(data){
	var source = "<p>A sua aplicação <strong>{{app}}</strong> já passou pelo processo de validação com o seguinte resultado: <strong>{{statusResult}}</strong></p>"+
        "{{#unless status}}"+
        	"A sua aplicação <strong>{{statusResult}}</strong> com a seguinte justificação: </br>"+
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