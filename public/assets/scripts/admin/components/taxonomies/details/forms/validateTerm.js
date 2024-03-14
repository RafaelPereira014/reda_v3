'use strict';

// Utils
import { showFileSize } from '#/utils';
import appConfig from '#/config';

const allowedThumbExt = ["gif","jpeg","jpg","png", "svg"];

const validate = values => {
  const errors = {
  }

  // Title
  if (!values.title || values.title.length==0) {
    errors.title = 'Campo é obrigatório'
  }

  if(values.color && !/^#[0-9A-F]{6}$/i.test(values.color)){
    errors.color = 'Formato da cor não é válido'
  }

  // Image
  if (values.image && values.image.size && values.image.size>appConfig.maxThumbFileSize) { // 1 000 000 = 1MB
    errors.image = 'Ficheiro não deve exceder '+showFileSize(appConfig.maxThumbFileSize)
  }else if(values.image && values.image.extension && allowedThumbExt.indexOf(values.image.extension.toLowerCase())<0){
    errors.image = `Extensão .${values.image.extension} não é permitida`
  }


  return errors
}

export default validate