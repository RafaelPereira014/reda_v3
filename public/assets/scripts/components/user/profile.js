'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';

// Components
import renderFormControl from '#/components/fields/genericField';

// Validation
import validate from './validation/profileValidate';

export const fields = [ 
	'hidden',
	'password',
  'confirmPassword',
  'organization',
  'name'
]


/**
 * FORM FIRST PAGE
 */
class ProfileForm extends Component {
  constructor(props){
    super(props);

    //
    //  Event handlers
    //
  }

  render() {
    const {    
      invalid,
      handleSubmit,
      submitting,
      submitFailed,
    } = this.props;

    return (
      <form onSubmit={handleSubmit} className="form user-form">
        {/* ORGANIZATION */}
        <div className="row">
          <div className="col-xs-12">
            <h2>A minha informação</h2>
            <label className="input-title required">A minha organização</label>
            <Field
              controlType="input"
              type="text"
              className="form-control"
              formGroupClassName="form-group"
              placeholder="A minha organização"
              component={renderFormControl} 
              name="organization"/>

            <label className="input-title required">O meu nome</label>
            <Field
              controlType="input"
              type="text"
              className="form-control"
              formGroupClassName="form-group"
              placeholder="O meu nome"
              component={renderFormControl} 
              name="name"/>
          </div>          
        </div>

        {/* HIDDEN */}
        <div className="row">
          <div className="col-xs-12 form-group">
            <h2>Definições de conta</h2>
            <Field
              controlType="input"
              type="checkbox"
              id="hidden" 
              component={renderFormControl} 
              name="hidden" 
              childPos="bottom">
                <label htmlFor="hidden">Não mostrar a minha informação a outros utilizadores. Mostrar apenas o nome da minha organização.</label>
              </Field>
          </div>
        </div>

      {/* PASSWORD */}
      <div className="row">
          <div className="col-xs-12">
            <h2>Palavra-passe</h2>
            <small>Preencha os campos se pretender alterar a sua palavra-passe</small>
            <label className="input-title">Nova palavra-passe</label>
            <Field
              controlType="input"
              type="password"
              className="form-control"
              formGroupClassName="form-group"
              placeholder="Insira a nova palavra-passe"
              component={renderFormControl} 
              name="password"/>
          </div>   

          <div className="col-xs-12">
            <label className="input-title">Confirmar palavra-passe</label>
            <Field
              controlType="input"
              type="password"
              className="form-control"
              formGroupClassName="form-group"
              placeholder="Confirmar nova palavra-passe"
              component={renderFormControl} 
              name="confirmPassword"/>
          </div>         
        </div>

        {/* NEXT */}
        <footer className="form-buttons">
          <p><small><span className="text-danger">*</span> Campo obrigatório</small></p>
          {submitFailed && invalid && 
              <div className="alert alert-danger" role="alert">
                <p>Existem alguns problemas nos dados fornecidos. Reveja o formulário e os respetivos erros.</p>
              </div>
          }
          <button type="submit" disabled={submitting} className="cta primary">
            {submitting ? <i className='fa fa-spinner fa-spin'></i> : ""} Guardar alterações
          </button>
        </footer>
      </form>
    )
  }
}

ProfileForm.propTypes = {
  fields: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

const selector = formValueSelector('updateUser');

let SelectingFormValuesForm = reduxForm({
  form: 'updateUser',              // <------ same form name
  fields,                      // <------ only fields on this page
  validate
})(ProfileForm);

export default connect (
state => ({
  initialValues: {
  },
  hidden: selector(state, 'hidden'),
  password: selector(state, 'password'),
  confirmPassword: selector(state, 'confirmPassword'),
  organization: selector(state, 'organization'),
  name: selector(state, 'name')
}))(SelectingFormValuesForm);