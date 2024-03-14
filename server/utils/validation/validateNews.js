'use strict'
const { showFileSize } = require('../dataManipulation');

const config = require('../../config/config.json');

const allowedThumbExt = ["gif","jpeg","jpg","png"];

exports.validate = values => {
  const errors = {}

  // Title
  if (!values.title || values.title.length==0) {
    errors.title = 'Campo é obrigatório'
  }

  // Description
  if (!values.description || values.description.length==0 || values.description=='') {
    errors.description = 'O campo é obrigatório'
  }

  // thumbnail
  if (values.thumbnail && values.thumbnail.size && values.thumbnail.size>config.maxThumbFileSize) { // 1 000 000 = 1MB
    errors.thumbnail = 'Ficheiro não deve exceder '+showFileSize(config.maxThumbFileSize)
  }else if(values.thumbnail && values.thumbnail.extension && allowedThumbExt.indexOf(values.thumbnail.extension.toLowerCase())<0){
    errors.thumbnail = `Extensão .${values.thumbnail.extension} não é permitida`
  }

  return errors
}