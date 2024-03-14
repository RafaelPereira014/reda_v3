'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { reduxForm, formValueSelector } from 'redux-form';

import SignupForm from '#/components/auth/signupForm';
import { bindActionCreators } from 'redux';
import { signupUser } from '#/actions/auth';
import { fetchRolesGeneric } from '#/actions/roles';

export const fields = [ 
  'email', 
  'name',
  'organization',
  'password', 
  'organization', 
  'authKey',
  'userType'
];

/* Validate field types */
export const validate = values => {
  const errors = {}
  if (!values.email) {
    errors.email = 'O campo é obrigatório';
  }

  if (values.email && !validateEmail(values.email)){
    errors.email = 'Deve inserir um e-mail válido';
  }

  if (!values.name) {
    errors.name = 'O campo é obrigatório';
  }

  if (!values.userType) {
    errors.userType = 'O campo é obrigatório';
  }

  if (!values.password) {
    errors.password = 'É necessário inserir a palavra-passe';
  }

  if (values.userType && (values.userType.type=='teacher' || values.userType.type=='editor') && !values.organization) {
    errors.organization = 'O campo é obrigatório';
  }

  if (!values.acceptance){
    errors.acceptance = 'Deverá concordar com a política de privacidade';
  }

  /*if (!values.authKey) {
    errors.authKey = 'Deve inserir a chave que lhe foi fornecida pela organização';
  }*/

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
  return { 
    auth: state.auth,
    roles: state.roles,
    initialValues: {
      authKey:null,
      organization: null
    },
    userType: selector(state, 'userType')
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchRolesGeneric,
    signupUser
  }, dispatch);
}



const selector = formValueSelector('SignupForm');

let SelectingFormValuesForm = reduxForm({
  form: 'SignupForm',              // <------ same form name
  fields,                      // <------ only fields on this page
 /*  asyncValidate, */
  validate                     // <------ only validates the fields on this page
})(SignupForm);

export default connect (mapStateToProps, mapDispatchToProps)(withRouter(SelectingFormValuesForm));