const Handlebars = require('handlebars');

// Notify status change
exports.notifySignup = function(data){
  var source = "<p>O seu registo foi efetuado com sucesso. Por favor, siga pelo seguinte endereço para confirmar:</p>"+
        "<a href=\"https://reda.azores.gov.pt/registo/{{token}}\">www.reda.azores.gov.pt/registo/{{token}}</a>";
  var template = Handlebars.compile(source);

  return template(data);
}