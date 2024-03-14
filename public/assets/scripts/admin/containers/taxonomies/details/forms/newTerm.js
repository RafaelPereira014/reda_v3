'use strict';

import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { reset, initialize, destroy } from 'redux-form';
import _ from 'lodash';

import { 
  fetchTaxonomy, 
  resetTaxonomy, 
} from '#/actions/taxonomies';

import { 
  resetAllTaxTerms, 
  fetchAllTaxTerms, 
  resetTaxTerm,
  submitTerm,
  fetchTaxTerms
} from '#/actions/taxterms';

import { fetchConfig } from '#/actions/config';

// Alerts
import * as alertMessages from '#/actions/message-types';
import { addAlert } from '#/actions/alerts';

// Components
import FormBody from '%/components/taxonomies/details/forms/newTerm';

class TermForm extends Component {
  _isMounted=false;
  constructor(props) {
    super(props)

    //
    //  Event handlers
    //
    this.onTermSubmit = this.onTermSubmit.bind(this);

    //
    //  Helpers
    //
    this.initForm = this.initForm.bind(this);
  }

  async componentDidMount(){

    this._isMounted = true;    
    this.initForm();

    if (this._isMounted && this.props.match.params.slug && !this.props.taxonomy.fetched && !this.props.taxonomy.fetching){
      await this.props.fetchTaxonomy(this.props.match.params.slug);       
    } 
    
  }

  // On exit, reset states
  componentWillUnmount(){
    
    this.props.resetForm();
    this.props.destroy();
    this._isMounted = false;
  }


  //
  //  INIT form after server fetch
  //
  initForm(){

    const fields = [ 
      'slug',
      'title',
      'parent',
      'color',
      'icon',
      'image',
    ]

    let initValues = {
      slug: null,
      title: '',
      parent: '',
      color: null,
      icon: null,
      image: null
    }

    this.props.initForm(initValues, fields);          
  }

  //
  //  Handle term creation
  //
  onTermSubmit(values) {
    const { slug } = this.props.match.params;
    const { taxonomy } = this.props;

    let data = _.cloneDeep(values);

    if(slug && taxonomy.data){
      data.tax = taxonomy.data.id;
    }

    // MAKE SUBMITION
    return new Promise(async (resolve, reject) => {
      try{
          // changed to id instead of slug
          await this.props.submitTerm(data, values.id);

          const { errorMessage, errorStatus } = this.props.taxTerm;

          // Dispatch errors to form if any
          if ((errorMessage || errorStatus) && errorMessage.form_errors){
              reject(errorMessage.form_errors);
              this.props.addAlert(alertMessages.ALERT_TERM_ADD_ERROR, alertMessages.ERROR);

          }else if (errorMessage || errorStatus){
              reject();
              this.props.addAlert(alertMessages.ALERT_SERVER_ERROR, alertMessages.ERROR);

          }else{       
              let message = !values.slug ? alertMessages.ALERT_TERM_CREATE_SUCCESS : alertMessages.ALERT_TERM_EDIT_SUCCESS

              resolve();  
              this.props.addAlert(message, alertMessages.SUCCESS);

              //
              //  RESET EVERYTHING AFTER SUCCESS
              //
              this.props.resetTaxTerm();              
              this.props.resetForm();
              this.props.selectedTermToEdit(null);

              //  Refresh terms list
              await this.props.fetchTaxTerms(slug);

              //  Refresh all terms list
              if(taxonomy.data && taxonomy.data.hierarchical){
                await this.props.fetchAllTaxTerms(slug);
              }
          }

      }catch(error){
          reject(error);
          this.props.addAlert(error, alertMessages.ERROR);
      }

    })
}

  render() {
    return (
        <FormBody {...this.props} onSubmit={this.onTermSubmit}/>
    )
  }
}


function mapStateToProps(state) {
  return { 
    auth: state.auth,
    config: state.config,
    taxonomy: state.taxonomy,
    allTaxTerms: state.allTaxTerms,
    taxTerm: state.taxTerm
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchTaxonomy,
    resetTaxonomy,
    fetchTaxTerms,
    resetAllTaxTerms, 
    fetchAllTaxTerms,
    submitTerm,
    resetTaxTerm,
    addAlert,
    fetchConfig,
    resetForm: () => dispatch(reset('newTermForm')),
    destroy: () => dispatch(destroy('newTermForm')),
    initForm: (initValues, fields) => dispatch(initialize('newTermForm', initValues, fields))
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TermForm));