'use strict';
// Utils
import { showFileSize } from '#/utils';

import appConfig from '#/config';

const allowedExt = ["gif","jpeg","jpg","png"];

const validate = values => {
  const errors = {
    taxs:[]
  }

  // Title
  if (!values.title || values.title.length==0) {
    errors.title = 'Campo é obrigatório'
  }

  // Description
  if (!values.description || values.description.length==0 || values.description=='') {
    errors.description = 'O campo é obrigatório'
  } else if (values.description.length < 20) {
    errors.description = 'Deve ter pelo menos 20 caracteres'
  } else if (values.description.length > 1500) {
    errors.description = 'Apenas deve conter no máximo 1500 caracteres'
  }

  // Themes
  if (!values.temas_apps || values.temas_apps.length==0){
    errors.temas_apps = 'Campo é obrigatório';
  }

  // Categories
  if (!values.categorias_apps || values.categorias_apps.length==0){
    errors.categorias_apps = 'Campo é obrigatório';
  }

  // Systems
  if (!values.sistemas_apps || values.sistemas_apps.length==0){
    errors.sistemas_apps = 'Campo é obrigatório';
  }

  if (values.sistemas_apps){
    errors.links = values.links.map((link) => {
      let linksErrors = {};
      if (values.sistemas_apps.indexOf(link.id)>=0){
        if (link.link!=undefined && link.link.length==0){
          linksErrors.link = 'Campo é obrigatório'
        }
      }
      return linksErrors;
    });
  }

  // Image
  if (values.image && values.image.size && values.image.size>appConfig.maxThumbFileSize) { // 1 000 000 = 1MB
    errors.image = 'Ficheiro não deve exceder os '+showFileSize(appConfig.maxThumbFileSize)
  }else if(values.image && values.image.extension && allowedExt.indexOf(values.image.extension.toLowerCase())<0){
    errors.image = `Extensão .${values.image.extension} não é permitida`
  }

  return errors
}

export default validate