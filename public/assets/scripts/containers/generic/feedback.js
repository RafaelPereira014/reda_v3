'use strict';

import { connect } from 'react-redux';
import { reduxForm, formValueSelector, reset, destroy } from 'redux-form';
import { bindActionCreators } from 'redux';

import FeedbackForm from '#/components/feedback/form';
import { submitForm } from '#/actions/feedback';
import { addAlert } from '#/actions/alerts';

export const fields = [ 
  'subject', 
  'message', 
  'name', 
  'email',
  'recaptcha'
];

/* Validate field types */
export const validate = values => {
  const errors = {}
  if (!values.subject || values.subject.length==0) {
    errors.subject = 'O campo é obrigatório';
  }

  if (values.email && !validateEmail(values.email)){
    errors.email = 'Deve inserir um e-mail válido';
  }

  if (!values.name) {
    errors.name = 'É necessário inserir a palavra-chave';
  }

  // Description
  if (!values.message) {
    errors.message = 'O campo é obrigatório'
  } else if (values.message.length > 1500) {
    errors.message = 'Apenas deve conter no máximo 1500 caracteres'
  }

  if (!values.recaptcha){
    errors.recaptcha = 'Deve completar o desafio "reCaptcha"';
  }

  if (!values.acceptance){
    errors.acceptance = 'Deverá concordar com a política de privacidade para submeter a sua questão';
  }

  return errors
}

/* Email validation */
const validateEmail = (value) => {
  // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
};

const selector = formValueSelector('feedbackForm');

/* Set sharable state */
function mapStateToProps(state) {
  return { 
    auth: state.auth,
    feedback: state.feedback,
    initialValues: {
      subject: []
    },
    subject: selector(state, 'subject'),
    message: selector(state, 'message'),
    name: selector(state, 'name'),
    email: selector(state, 'email'),
    recaptcha: selector(state, 'recaptcha'),
    acceptance: selector(state, 'acceptance')
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    submitForm, 
    addAlert,
    resetForm: () => dispatch(reset('feedbackForm')),
    destroy: () => dispatch(destroy('feedbackForm'))
  }, dispatch);
}

let SelectingFormValuesForm = reduxForm({
  form: 'feedbackForm',
  fields,
  asyncBlurFields: [ ],
  validate
})(FeedbackForm);

export default connect (mapStateToProps, mapDispatchToProps)(SelectingFormValuesForm);
