'use strict';
// Utils
import { showFileSize, stripAllTags } from '#/utils';

const allowedExt = ["gif","jpeg","jpg","png","svg", "rtf", "doc","docx","odt","txt","mp3","wav","wma","jar","ggb","swf","jnlp","xlsx","xls","ods","xlsm","zip","rar","pdf","gsp","pptx","ppt", "pps", "ppsx", "odp", "skp"];

import appConfig from '#/config';

/* const requireFields = (...names) => data =>
  names.reduce((errors, name) => {
    if (!data[name]) {
      errors[name] = 'Required'
    }
    return errors
  }, {}) */

const validateScript = (values) => {
  const errors = {};

  let hashtags = values.hashtags ? values.hashtags : [];


 const totalHashtags = hashtags.length+values.tags.length;
  

  // Keywords
 /* if (!values.tags) {
    errors.tags = 'Palavras-chave: O campo é obrigatório'
  }*/
  /* else if (values.tags.length > 10 || values.tags.length < 5) {
    errors.tags = 'Palavras-chave: Deve ter entre 5 e 10 palavras-chave'
  }*/

  // Targets
  if (!values.targets || values.targets.length==0) {
    errors.targets = 'Campo é obrigatório'
  }

  // Macros
  /*if (!values.macro || values.macro.length==0) {
    errors.macro = 'Campo é obrigatório'
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
  // domains
  if (!values.domains || values.domains.length==0) {
    errors.domains = 'Campo é obrigatório'
  }
  if (!values.subdominios || values.subdominios.length==0) {
    errors.subdominios = 'Campo é obrigatório'
  }
  if (!values.hashtags || values.hashtags.length==0) {
    errors.hashtags = 'Deve selecionar no minimo uma palavra-chave desta lista'
  }

  if(totalHashtags>=5){
    // hashtags
    if (!values.hashtags || values.hashtags.length==0) {
      errors.hashtags = 'Deve selecionar no minimo uma palavra-chave desta lista'
    }
      // Tags

  }else{
    // hashtags
    //errors.hashtags = 'Deve conter no minimo um total de 5 hashtags e 5 palavras-chave'
    // Tags
    errors.tags = 'Deve conter no minimo um total de 5 palavras-chave, o seu total é de: '+totalHashtags
  }
  */


  if (!values.terms || values.terms.length==0) {
    errors.subjects = 'Campo é obrigatório';
    errors.years = 'Campo é obrigatório';
    errors.domains = 'Campo é obrigatório';
    //errors.macro = 'Campo é obrigatório';
    errors.subdominios = 'Campo é obrigatório';
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

  if (values.hasOwnProperty("accept_terms") && !values.accept_terms){
    errors.accept_terms = 'Deve aceitar os termos e condições para criar o recurso'
  }

  // File
  if (values.file && values.file.size && values.file.size>appConfig.maxFileSize) { // 1 000 000 = 1MB
    errors.file = 'Ficheiro não deve exceder os '+showFileSize(appConfig.maxFileSize)
  }else if(values.file && values.file.extension && allowedExt.indexOf(values.file.extension.toLowerCase())<0){
    errors.file = `Extensão .${values.file.extension} não é permitida`
  }

  return errors
}

const validateScriptForm = data => {
  const errors = {};

  // Accepted terms
  if (!data.accept_terms) {
    errors.accept_terms = 'Deve aceitar os termos e condições para criar o recurso'
  }

  if (data.scripts && data.scripts.length>0)
    errors.scripts = data.scripts.map(validateScript);
  
  return errors;
}
export {validateScript}
export default validateScriptForm;