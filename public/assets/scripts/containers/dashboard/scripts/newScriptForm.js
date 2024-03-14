'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { fetchUserScripts, resetScripts, deleteScript, submitScripts } from '#/actions/scripts';
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

import FormBody from '#/components/scripts/newScriptForm';

class NewScriptFormContainer extends Component {
  constructor(props) {
    super(props)

    //
    //  Event handlers
    //
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getNewScripts = this.getNewScripts.bind(this);

    //
    //  Helpers
    //
    this.initScripts = this.initScripts.bind(this);

    this.state = {
      isLoading: true
    }
  }

  componentDidMount(){
    const { resource } = this.props.match.params;
    const { fetchUserScripts } = this.props;

    //
    //  If to edit, get resource
    //
    if (resource){
      this.props.fetchResource(this.props.match.params, true)
      .then(() => {
        return fetchUserScripts(this.props.resource.data.id)
      })    
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
    }else{
      this.setState({ isLoading: false });
    }
  }

  // On exit, reset states
  componentWillUnmount(){
    this.props.resetForm();
    this.props.destroy();
    this.props.resetScripts();
    this.props.resetResource();
  }

  //
  //  Script submition
  //
  handleSubmit(values){
    const { resource } = this.props;

    // MAKE SUBMITION
    return new Promise((resolve, reject) => {

      return this.props.submitScripts(values, resource.data.id)
      .then(() => {
        const { errorMessage, errorStatus } = this.props.scripts;


        // Dispatch errors to form if any
        if ((errorMessage || errorStatus) && errorMessage.form_errors){
          reject(errorMessage.form_errors);
          this.props.addAlert(alertMessages.ALERT_SCRIPT_MANAGE_ERROR, alertMessages.ERROR);

        }else if (errorMessage || errorStatus){
          reject();
          this.props.addAlert(alertMessages.ALERT_SERVER_ERROR, alertMessages.ERROR);
        }else{          
          // Else, resolve form
          // Add alert of success
          // Redirect to panel
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
  //  Refresh scripts
  //
  getNewScripts(){
    const { fetchUserScripts, resource } = this.props;

    // Refresh only if there was any data before
    resource.data && fetchUserScripts(resource.data.id)
  }

  //
  //  INIT form after server fetch
  //
  initScripts(){
    const { data } = this.props.scripts;

    let initValues = { scripts:[] };

    const fields = [ 
      'scripts[].id',
      'scripts[].title', 
      'scripts[].email',
      'scripts[].organization',
      'scripts[].author',
      'scripts[].description',
      'scripts[].macro',
      'scripts[].subjects',
      'scripts[].domains',
      'scripts[].years',
      'scripts[].subdominios',
      'scripts[].hashtags',
      'scripts[].terms',
      'scripts[].file',
      'scripts[].tags',
      'scripts[].op_proposal',
      'scripts[].op_proposal_author',
      'scripts[].targets',
    ]

    if (data && data.length>0){
      for(let script of data){
        let customTaxs = {};
        script.Taxonomies.map( tax => {
          switch(tax.slug){
            case "anos_resources":
              customTaxs.years = tax.Terms.map(item => item.id);
              break;
            case "macro_areas_resources":
              customTaxs.macro = tax.Terms.map(item => item.id);
              break;
            case "areas_resources":
              customTaxs.subjects = tax.Terms.map(item => item.id);
              break;
            case "dominios_resources":
              customTaxs.domains = tax.Terms.map(item => item.id);
              break;
            case "subdominios":
              customTaxs.subdominios = tax.Terms.map(item => item.id);
              break;
            case "hashtags":
              customTaxs.hashtags = tax.Terms.map(item => item.id);
              break;
            case "tags_resources":
              customTaxs.tags = tax.Terms.map(item => item.title);
              break;
            case "target_resources":
              customTaxs.targets = tax.Terms.map(item => item.id);
              break;
          }
        });

        initValues.scripts.push({
          id: script.id || null,
          title: script.title,
          email: script.email,
          organization: script.organization,
          author: script.author,
          description: script.description,
          macro: customTaxs.macro || [],
          subjects: customTaxs.subjects || [],
          domains: customTaxs.domains || [],
          years: customTaxs.years || [],
          subdominios: customTaxs.subdominios || [],
          hashtags: customTaxs.hashtags || [],
          file: script.Files && script.Files.length > 0 && script.Files[0],
          op_proposal: script.operation,
          op_proposal_author: script.operation_author,
          terms: (customTaxs.years || []).concat(customTaxs.subjects || []).concat(customTaxs.domains || []).concat(customTaxs.macro || []).concat(customTaxs.subdominios || []).concat(customTaxs.hashtags || []),
          tags: customTaxs.tags || [],
          targets: customTaxs.targets || [],
        })
      }
      this.props.initScripts(initValues, fields);      
    }    
  }

  render() {
    return (
      <div className="new-script">
        <header className="new-form-header text-center">
          <h1>Gerir propostas de operacionalização</h1>
          {this.props.resource.data && this.props.resource.data.title &&
           <span dangerouslySetInnerHTML={{__html: this.props.resource.data.title+' &gt; <strong>Propostas de operacionalização</strong>'}}></span>
          }
        </header>
        <div className="new-form__container">
          <section className="container">
          { this.state.isLoading ? <Loader /> :
            <FormBody onSubmit={this.handleSubmit} mapProps={this.props} refreshScripts={this.getNewScripts}/>
          }    
          </section>
        </div>    
      </div>
    )
  }
}

NewScriptFormContainer.propTypes = {
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
    fetchRecTerms,
    resetRecTerms,
    fetchTaxonomies,
    resetTaxonomies,
    fetchResource,
    fetchTerms,
    fetchUserScripts,
    resetResource,
    resetScripts,
    deleteScript,
    submitScripts,
    addAlert,
    resetForm: () => dispatch(reset('newScript')),
    destroy: () => dispatch(destroy('newScript')),
    initScripts: (initValues, fields) => dispatch(initialize('newScript', initValues, fields))
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewScriptFormContainer));