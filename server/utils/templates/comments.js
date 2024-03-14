const Handlebars = require('handlebars');

// Notify status change
exports.notifyStatus = function(data){
	var source = "<p>O seu comentário ao recurso <strong>{{resource}}</strong> já passou pelo processo de validação com o seguinte resultado: <strong>{{statusResult}}</strong></p>"+
        "{{#if message}}"+
        	"O seu comentário foi <strong>{{statusResult}}</strong> com a seguinte justificação: </br>"+
        	"<em>{{message}}</em>" +
        "{{/if}}";
	var template = Handlebars.compile(source);

	return template(data);
}

// Notify new comment
exports.notifyNew = function(data){
	var source = "<p>Foi adicionado um novo comentário ao recurso <strong>{{resource}}</strong>. O mesmo encontra-se para validação por parte da administração.</p>"+
       "<p>Poderá visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/recursos/detalhes-recurso/{{resourceSlug}}\">www.reda.azores.gov.pt/recursos/detalhes-recurso/{{resourceSlug}}</a></p>"+
       "{{#if comment}}"+
        	"<strong>Texto do comentário:</strong> </br>"+
        	"<em>{{comment}}</em>" +
        "{{/if}}";
	var template = Handlebars.compile(source);

	return template(data);
}

// Notify response
exports.notifyReply = function(data){
	var source = "<p>Obteve uma resposta ao seu comentário no recurso <strong>{{resource}}</strong>. A mesma encontra-se para validação por parte da administração.</p>"+
       "<p>Poderá visualizar os seus detalhes em <a href=\"https://reda.azores.gov.pt/recursos/detalhes-recurso/{{resourceSlug}}\">www.reda.azores.gov.pt/recursos/detalhes-recurso/{{resourceSlug}}</a></p>";
	var template = Handlebars.compile(source);

	return template(data);
}