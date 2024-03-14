'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import appConfig from '#/config';

import {Link} from 'react-router-dom';

// Components
import renderRecaptcha from '#/components/fields/recaptchaField';

import renderFormControl from '#/components/fields/genericField';
import renderTextArea from '#/components/fields/textareaInput';
import renderCheckboxGroup from '#/components/fields/checkboxGroupInput';

// Alerts
import * as alertMessages from '#/actions/message-types';

export default class FeedbackForm extends Component {
  constructor(props){
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    //
    //  Event handlers
    //
    this.setSubjects = this.setSubjects.bind(this);
    this.verifyRecaptcha = this.verifyRecaptcha.bind(this);

    //
    //  Renders
    //
    
    //
    //  Globals
    //
    this.subjects = [
      {
        title: 'Recursos',
        reserved: false
      },
      {
        title: 'Sugestões (endereços)',
        reserved: true
      },
      {
        title: 'Aplicações',
        reserved: false
      },
      {
        title: 'Experimenta',
        reserved: false
      },
      {
        title: 'Comentários',
        reserved: true
      },
      /*{
        title: 'Notícias',
        reserved: true
      },*/
      {
        title: 'Problemas técnicos',
        reserved: false
      },
      {
        title: 'Registo',
        reserved: false
      },
      {
        title: 'Outros',
        reserved: false
      }
    ]
  }

  componentDidMount(){
    window.scrollTo(0, 0);
  }

  verifyRecaptcha(response){
    this.props.change('recaptcha', response);
  }

  onSubmit(props){
    return new Promise((resolve, reject) => {
      this.props.submitForm(props)
      .then(() => {

        const { errorMessage, errorStatus } = this.props.feedback

        // Dispatch errors to form if any
        if ((errorMessage || errorStatus) && errorMessage.form_errors){
          reject(errorMessage.form_errors);
          this.props.addAlert(alertMessages.ALERT_FEEDBACK_SEND_ERROR, alertMessages.ERROR);

        }else if (errorMessage || errorStatus){
          reject();
          this.props.addAlert(alertMessages.ALERT_SERVER_ERROR, alertMessages.ERROR);

        }else{          
          resolve();  
          this.props.addAlert(alertMessages.ALERT_FEEDBACK_SEND_SUCCESS, alertMessages.SUCCESS);
        }

        this.props.resetForm();
        // eslint-disable-next-line no-undef
        grecaptcha.reset();

      }).catch(() => {
        this.props.addAlert(alertMessages.ALERT_SERVER_ERROR, alertMessages.ERROR);
      });
    })    
  }


  setSubjects(val){
    this.props.change('subject', val);
  }


  render() {
    const { 
      submitFailed,
      invalid,
      handleSubmit, 
      submitting 
    } = this.props;

    return (
      <div className="new-form__container feedback-form box-form light-background">
        <form onSubmit={handleSubmit(this.onSubmit)} className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
              <h1>Fale connosco</h1>
            </div>
          </div>

          {/* SUBJECTS */}
          <div className="row">
            {/* SUBJECTS */}
            <div className="col-xs-12">
              <label className="input-title required">Assunto</label>
              <Field
                handleOnChange={this.setSubjects}
                name="subject"
                list={this.subjects}
                valueKey="title"
                formGroupClassName="form-group"
                component={renderCheckboxGroup}/>
            </div>
          </div>

          {/* MESSAGE */}
          <div className="row">
            <div className="col-xs-12">
              <label className="input-title required">Mensagem</label>
              <small>Por favor incluir ligações externas (links) sempre que seja adequado</small>
              <Field
                formGroupClassName="form-group"
                className="form-control"
                placeholder="Mensagem que nos pretende transmitir"
                component={renderTextArea} 
                name="message"
                maxLength={1500}
                minLength={1}/>          
            </div>
          </div>

          {/* NAME */}
          <div className="row">
            <div className="col-xs-12">
              <label className="input-title required">Nome</label>
              <Field
                controlType="input"
                type="text"
                className="form-control"
                formGroupClassName="form-group"
                placeholder="O seu nome"
                component={renderFormControl} 
                name="name"/>
              </div>
          </div>

          {/* EMAIL */}
          <div className="row">
            <div className="col-xs-12">
              <label className="input-title">Email</label>
              <small>Deixe o seu endereço de correio eletrónico se pretender que o contactemos</small>
              <Field
                controlType="input"
                type="email"
                className="form-control"
                formGroupClassName="form-group"
                placeholder="O seu e-mail"
                component={renderFormControl} 
                name="email"/>
            </div>
          </div>

          {/* Acceptance */}
          <div className="row">
            <div className="col-xs-12">
              <Field
                controlType="input"
                type="checkbox"
                className="form-control"
                formGroupClassName="form-group "
                component={renderFormControl} 
                name="acceptance"
                childPos="middle"
                id="acceptance">

                <label htmlFor="acceptance" className="input-acceptance">
                  <div className="required">
                    Compreendo e aceito como os meus dados serão <Link to="/politica-privacidade" target="_blank">recolhidos, armazenados e tratados.</Link>
                  </div>                  
                </label>
              </Field>
            </div>
          </div>
          
          <div className="row">
            <div className="col-xs-12">
              <Field
                name="recaptcha"
                component={renderRecaptcha}
                sitekey={appConfig.recaptcha.sitekey}
                verifyRecaptcha={this.verifyRecaptcha} />
            </div>            
          </div>
          
          <div className="row">
            <div className="col-xs-12">
              <p><small><span className="text-danger">*</span> Campo obrigatório</small></p>
              {submitFailed && invalid && 
                  <div className="alert alert-danger" role="alert">
                    <p>Existem alguns problemas nos dados fornecidos. Reveja o formulário e os respetivos erros.</p>
                  </div>
              }
              <button type="submit" disabled={ submitting } className="cta primary">
                {submitting ? <i className='fa fa-spinner fa-spin'></i> : <i className='fa fa-spinner fa-send'></i>}Enviar
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

FeedbackForm.propTypes = {
  fields: PropTypes.array.isRequired,
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}