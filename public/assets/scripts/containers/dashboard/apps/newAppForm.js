'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { fetchConfig } from '#/actions/config';
import { fetchApp, resetApp, submitApp } from '#/actions/apps';
import { fetchRecTerms, resetRecTerms } from '#/actions/recterms';
import { fetchTaxonomies, resetTaxonomies } from '#/actions/taxonomies';
import { addAlert } from '#/actions/alerts';
import { bindActionCreators } from 'redux';
import { reset, initialize, destroy } from 'redux-form';

// Alerts
import * as alertMessages from '#/actions/message-types';

// Components
import FormBody from '#/components/apps/newApp/newAppForm';

class NewAppFormContainer extends Component {
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
    const { app } = this.props.match.params;


    this.props.fetchConfig()
    .catch(err => {
      this.props.addAlert(err, alertMessages.ERROR);
    })

    //
    //  If to edit, get app
    //
    if (app){
      this.props.fetchApp(this.props.match.params)
      .then(() => {
        const { data } = this.props.app;
        const { user } = this.props.auth.data;
        

        // If errors, go back
        if (this.props.app.errorMessage || (data.user_id!=user.id && user.role!='admin')){
          this.props.history.push('/painel/aplicacoes');
        }else{          
          this.initForm();
        }
      });
    }
  }

  // On exit, reset states
  componentWillUnmount(){
    this.props.resetForm();
    this.props.destroy();
    this.props.resetApp();
  }

  //
  //  Script submition
  //
  handleSubmit(values){
    const { app } = this.props.match.params;

    // MAKE SUBMITION
    return new Promise((resolve, reject) => {

      return this.props.submitApp(values, app)
      .then(() => {
        
        const { errorMessage, errorStatus } = this.props.app;


        // Dispatch errors to form if any
        if ((errorMessage || errorStatus) && errorMessage.form_errors){
          reject(errorMessage.form_errors);
          this.props.addAlert(alertMessages.ALERT_APP_MANAGE_ERROR, alertMessages.ERROR);

          // Else, resolve form
          // Add alert of success
          // Redirect to panel
        }else if (errorMessage || errorStatus){
          reject();
          this.props.addAlert(alertMessages.ALERT_SERVER_ERROR, alertMessages.ERROR);
        }else{          
          resolve();  
          this.props.addAlert(alertMessages.ALERT_APP_MANAGE_SUCCESS, alertMessages.SUCCESS);
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
  initForm(){
    const { data } = this.props.app;
    const { taxonomies } = this.props;
    let systemsTax = null;


    const fields = [ 
      'title',
      'description', 
      'links[].id',
      'links[].title',
      'links[].link',
      'image',
      'terms',
      'tags',
      'taxs'
    ]

    let taxsObjs = {};

    taxonomies.data && taxonomies.data.map(tax => {
      if(tax.slug == 'sistemas_apps'){
        systemsTax = tax.Terms;
      }

      taxsObjs[tax.slug] = [];
    })

    let customTaxs = {
      systems: [],
      tags: [],
      terms: []
    };

    data.Taxonomies.map( tax => {
      taxsObjs[tax.slug] = tax.Terms.map(item => item.id);

      switch(tax.slug){
        case "sistemas_apps":
          customTaxs.systems = tax.Terms;
          break;
        case "tags_apps":
          customTaxs.tags = tax.Terms.map(item => item.title);
          taxsObjs[tax.slug] = customTaxs.tags;
          break;
        default:
          tax.Terms.map(item => customTaxs.terms.push(item.id));
          break;
      }
    });

    customTaxs.systems.map(sys => customTaxs.terms.push(sys.id));

    let initValues = {
      title: data.title || null,
      description: data.description || null,
      image: data.Thumbnail || null,
      tags: customTaxs.tags || [],
      terms: customTaxs.terms || [],
      links: [],
      taxs: taxsObjs
    }

    // Create all links objects
    for(let sys of systemsTax){
      initValues.links.push({
        id:sys.id, 
        title:sys.title, 
        link: ''
      })
    }


    // Give the link string to the ones that are active
    for(let item of initValues.links){
      customTaxs.systems.map(system => {
        if (item.id==system.id){
          item.link = system.metadata
        }
      })
    }

    this.props.initForm(initValues, fields);          
  }

  render() {
    const { app } = this.props;
    return (
      <div className="new-app">
        <header className="new-form-header text-center">
          <h1>{app && app.data && app.data.title ? app.data.title : "Nova Aplicação"}</h1>
          <span><strong>Detalhes</strong></span>
        </header>
        <div className="new-form__container">
          <section className="container">
            <FormBody onSubmit={this.handleSubmit} mapProps={this.props}/>
          </section>
        </div>        
      </div>
    )
  }
}

NewAppFormContainer.propTypes = {
}


function mapStateToProps(state) {
  return { 
    app: state.app,
    taxonomies: state.taxonomies,
    config: state.config,
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchConfig,
    fetchApp,
    resetApp,
    submitApp,
    addAlert,
    fetchRecTerms,
    resetRecTerms,
    fetchTaxonomies,
    resetTaxonomies,
    resetForm: () => dispatch(reset('newApp')),
    destroy: () => dispatch(destroy('newApp')),
    initForm: (initValues, fields) => dispatch(initialize('newApp', initValues, fields))
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewAppFormContainer));