'use strict';

const validate = values => {
  const errors = {}

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

  // Categories
  if (!values.terms || values.terms.length==0){
    errors.terms = 'Campo é obrigatório';
  }

  // Link
  if (!values.link || values.link.length==0){
    errors.link = 'Campo é obrigatório';
  }

  return errors
}

export default validate