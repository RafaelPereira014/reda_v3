'use strict';

import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import LoginForm from '#/components/auth/loginForm';
import { loginUser, resetErrors } from '#/actions/auth';
import { withRouter } from "react-router-dom";

export const fields = [ 'email', 'password' ];

/* Validate field types */
export const validate = values => {
  
  const errors = {}
  if (!values.email) {
    errors.email = 'O campo é obrigatório';
  }

  if (values.email && !validateEmail(values.email)){
    errors.email = 'Deve inserir um e-mail válido';
  }

  if (!values.password) {
    errors.password = 'É necessário inserir a palavra-passe';
  }
  
  return errors
}


/* Email validation */
const validateEmail = (value) => {
  // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
};

/* Set sharable state */
function mapStateToProps(state) {
  return { auth: state.auth};
}

let InitializeFromStateForm = reduxForm({
  form: 'LoginForm',
  fields,
  validate
})(LoginForm);

export default connect(mapStateToProps, {loginUser, resetErrors})(withRouter(InitializeFromStateForm))