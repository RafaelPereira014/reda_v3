'use strict';

import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import RecoverRequestForm from '#/components/auth/requestRecover';
import { submitRequestRecover } from '#/actions/auth';
export const fields = [ 
  'email'
];

/* Validate field types */
export const validate = values => {
  const errors = {}
  if (!values.email) {
    errors.email = 'O campo é obrigatório';
  }

  return errors
}


/* Set sharable state */
function mapStateToProps(state) {
  return { auth: state.auth};
}

let InitializeFromStateForm = reduxForm({
  form: 'requestRecover',
  fields,
  validate
})(RecoverRequestForm);

export default connect(mapStateToProps, {submitRequestRecover})(withRouter(InitializeFromStateForm))