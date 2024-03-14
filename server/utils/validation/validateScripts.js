'use strict'
const config = require('../../config/config.json');

const { showFileSize, stripAllTags } = require('../dataManipulation');

const allowedExt = ["gif","jpeg","jpg","png","svg", "rtf", "doc","docx","odt","txt","mp3","wav","wma","jar","ggb","swf","jnlp","xlsx","xls","ods","xlsm","zip","rar","pdf","gsp","pptx","ppt", "pps", "ppsx", "odp", "skp"];

exports.validate = function(values){
  const errors = {}

  // Accepted terms
  if (!values.accept_terms) {
    errors.accept_terms = 'Deve aceitar os termos e condições para criar o recurso'
  }

  errors.scripts = values.scripts.map(exports.singleScript);

  return errors
}

exports.singleScript = function(values){
  const errors = {};
  let hashtags = values.hashtags ? values.hashtags : [];


 const totalHashtags = hashtags.length+values.tags.length;

  // Keywords
/*  if (!values.tags) {
    errors.tags = 'Palavras-chave: O campo é obrigatório'
  } else if (values.tags.length > 10 || values.tags.length < 5) {
    errors.tags = 'Palavras-chave: Deve ter entre 5 e 10 palavras-chave'
  }*/
  
  // Subjects
  if (!values.subjects || values.subjects.length==0) {
    errors.subjects = 'Campo é obrigatório'
  }
  // Years
  if (!values.years || values.years.length==0) {
    errors.years = 'Campo é obrigatório'
  }

/* FOI COMENTADO TEMPORARIAMENTE PARA TESTAR A CRIAÇÃO DE RECURSOS, DURANTE A FASE DE MIGRAÇÃO PARA O NOVO MODELO DE RECURSOS

  if (totalHashtags < 5) {
    errors.tags = 'Deve conter no minimo um total de 5 palavras-chave'
  }

  // domains
  if (!values.domains || values.domains.length==0) {
    errors.domains = 'Campo é obrigatório'
  }

*/

  // Macros
 /* if (!values.macro || values.macro.length==0) {
    errors.macro = 'Campo é obrigatório'
  }
*/
  // Terms
  if (!values.terms || values.terms.length==0) {
    errors.years = 'Campo é obrigatório';
    errors.subjects = 'Campo é obrigatório';
    errors.domains = 'Campo é obrigatório';
   // errors.macro = 'Campo é obrigatório'
  }

  // Op Proposal
  let op_proposal = values.op_proposal ? stripAllTags(values.op_proposal) : null;

  if (!op_proposal || op_proposal.length==0 || op_proposal=='') {
    errors.op_proposal = 'O campo é obrigatório'
  } else if (op_proposal.length < 20) {
    errors.op_proposal = 'Deve ter pelo menos 20 caracteres'
  } else if (op_proposal.length > 1500) {
    errors.op_proposal = 'Apenas deve conter no máximo 1500 caracteres'
  }

   // File
  if (values.file && values.file.size && values.file.size>config.maxFileSize) { // 1 000 000 = 1MB
    errors.file = 'Ficheiro: Ficheiro não deve exceder os '+showFileSize(config.maxFileSize)
  }else if(values.file && values.file.extension && allowedExt.indexOf(values.file.extension.toLowerCase())<0){
    errors.file = `Ficheiro: Extensão .${values.file.extension} não é permitida`
  }

  if (values.file && values.file.name && !values.file.id && !values.file.data){
    errors.file = 'Ficheiro: Campo é obrigatório';
  }

  if (values.hasOwnProperty("accept_terms") && !values.accept_terms){
    errors.accept_terms = 'Deve aceitar os termos e condições para criar o recurso'
  }

  return errors;
}