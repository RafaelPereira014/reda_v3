'use strict';

// Utils
import { showFileSize, stripAllTags } from '#/utils';
import appConfig from '#/config';

const allowedExt = ["gif","jpeg","jpg","png","svg", "rtf", "doc","docx","odt","txt","mp3","wav","wma","jar","ggb","swf","jnlp","xlsx","xls","ods","xlsm","zip","rar","pdf","gsp","pptx","ppt", "pps", "ppsx", "odp", "skp"];

const allowedThumbExt = ["gif","jpeg","jpg","png"];


const validate = values => {
  const errors = {}
  
  // Title
  if (!values.title) {
    errors.title = 'O campo é obrigatório'
  }

  // Author
  if (!values.author) {
    errors.author = 'O campo é obrigatório'
  }

  // Email
  /*if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'E-mail inserido não é válido';
  }*/

  // Organization
  if (!values.organization) {
    errors.organization = 'O campo é obrigatório'
  }

  // Formats
  if (!values.format || values.format.length==0) {
    errors.format = 'O campo é obrigatório'
  }

  //Formats max
  if (values.format && values.format.length>2){
    errors.format = 'Deve escolher no máximo 2 formatos'
  }

  // File
  if (!values.isOnline && !values.file && ( (values.format && !values.format.includes(34842)))){
    errors.file = 'Campo é obrigatório'
  }else if (!values.isOnline && values.file && values.file.size && values.file.size>appConfig.maxFileSize) { // 1 000 000 = 1MB
    errors.file = 'Ficheiro não deve exceder os '+(appConfig.maxFileSize/(1024*1024))+' MB'
  }else if(!values.isOnline && values.format && !values.format.includes(34842) && values.file && values.file.extension && allowedExt.indexOf(values.file.extension.toLowerCase())<0){
    errors.file = `Extensão .${values.file.extension} não é permitida`
  }

  // Duration
  if (values.format && (values.format.includes(34842) || values.format.includes(34844)) && !values.duration){
    errors.duration = 'Campo é obrigatório'
  }

  // Embed
  if (values.format && values.format.includes(34842) && !values.embed && !values.link){
    errors.embed = 'Campo é obrigatório'
  }

  // is file or is online
  if (!values.isOnline && !values.isFile){
    errors.isFile = 'Campo é obrigatório';
  }

  // Link
  if (values.isOnline && (!values.link && !values.embed)){
    errors.embed = 'Campo é obrigatório'
  }

  // Access modes
  if (!values.access || values.access.length==0) {
    errors.access = 'O campo é obrigatório'
  }

  /* ignore this for now, it's not required
  // Tech Resources
  if ((!values.techResources || values.techResources.length==0) && ((values.otherTechResources && values.otherTechResources=='') || !values.otherTechResources)) {
    errors.otherTechResources = 'Deverá escolher pelo menos 1 requisito técnico ou definir outro.';
  } else if(values.otherTechResources && values.otherTechResources!==''){
    if (values.otherTechResources.length < 3) {
      errors.otherTechResources = 'Deve ter pelo menos 3 caracteres'
    } else if (values.otherTechResources.length > 300) {
      errors.otherTechResources = 'Apenas deve conter no máximo 300 caracteres'
    }
  }*/

  // Description
  let desc = values.description ? stripAllTags(values.description) : null;

  if (!desc || desc.length==0 || desc=='') {
    errors.description = 'O campo é obrigatório'
  } else if (desc.length < 20) {
    errors.description = 'Deve ter pelo menos 20 caracteres'
  } else if (desc.length > 1500) {
    errors.description = 'Apenas deve conter no máximo 1500 caracteres'
  }

  // Languages
  if (!values.language) {
    errors.language = 'Campo é obrigatório'
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
  }else if (values.thumbnail && values.thumbnail.size && values.thumbnail.size>appConfig.maxThumbFileSize) { // 1 000 000 = 1MB
    errors.thumbnail = 'Ficheiro não deve exceder os '+showFileSize((appConfig.maxThumbFileSize))
  }

  return errors
}

export default validate