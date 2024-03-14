'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { fetchScript, resetScripts, deleteScript, submitSingleScript } from '#/actions/scripts';
import { fetchResource, resetResource } from '#/actions/resources';
import { fetchRecTerms, resetRecTerms } from '#/actions/recterms';
import { fetchTaxonomies, resetTaxonomies } from '#/actions/taxonomies';
import { fetchTerms } from '#/actions/terms';
import { addAlert } from '#/actions/alerts';
import { bindActionCreators } from 'redux';
import { reset, initialize, destroy } from 'redux-form';
// Loader
import Loader from '../../../utils/loader';

// Utils
import appConfig from '#/config';

// Alerts
import * as alertMessages from '#/actions/message-types';

import FormBody from '#/components/scripts/newSingleScriptForm';

class NewSingleScriptFormContainer extends Component {
  constructor(props) {
    super(props)

    //
    //  Event handlers
    //
    this.handleSubmit = this.handleSubmit.bind(this);

    //
    //  Helpers
    //
    this.initScripts = this.initScripts.bind(this);
    this.state = {
      isLoading: true
    }
  }

  componentDidMount(){
    const { resource, script } = this.props.match.params;
    const { fetchScript, fetchResource } = this.props;

    this.props.resetScripts();

    //
    //  If to edit, get resource
    //
    if (script){
      fetchScript(script)  
      .then(() => {
        const { scripts } = this.props;

        // If errors, go back
        if (scripts.errorMessage){
          this.props.history.push(appConfig.routes.adminRoute);
        }else{          
          this.initScripts();
        }
        this.setState({ isLoading: false });
      });
    }

    if (resource){
      fetchResource(this.props.match.params)
      .then(() => {
        this.setState({ isLoading: false });
      }
      )
    }
  }

  // On exit, reset states
  componentWillUnmount(){
    this.props.resetForm();
    this.props.destroy();
    this.props.resetResource();
    this.props.resetScripts();
  }

  //
  //  Script submition
  //
  handleSubmit(values){
    const { resource, script } = this.props.match.params;

    // MAKE SUBMITION
    return new Promise((resolve, reject) => {

      return this.props.submitSingleScript(values, resource, script)
      .then(() => {
        const { errorMessage, errorStatus } = this.props.scripts;


        // Dispatch errors to form if any
        if ((errorMessage || errorStatus) && errorMessage.form_errors){
          reject(errorMessage.form_errors);
          this.props.addAlert(alertMessages.ALERT_SCRIPT_MANAGE_ERROR, alertMessages.ERROR);

          // Else, resolve form
          // Add alert of success
          // Redirect to panel
        }else if (errorMessage || errorStatus){
          reject();
          this.props.addAlert(alertMessages.ALERT_SERVER_ERROR, alertMessages.ERROR);
        }else{          
          resolve();  
          this.props.addAlert(alertMessages.ALERT_SCRIPT_MANAGE_SUCCESS, alertMessages.SUCCESS);
          this.props.history.goBack(); 
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
  initScripts(){
    const { data } = this.props.scripts;
    let initValues = {};

    const fields = [ 
      'id',
      'title', 
      'email',
      'organization',
      'author',
      'description',
      'subjects',
      'macro',
      'domains',
      'years',
      'file',
      'op_proposal',
      'op_proposal_author',
      'terms',
      'targets'
    ]

    initValues = {
        id: data.id || null,
        title: data.title || null,
        email: data.email || null,
        organization: data.organization || null,
        author: data.author || null,
        description: data.description || null,
        subjects: [] /* data.Subjects.map(item => item.id) */,
        domains: [] /* data.Domains.map(item => item.id) */,
        years: [] /* data.Years.map(item => item.id) */,
        macro: [],
        file: data.Files && data.Files.length > 0 && data.Files[0],
        op_proposal: data.operation,
        op_proposal_author: data.operation_author,
        targets: []
    }

    this.props.initScripts(initValues, fields);
  }

  render() {


    return (
      <div className="new-script">
        <header className="new-form-header text-center">
          <h1>{this.props.scripts.data ? "Editar proposta de operacionalização" : "Nova proposta de operacionalização"}</h1>
          <span>{(this.props.resource.data && this.props.resource.data.title) || (this.props.scripts.data && this.props.scripts.data.Resource && this.props.scripts.data.Resource.title)} &gt; <strong>{this.props.scripts.data ? "Editar" : "Nova"} Proposta de Operacionalização</strong></span>
        </header>
        <div className="new-form__container">
          <section className="container">
            {this.state.isLoading ? <Loader /> : 
            <FormBody onSubmit={this.handleSubmit} mapProps={this.props}/>
            }
          </section>
        </div>        
      </div>
    )
  }
}

NewSingleScriptFormContainer.propTypes = {
}


function mapStateToProps(state) {
  return { 
    terms: state.terms, 
    scripts: state.scripts,
    auth: state.auth,
    resource: state.resource,
    taxonomies: state.taxonomies
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchResource,
    fetchRecTerms,
    resetRecTerms,
    fetchTaxonomies,
    resetTaxonomies,
    fetchTerms,
    fetchScript,
    resetResource,
    resetScripts,
    deleteScript,
    submitSingleScript,
    addAlert,
    resetForm: () => dispatch(reset('newSingleScript')),
    destroy: () => dispatch(destroy('newSingleScript')),
    initScripts: (initValues, fields) => dispatch(initialize('newSingleScript', initValues, fields))
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewSingleScriptFormContainer));