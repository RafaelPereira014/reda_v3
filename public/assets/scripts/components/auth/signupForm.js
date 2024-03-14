'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';
import {Link} from 'react-router-dom';

// Components
import renderFormControl from '#/components/fields/genericField';
import renderRadioGroupInput from '#/components/fields/radioGroupInput';

export default class SignupForm extends Component {
  constructor(props){
    super(props);

    //
    //  Event handlers
    //
    this.onSubmit = this.onSubmit.bind(this);
    this.setUserRole = this.setUserRole.bind(this);

  }

  componentDidMount() {
    this.props.fetchRolesGeneric();
  }

  onSubmit(props){
    return new Promise((resolve, reject) => {
      this.props.signupUser(props)
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

  setUserRole(item){
    const { id, type } = item;
    this.props.change('userType', {
      id,
      type,
      title: item.value
    });
  }

  render() {
    const { 
      asyncValidating, 
        userType,
      handleSubmit, 
      roles
    } = this.props;
    const { fetching, errors } = this.props.auth;


    return (
      <div className="signup-form box-form light-background">
        <form onSubmit={handleSubmit(this.onSubmit)} className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3 text-center">
              <h1>Efetue o seu registo</h1>
              <p>
                Para que tenha acesso a todos os recursos e funcionalidades disponíveis nesta plataforma, efetue o seu registo.
              </p>
            </div>
          </div>

          {/* EMAIL */}
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3">
              <label className="input-title required">E-Mail</label>
              <Field
                controlType="input"
                type="email"
                className="form-control" 
                formGroupClassName="form-group"
                placeholder="O seu e-mail"
                component={renderFormControl} 
                name="email"
                childPos="top">
                  {asyncValidating === 'email' && <i className='fa fa-spinner fa-spin'/>}
                </Field>
            </div>
          </div>

          {/* NAME */}
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3">
              <label className="input-title required">O seu nome</label>
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
          
          {/* PASSWORD */}
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3">
              <label className="input-title required">Palavra-Passe</label>
              <Field
                controlType="input"
                type="password"
                className="form-control" 
                formGroupClassName="form-group"
                placeholder="Palavra-passe"
                component={renderFormControl} 
                name="password"/>
            </div>
          </div>

          {/* USER ROLE */}
          {roles.data && roles.data.length>0 && <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3">
              <label className="input-title required">Eu sou</label>
              <Field
                formGroupClassName="form-group"
                component={renderRadioGroupInput} 
                name="userType"
                descKey={"value"}
                list={roles.data}
                handleChange={this.setUserRole}/>
            </div>
          </div>}  

          {/* ORGANIZATION */}
          {userType && (userType.type=='teacher' || userType.type=='editor') && <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3">
              <label className="input-title required">{userType.type=='teacher' ? "Escola" : "A sua organização"}</label>
              <Field
                controlType="input"
                type="text"
                className="form-control" 
                formGroupClassName="form-group"
                placeholder={userType.type=='teacher' ? "Escola" : "A sua organização"}
                component={renderFormControl} 
                name="organization"/>
            </div>
          </div>}     
          

          {/* KEY */}
          {/*userType && userType.type=='teacher' && <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3">
              <hr/>
              <p className="text-center">
                <small>Caso tenha um código de docente, por favor, insira-o. Se não o possuir, prossiga com o seu registo.</small>
              </p>

              <label className="input-title">Código de Docente</label>
              <Field
                controlType="input"
                type="text"
                className="form-control" 
                formGroupClassName="form-group"
                placeholder="Código de Docente"
                component={renderFormControl} 
                name="authKey"
                childPos="top">

                </Field>
            </div>
          </div>*/}

          {/* Acceptance */}
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3">
              <Field
                controlType="input"
                type="checkbox"
                className="form-control"
                formGroupClassName="form-group required"
                component={renderFormControl} 
                name="acceptance"
                childPos="middle"
                id="acceptance">

                <label htmlFor="acceptance" className="input-acceptance">
                  Compreendo e aceito como os meus dados serão <Link to="/politica-privacidade" target="_blank">recolhidos, armazenados e tratados.</Link>
                  </label>
              </Field>
            </div>
          </div>
          

          
          <div className="row">
            <div className="col-xs-12 col-sm-10 col-md-6 col-sm-offset-1 col-md-offset-3 ">
              <p><small><span className="text-danger">*</span> Campos obrigatórios</small></p>
              {errors && <div className="alert alert-danger" role="alert">
                    <span>{errors || ''}</span>
                  </div>
              }
              <button type="submit" disabled={ fetching } className="cta primary">
                {fetching ? <i className='fa fa-spinner fa-spin'></i> : ""}Registar
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

SignupForm.propTypes = {
  fields: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}