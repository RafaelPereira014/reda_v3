'use strict'
const { showFileSize } = require('../dataManipulation');

const config = require('../../config/config.json');

const allowedThumbExt = ["gif","jpeg","jpg","png", "svg"];

exports.validate = (values, action = '') => {
  const errors = {}

  // Title
  if (!values.title || values.title.length==0) {
    errors.title = 'Campo é obrigatório'
  }


  // Taxonomy
  if ((!values.tax || values.tax.length==0) && action=='create'){
    errors.tax = 'Campo é obrigatório';
  }

  // thumbnail
  if (values.image && values.image.size && values.image.size>config.maxThumbFileSize) { // 1 000 000 = 1MB
    errors.image = 'Ficheiro não deve exceder '+showFileSize(config.maxThumbFileSize)
  }else if(values.image && values.image.extension && allowedThumbExt.indexOf(values.image.extension.toLowerCase())<0){
    errors.image = `Extensão .${values.image.extension} não é permitida`
  }

  return errors
}