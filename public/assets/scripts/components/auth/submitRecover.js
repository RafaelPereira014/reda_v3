'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Field } from 'redux-form';

// Components
import renderFormControl from '#/components/fields/genericField';

export default class SubmitRecoverForm extends Component {
  constructor(props){
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(props){
    return new Promise((resolve, reject) => {

      let allProps =  _.assign(props, {token: this.props.match.params.token});

      this.props.submitNewPassword(allProps)
      .then(() => {

        // Are there any errors?
        if (this.props.auth.errors){
          reject(this.props.auth.errors);
        }else{
          resolve();
      
          this.props.history.push("/");
        }

      }).catch(() => {
        /* console.log(error); */
      });
    })    
  }


  render() {
    const { 
      asyncValidating, 
      handleSubmit, 
    } = this.props;

    const { fetching, errors } = this.props.auth;

    return (
      <div className="recover-password-form box-form light-background">
        <form onSubmit={handleSubmit(this.onSubmit)} className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3 text-center">
              <h1>Definir uma nova palavra-passe</h1>
              <p>Insira a nova palavra-passe que lhe irá permitir entrar novamente na plataforma.</p>
            </div>
          </div>

          {/* PASSWORD */}
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3">
              <label className="input-title required">Nova palavra-passe</label>
              <Field
                controlType="input"
                type="password"
                className="form-control" 
                formGroupClassName="form-group"
                placeholder="Insira a palavra-passe nova"
                component={renderFormControl} 
                name="password"/>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3">
              <label className="input-title required">Confirmar palavra-passe</label>
              <Field
                controlType="input"
                type="password"
                className="form-control" 
                formGroupClassName="form-group"
                placeholder="Confirma a palavra-passe nova"
                component={renderFormControl} 
                name="confirmPassword"/>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3 ">
              <p><small><span className="text-danger">*</span> Campo obrigatório</small></p>
              {errors && <div className="alert alert-danger" role="alert">
                    <span>{errors || ''}</span>
                  </div>
              }
              <button type="submit" disabled={ fetching || asyncValidating } className="cta primary">
                {fetching ? <i className='fa fa-spinner fa-spin'></i> : ""}Definir palavra-passe
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

SubmitRecoverForm.propTypes = {
  fields: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}