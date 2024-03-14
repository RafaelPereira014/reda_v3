'use strict';

const validate = values => {
  const errors = {
  }

  // Title
  if (!values.title || values.title.length==0) {
    errors.title = 'Campo é obrigatório'
  }

  // Type
  if (!values.type || values.type.length==0){
    errors.type = 'Campo é obrigatório';
  }


  return errors
}

export default validate