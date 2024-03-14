'use strict';

const validate = values => {
  const errors = {}

  if (!values.name) {
    errors.name = 'O campo é obrigatório'
  }

  if (!values.organization) {
    errors.organization = 'O campo é obrigatório'
  }

  if (values.password && !values.confirmPassword){
    errors.confirmPassword = 'Deve confirmar a palavra-passe se a deseja alterar'
  }

  if (values.password && values.confirmPassword && values.password!=values.confirmPassword){
    errors.confirmPassword = 'Palavras-passe não coincidem'
  }

  return errors
}

export default validate