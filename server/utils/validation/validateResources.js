'use strict'
const config = require('../../config/config.json');
const { showFileSize, stripAllTags } = require('../dataManipulation');

const allowedExt = ["gif","jpeg","jpg","png","svg", "rtf", "doc","docx","odt","txt","mp3","wav","wma","jar","ggb","swf","jnlp","xlsx","xls","ods","xlsm","zip","rar","pdf","gsp","pptx","ppt", "pps", "ppsx", "odp", "skp"];

const allowedThumbExt = ["gif","jpeg","jpg","png"];

exports.validate = function(values){
  const errors = {}
  let hashtags = values.hashtags ? values.hashtags : [];

// ISTO PRECISA SER ALTERADO...
 const totalHashtags = hashtags.length+values.tags.length;
  // Title
  if (!values.title) {
    errors.title = 'Título: O campo é obrigatório'
  }

  // Author
  if (!values.author) {
    errors.author = 'Autor: O campo é obrigatório'
  }

  // Email
  /*if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'E-mail: E-mail inserido não é válido';
  }*/

  // Organization
  if (!values.organization) {
    errors.organization = 'Organização: O campo é obrigatório'
  }

  // Keywords
 /* if (!values.tags) {
    errors.tags = 'Palavras-chave: O campo é obrigatório'
  }/*  else if (values.tags.length > 10 || values.tags.length < 5) {
    errors.tags = 'Palavras-chave: Deve ter entre 5 e 10 palavras-chave'
  } 
  else */
  if (totalHashtags < 5) {
    errors.tags = 'Deve conter no minimo um total de 5 palavras-chave'
  }

  // Formats
  if (!values.format) {
    errors.format = 'Formato: O campo é obrigatório'
  }

  // File
  if (!values.isOnline && !values.file && (( values.format && !values.format.includes(34842)))){
    errors.file = 'Ficheiro: Campo é obrigatório'
  }else if (!values.isOnline && values.file && values.file.size && values.file.size>config.maxFileSize) { // 1 000 000 = 1MB
    errors.file = 'Ficheiro: Ficheiro não deve exceder os '+showFileSize(config.maxFileSize)
  }else if(!values.isOnline && values.format && !values.format.includes(34842) && values.file && values.file.extension && allowedExt.indexOf(values.file.extension.toLowerCase())<0){
    errors.file = `Ficheiro: Extensão .${values.file.extension} não é permitida`
  }

  if (values.file && values.file.name && !values.file.id && !values.file.data){
    errors.file = 'Ficheiro: Campo é obrigatório';
  }

  // Duration
  if (values.format && (values.format.includes(34842) || values.format.includes(34844)) && !values.duration){
    errors.duration = 'Duração: Campo é obrigatório'
  }

  // Embed
  if (values.format && values.format.includes(34842) && !values.embed && !values.link){
    errors.embed = 'Código de incorporação: Campo é obrigatório'
  }

  // Link
  if (values.isOnline && (!values.link && !values.embed)){
    errors.embed = 'Código de incorporação: Campo é obrigatório'
  }

  // is file or is online
  if (!values.isOnline && !values.isFile){
    errors.isFile = 'Campo é obrigatório';
  }

  // Access modes
  if (!values.access || values.access.length==0) {
    errors.access = 'Modos de utilização: O campo é obrigatório'
  }

  /* ignore this for now, it's not required
  // Tech Resources
  if ((!values.techResources || values.techResources.length==0) && ((values.otherTechResources && values.otherTechResources=='') || !values.otherTechResources)) {
    errors.otherTechResources = 'Recursos Téncicos: Deverá escolher pelo menos 1 requisito técnico ou definir outro.';
  } else if(values.otherTechResources && values.otherTechResources!==''){
    if (values.otherTechResources.length < 3) {
      errors.otherTechResources = 'Recursos Téncicos: Deve ter pelo menos 3 caracteres'
    } else if (values.otherTechResources.length > 300) {
      errors.otherTechResources = 'Recursos Téncicos: Apenas deve conter no máximo 300 caracteres'
    }
  }*/

  // Description
  let desc = values.description ? stripAllTags(values.description) : null;

  if (!desc || desc.length==0 || desc=='') {
    errors.description = 'Descrição: O campo é obrigatório'
  } else if (desc.length < 20) {
    errors.description = 'Descrição: Deve ter pelo menos 20 caracteres'
  } else if (desc.length > 1500) {
    errors.description = 'Descrição: Apenas deve conter no máximo 1500 caracteres'
  }

  // Thumbnail
  if(values.thumbnail && values.thumbnail.extension && allowedThumbExt.indexOf(values.thumbnail.extension.toLowerCase())<0){
    let exts = "";
    allowedThumbExt.map((ext, idx) => {
      if(idx>0){
        exts+=", ";
      }
      exts+=ext;
    })

    errors.thumbnail = `Extensão .${values.thumbnail.extension} não é permitida. Carregue o ficheiro com uma das seguintes extensões: ${exts}.`;
  }else if (values.thumbnail && values.thumbnail.size && values.thumbnail.size>config.maxThumbFileSize) { // 1 000 000 = 1MB
    errors.thumbnail = 'Ficheiro não deve exceder os '+showFileSize(config.maxThumbFileSize)
  }

  // Macros
 /* if (!values.macro || values.macro.length==0) {
    errors.macro = 'Campo é obrigatório'
  }*/
  
   // Subjects
  if (!values.subjects || values.subjects.length==0) {
    errors.subjects = 'Disciplinas: Campo é obrigatório'
  }

  // Domains
  if (!values.domains || values.domains.length==0) {
    errors.domains = 'Domínios: Campo é obrigatório'
  }

  // Years
  if (!values.years || values.years.length==0) {
    errors.years = 'Anos: Campo é obrigatório'
  }

  // Languages
  if (!values.language) {
    errors.language = 'Idioma: Campo é obrigatório'
  }

  // Op Proposal
  let op_proposal = values.op_proposal ? stripAllTags(values.op_proposal) : null;

  if (!op_proposal || op_proposal.length==0 || op_proposal=='') {
    errors.op_proposal = 'Proposta de operacionalização: O campo é obrigatório'
  } else if (op_proposal.length < 20) {
    errors.op_proposal = 'Proposta de operacionalização: Deve ter pelo menos 20 caracteres'
  } else if (op_proposal.length > 1500) {
    errors.op_proposal = 'Proposta de operacionalização: Apenas deve conter no máximo 1500 caracteres'
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
  }else if (values.script_file && values.script_file.size && values.script_file.size>config.maxFileSize) { // 1 000 000 = 1MB
    errors.script_file = 'Ficheiro não deve exceder os '+showFileSize((config.maxFileSize))
  }

  // Accepted terms
  if (!values.accept_terms) {
    errors.accept_terms = 'Termos: Deve aceitar os termos e condições para criar o recurso'
  }

  return errors
}