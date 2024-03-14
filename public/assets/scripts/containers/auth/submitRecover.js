'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';

import SubmitRecoverForm from '#/components/auth/submitRecover';
import { submitNewPassword, recoverError } from '#/actions/auth';
export const fields = [ 
  'password',
  'confirmPassword'
];

/* Validate field types */
export const validate = values => {
  const errors = {}
  if (!values.password) {
    errors.password = 'O campo é obrigatório';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'O campo é obrigatório';
  }

  if (values.confirmPassword && values.confirmPassword && values.confirmPassword != values.confirmPassword) {
    errors.confirmPassword = 'As palavras-passe não são iguais.';
  }

  return errors
}

/* Set sharable state */
function mapStateToProps(state) {
  return { 
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    submitNewPassword,
    recoverError
  }, dispatch);
}

let SelectingFormValuesForm = reduxForm({
  form: 'submitRecover',              // <------ same form name
  fields,                      // <------ only fields on this page
  validate                     // <------ only validates the fields on this page
})(SubmitRecoverForm);

export default connect (mapStateToProps, mapDispatchToProps)(withRouter(SelectingFormValuesForm));