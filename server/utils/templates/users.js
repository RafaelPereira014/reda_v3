const Handlebars = require('handlebars');

// Notify status change
exports.notifyPasswordChangeRequest = function(data){
  var source = "<p>O seu pedido de recuperação de palavra-passe foi efetuado. Por favor, siga pelo seguinte endereço para finalizar:</p>"+
        "<a href=\"https://reda.azores.gov.pt/recuperarpalavrapasse/{{token}}\">www.reda.azores.gov.pt/recuperarpalavrapasse/{{token}}</a>";
  var template = Handlebars.compile(source);

  return template(data);
}