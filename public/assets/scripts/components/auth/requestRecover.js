'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import renderFormControl from '#/components/fields/genericField';
import { Field } from 'redux-form'


export default class RequestRecoverForm extends Component {
  constructor(props){
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(props){
    return new Promise((resolve, reject) => {
      this.props.submitRequestRecover(props)
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
      handleSubmit
    } = this.props;
    const { fetching, errors } = this.props.auth;

    return (
      <div className="recover-password-form box-form light-background">
        <form onSubmit={handleSubmit(this.onSubmit)} className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3 text-center">
              <h1>Recuperar palavra-passe</h1>
              <p>
                Caso tenha esquecido a sua palavra-passe de acesso, faça o pedido de renovação através do formulário que se apresenta. Será enviado um e-mail com o endereço para efetuar a alteração com uma nova palavra-passe.
              </p>
            </div>
          </div>

          {/* EMAIL */}
          <div className="row">
            <Field
            controlType="input"
            type="email"
            formGroupClassName="form-group col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3"
            className="form-control input-title required" 
            placeholder="Email"
            component={renderFormControl} 
            name="email"
            id="email" />
          </div>
          
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3 ">
              <p><small><span className="text-danger">*</span> Campo obrigatório</small></p>
              {errors && <div className="alert alert-danger" role="alert">
                    <span>{errors || ''}</span>
                  </div>
              }
              <button type="submit" disabled={ fetching || asyncValidating } className="cta primary">
                {fetching ? <i className='fa fa-spinner fa-spin'></i> : ""}Recuperar palavra-passe
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

RequestRecoverForm.propTypes = {
  fields: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}