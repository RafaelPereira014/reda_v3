'use strict'
var dataUtils = require("../dataManipulation");
const allowedExt = ["gif","jpeg","jpg","png","svg"];

exports.validate = values => {
  const errors = {}

  // Title
  if (!values.title || values.title.length==0) {
    errors.title = 'Campo é obrigatório'
  }

  return errors
}