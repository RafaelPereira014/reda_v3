'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addAlert } from '#/actions/alerts';
import { fetchUserData, updateUser } from '#/actions/user';
import { bindActionCreators } from 'redux';
import { reset, initialize, destroy } from 'redux-form';

// Alerts
import * as alertMessages from '#/actions/message-types';

// Components
import FormBody from '#/components/user/profile';

// Utils
import { isNode } from '#/utils';

class UserInfoUpdateForm extends Component {
  constructor(props) {
    super(props)

    //
    //  Event handlers
    //
    this.handleSubmit = this.handleSubmit.bind(this);

    //
    //  Helpers
    //
    this.initForm = this.initForm.bind(this);
  }

  componentDidMount(){
    const { auth } = this.props;

    //
    //  If to edit, get user
    //
    if (auth){
      this.initForm();
    }
  }

  // On exit, reset states
  componentWillUnmount(){
    this.props.resetForm();
    this.props.destroy();
  }

  //
  //  Script submition
  //
  handleSubmit(values){    

    // MAKE SUBMITION
    return new Promise((resolve, reject) => {

      const { auth } = this.props;
      // Update user
      return this.props.updateUser(values, auth.data.user.id)
      .then(() => {

        const { errorMessage, errorStatus, errors } = this.props.auth;

        // Dispatch errors to form if any
        if (errorMessage && errorMessage.form_errors){
          reject(errorMessage.form_errors);
          this.props.addAlert(alertMessages.ALERT_USER_EDIT_ERROR, alertMessages.ERROR);

          // Else, resolve form
          // Add alert of success
        }else if (errorMessage || errorStatus || errors){
          reject();
          this.props.addAlert(alertMessages.ALERT_SERVER_ERROR, alertMessages.ERROR);
        }else{  
          resolve();            
          this.props.addAlert(alertMessages.ALERT_USER_EDIT_SUCCESS, alertMessages.SUCCESS);
          this.initForm();

          // If login was successful, set the token in local storage          
          !isNode && localStorage.setItem('user', JSON.stringify(this.props.auth.data.user));
        }      
      })
      .catch(error => {
        reject(error);
        this.props.addAlert(error, alertMessages.ERROR);
      })
    })
  }

  //
  //  INIT form after server fetch
  //
  initForm(){
    const { user } = this.props.auth.data;

    const fields = [ 
      'hidden',
      'password',
      'confirmPassword',
      'organization',
      'name'
    ]

    let initValues = {}

    if (user){
      initValues = {
        hidden: user.hidden || null,
        organization: user.organization,
        name: user.name,
        password: null,
        confirmPassword: null
      }
    }

    this.props.initForm(initValues, fields);          
  }

  render() {
    return (
      <div className="light__page">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
               <FormBody onSubmit={this.handleSubmit} mapProps={this.props}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

UserInfoUpdateForm.propTypes = {
}


function mapStateToProps(state) {
  return { 
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    addAlert,
    fetchUserData,
    updateUser,
    resetForm: () => dispatch(reset('updateUser')),
    destroy: () => dispatch(destroy('updateUser')),
    initForm: (initValues, fields) => dispatch(initialize('updateUser', initValues, fields))
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoUpdateForm);