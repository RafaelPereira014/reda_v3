'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import {Link} from 'react-router-dom';
import renderFormControl from '#/components/fields/genericField';
import { Field } from 'redux-form';

// Utils
import { removeClass, scrollToTop, isNode } from '#/utils';
import appConfig from '#/config';

export default class LoginForm extends Component {
  constructor(props){
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount(){
    this.props.resetErrors();
  }

  onSubmit(props){
    return new Promise((resolve, reject) => {
      this.props.loginUser(props)
      .then(() => {
        const { errors } = this.props.auth;

        if (!errors){
          // Remove popupboxes
          removeClass('open', Array.from(document.querySelectorAll(".open")));
          removeClass('filter-menu', Array.from(document.querySelectorAll(".filter-menu")));
          removeClass('admin-op-menu', Array.from(document.querySelectorAll(".admin-op-menu")));
          removeClass('site-menu', Array.from(document.querySelectorAll(".site-menu")));

          scrollToTop();

          let localReturnTo = (!isNode) ? localStorage.getItem('returnTo') : null;


          if (localReturnTo){
            
            this.props.history.push(localReturnTo);

          }else if (this.props.target){
            this.props.history.push(this.props.target);

          }else{
            this.props.history.push(appConfig.routes.adminRoute);
          }
        }

        resolve();

      }).catch(error => {
        reject(error);
      });
    })    
  }


  render() {
    const { handleSubmit } = this.props;
    const { fetching, errors } = this.props.auth;

    return (
      <div className="login-form">
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
          controlType="input"
          type="email"
          formGroupClassName="form-group"
          className="form-control" 
          placeholder="Email"
          component={renderFormControl} 
          name="email" />

          <Field
          controlType="input"
          type="password" 
          formGroupClassName="form-group"
          className="form-control" 
          placeholder="Palavra-passe"
          component={renderFormControl} 
          name="password" />

          {(() => {
            if (errors){
              return (<div className="form-group text-danger">{errors}</div>)
            }
          })()}         
          <div>
            <button type="submit" disabled={ fetching } className="cta primary">
              {fetching ? <i className='fa fa-spinner fa-spin'></i> : ""}Entrar
            </button>
            <Link to="/recuperarpalavrapasse" className="cta primary no-bg recover-password">Esqueceu-se da sua palavra-passe?</Link>
          </div>
        </form>
      </div>
    )
  }
}

LoginForm.propTypes = {
  fields: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}