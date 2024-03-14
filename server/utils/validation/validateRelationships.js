'use strict'
var dataUtils = require("../dataManipulation");
const allowedExt = ["gif","jpeg","jpg","png","svg"];

exports.validate = values => {
  const errors = {}

  if(values.terms && values.terms.length>0){
    errors.terms = values.terms.map((term) => {
      var termsErrors = {};
      if(!term.term_id && term.term_id!==0){
        termsErrors.term_id = 'Campo é obrigatório'
      }

      if(!term.level){
        termsErrors.level = 'Campo é obrigatório'
      }

      return termsErrors;
    });

    var removeErrors = false;
    if (errors.terms){
      errors.terms.map(errObj => {
        removeErrors = dataUtils.isEmpty(errObj);
      });

      if (removeErrors){
        delete errors.terms;
      }
    }
  }else{
    errors.terms = 'Deve fornecer termos a adicionar'
  }

  /* // Term
  if (!values.term || values.term.length==0) {
    errors.term = 'Campo é obrigatório'
  }


  // Level
  if (!values.level || values.level.length==0){
    errors.level = 'Campo é obrigatório';
  } */

  return errors
}