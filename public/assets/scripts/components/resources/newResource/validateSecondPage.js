'use strict';

// Utils
import { showFileSize, stripAllTags } from '#/utils';
import appConfig from '#/config';

const allowedExt = ["gif","jpeg","jpg","png","svg", "rtf", "doc","docx","odt","txt","mp3","wav","wma","jar","ggb","swf","jnlp","xlsx","xls","ods","xlsm","zip","rar","pdf","gsp","pptx","ppt", "pps", "ppsx", "odp", "skp"];

const validate = values => {
  const errors = {}
  let hashtags = values.hashtags ? values.hashtags : [];


 let totalHashtags = hashtags.length+values.tags.length;


  // Subjects
  if (!values.subjects || values.subjects.length==0) {
    errors.subjects = 'Campo é obrigatório'
  }

  // Domains
  if (!values.domains || values.domains.length==0) {
    errors.domains = 'Campo é obrigatório'
  }
  // subdominios

  if (!values.subdominios || values.subdominios.length==0) {
    totalHashtags = values.tags.length
  }

    // comentado temporariamente para testar a criação de recursos, sem hashtags

  if (totalHashtags<5) {
    errors.tags = 'Deve conter no minimo um total de 5 palavras-chave, o seu total é de: '+totalHashtags
  }
/*
  if(totalHashtags>=5){
    // hashtags
    // comentado temporariamente para testar a criação de recursos, sem hashtags
    if (!values.hashtags || values.hashtags.length==0) {
      errors.hashtags = 'Deve selecionar no mínimo uma palavra-chave desta lista'
    }
      // Tags

  }else{
    // hashtags
    //errors.hashtags = 'Deve conter no minimo um total de 5 hashtags e 5 palavras-chave'
    // Tags
    errors.tags = 'Deve conter no minimo um total de 5 palavras-chave, o seu total é de: '+totalHashtags
  }*/
  // Years
  if (!values.years || values.years.length==0) {
    errors.years = 'Campo é obrigatório'
  }

  // Macros
  /*if (!values.macro || values.macro.length==0) {
    errors.macro = 'Campo é obrigatório'
  }*/


  // Targets
  if (!values.targets || values.targets.length==0) {
    errors.targets = 'Campo é obrigatório'
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

  // Script File
  if(values.script_file && values.script_file.extension && allowedExt.indexOf(values.script_file.extension.toLowerCase())<0){
    let exts = "";
    allowedExt.map((ext, idx) => {
      if(idx>0){
        exts+=", ";
      }
      exts+=ext;
    })

    errors.script_file = `Extensão .${values.script_file.extension} não é permitida. Carregue o ficheiro com uma das seguintes extensões: ${exts}.`;
  }else if (values.script_file && values.script_file.size && values.script_file.size>appConfig.maxFileSize) { // 1 000 000 = 1MB
    errors.script_file = 'Ficheiro não deve exceder os '+showFileSize((appConfig.maxFileSize))
  }

  // Accepted terms
  if (!values.accept_terms) {
    errors.accept_terms = 'Deve aceitar os termos e condições para criar o recurso'
  }

  return errors
}

export default validate