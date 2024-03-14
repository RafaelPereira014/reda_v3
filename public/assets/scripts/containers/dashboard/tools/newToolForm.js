'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { fetchConfig } from '#/actions/config';
import { fetchRecTerms, resetRecTerms } from '#/actions/recterms';
import { fetchTaxonomies, resetTaxonomies } from '#/actions/taxonomies';
import { fetchTool, resetTool, submitTool } from '#/actions/tools';
import { addAlert } from '#/actions/alerts';
import { bindActionCreators } from 'redux';
import { reset, initialize, destroy } from 'redux-form';

// Alerts
import * as alertMessages from '#/actions/message-types';

// Components
import FormBody from '#/components/tools/newTool/newToolForm';

class NewToolFormContainer extends Component {
  _isMounted = false;
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

  async componentDidMount(){
    this._isMounted = true;

    const { tool } = this.props.match.params;

    try{
      await this.props.fetchConfig()
    }catch(err){
      this.props.addAlert(err.message, alertMessages.ERROR);
    }


    //
    //  If to edit, get link
    //
    if (tool && this._isMounted){
      try{
        await this.props.fetchTool(tool);

        const { data } = this.props.tool;
        const { user } = this.props.auth.data;

        // If errors, go back
        if (this.props.tool.errorMessage|| (data.user_id!=user.id && user.role!='admin')){
          this.props.history.push('/painel/ferramentas');
        }else{          
          this.initForm();
        }
      }catch(err){
        this.props.addAlert(err.message, alertMessages.ERROR);
      }
      
    }
  }

  // On exit, reset states
  componentWillUnmount(){
    this.props.resetForm();
    this.props.destroy();
    this.props.resetTool();
  }

  //
  //  Script submition
  //
  handleSubmit(values){
    const { tool } = this.props.match.params;

    // MAKE SUBMITION
    return new Promise((resolve, reject) => {
      

      return this.props.submitTool(values, tool)
      .then(() => {
        const { errorMessage, errorStatus } = this.props.tool;


        // Dispatch errors to form if any
        if ((errorMessage || errorStatus) && errorMessage.form_errors){
          reject(errorMessage.form_errors);
          this.props.addAlert(alertMessages.ALERT_TOOL_ADD_ERROR, alertMessages.ERROR);

          // Else, resolve form
          // Add alert of success
          // Redirect to panel
        }else if (errorMessage || errorStatus){
          reject();
          this.props.addAlert(alertMessages.ALERT_SERVER_ERROR, alertMessages.ERROR);

        }else{          
          resolve();  
          this.props.addAlert(!tool ? alertMessages.ALERT_TOOL_CREATE_SUCCESS : alertMessages.ALERT_TOOL_EDIT_SUCCESS, alertMessages.SUCCESS);
          this.props.history.push('/painel/ferramentas'); 
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
    const { data } = this.props.tool;

    const fields = [ 
      'title',
      'description', 
      'link',
      'terms',
      'tags'
    ]

    let customTaxs = {
      tags: [],
      terms: []
    };

    data.Taxonomies.map( tax => {

      switch(tax.slug){
        case "tags_tools":
          customTaxs.tags = tax.Terms.map(item => item.title);
          break;
        default:
          tax.Terms.map(item => customTaxs.terms.push(item.id));
          break;
      }
    });

    let initValues = {
      title: data.title || null,
      description: data.description || null,
      terms: customTaxs.terms || [],
      link: data.link || null,
      tags:  customTaxs.tags || []
    }

    this.props.initForm(initValues, fields);          
  }

  render() {
    const { tool } = this.props;
    return (
      <div className="new-tool">
        <header className="new-form-header text-center">
          <h1>{tool && tool.data && tool.data.title ? tool.data.title : ("Nova Ferramenta")}</h1>
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

NewToolFormContainer.propTypes = {
}


function mapStateToProps(state) {
  return { 
    link: state.link,
    terms: state.terms,
    config: state.config,
    taxonomies: state.taxonomies,
    auth: state.auth,
    tool: state.tool
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchConfig,
    addAlert,
    fetchRecTerms,
    resetRecTerms,
    fetchTaxonomies,
    resetTaxonomies,
    fetchTool,
    resetTool,
    submitTool,
    resetForm: () => dispatch(reset('newLink')),
    destroy: () => dispatch(destroy('newLink')),
    initForm: (initValues, fields) => dispatch(initialize('newLink', initValues, fields))
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewToolFormContainer));