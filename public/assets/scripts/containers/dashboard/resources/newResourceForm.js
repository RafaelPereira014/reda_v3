'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Alerts
import * as alertMessages from '#/actions/message-types';

// Utils
import appConfig from '#/config';
import { stripAllTags } from '#/utils';

// Components
import {
  fetchResource,
  submitResource,
  resetResource,
  resetResourceErrors
} from '#/actions/resources';
import { fetchRecTerms, resetRecTerms } from '#/actions/recterms';
import { fetchTaxonomies, resetTaxonomies } from '#/actions/taxonomies';
import { fetchConfig, resetConfig } from '#/actions/config';
import { fetchTerms } from '#/actions/terms';
import { addAlert } from '#/actions/alerts';
import { bindActionCreators } from 'redux';
import { reset, initialize, destroy } from 'redux-form';

import WizardFormFirstPage from '#/components/resources/newResource/newResourceFormFirstPage';
import WizardFormSecondPage from '#/components/resources/newResource/newResourceFormSecondPage';
import Loader from '../../../utils/loader';

class NewResourceFormContainer extends Component {
  constructor(props) {
    super(props);

    //
    //  Event handlers
    //
    this.handleSubmit = this.handleSubmit.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);

    //
    //  Helpers
    //
    this.initForm = this.initForm.bind(this);

    //
    // Set state
    //
    this.state = {
      page: 1,
      isLoading: true
    };
  }

  componentDidMount() {
    const { resource } = this.props.match.params;
    this.props.resetResourceErrors();

    //
    //  If to edit, get resource
    //
    if (resource) {
      this.props.fetchResource(this.props.match.params).then(() => {
        const { data } = this.props.resource;
        const { user } = this.props.auth.data;

        // set loading to false
        this.setState({ isLoading: false });
        // If the owner is current user and is not colaborator OR is colaborator AND
        // no error messages 
        if((data.user_id == user.id || appConfig.colab.indexOf(user.role)>=0) && !this.props.resource.errorMessage){
          this.initForm();
        }else{
          this.props.history.push(appConfig.routes.adminRoute);
        }
      });
    }else{
      this.setState({ isLoading: false });
    }
  }

  // Reset form on leave
  componentWillUnmount() {
    this.props.resetForm();
    this.props.destroy();
    this.props.resetResource();
    this.props.resetTaxonomies();
  }

  // Set next page
  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  // Set previous page
  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  // Print breadcrumbs
  printFormBreadcrumbs() {
    if (this.state.page == 1) {
      return (
        <span>
          <strong>Detalhes</strong> &gt; Metadados
        </span>
      );
    } else if (this.state.page == 2) {
      return (
        <span>
          Detalhes &gt; <strong>Metadados</strong>
        </span>
      );
    }
  }

  //
  //  Submit form
  //
  handleSubmit(values) {
    const { resource } = this.props.match.params;
    const { auth } = this.props;

    // MAKE SUBMITION
    return new Promise((resolve, reject) => {
      return this.props
        .submitResource(values, resource)
        .then(() => {
          const { errorMessage, errorStatus } = this.props.resource;

          // Dispatch errors to form if any
          if ((errorMessage || errorStatus) && errorMessage.form_errors) {
            reject(errorMessage.form_errors);
            this.props.addAlert(
              alertMessages.ALERT_RESOURCE_ADD_ERROR,
              alertMessages.ERROR
            );
          } else if (errorMessage || errorStatus) {
            reject();
            this.props.addAlert(
              alertMessages.ALERT_SERVER_ERROR,
              alertMessages.ERROR
            );
          } else {
            let message = !resource
              ? auth.data.user.role == 'admin'
                ? alertMessages.ALERT_RESOURCE_CREATE_SUCCESS
                : alertMessages.ALERT_RESOURCE_CREATE_NONADMIN_SUCCESS
              : auth.data.user.role == 'admin'
              ? alertMessages.ALERT_RESOURCE_EDIT_SUCCESS
              : alertMessages.ALERT_RESOURCE_EDIT_NONADMIN_SUCCESS;

            resolve();
            this.props.addAlert(message, alertMessages.SUCCESS);
            this.props.resetResource();
            this.props.history.goBack();
          }
        })
        .catch(error => {
          reject(error);
          this.props.addAlert(error, alertMessages.ERROR);
        });
    });
  }

  //
  //  INIT form after server fetch
  //
  initForm() {
    const { data } = this.props.resource;
    console.log(data)

    const fields = [
      'title',
      'author',
      'email',
      'organization',
      'tags',
      'format',
      'file',
      'thumbnail',
      'duration',
      'embed',
      'link',
      'access',
      'techResources',
      'otherTechResources',
      'description',
      'exclusive',
      'isOnline',
      'isFile',
     // 'macro',
      'subjects',
      'domains',
      'subdominios',
      'hashtags',
      'years',
      'language',
      'op_proposal',
      'op_proposal_author',
      'hasDomains',
      'terms',
      'targets'
    ];

    let customTaxs = {};

    data.Taxonomies.map(tax => {
      switch (tax.slug) {
        case 'tags_resources':
          customTaxs.tags = tax.Terms.map(item => item.title);
          break;
        case 'anos_resources':
          customTaxs.years = tax.Terms.map(item => item.id);
          break;
        case 'areas_resources':
          customTaxs.subjects = tax.Terms.map(item => item.id);
          break;
        case 'dominios_resources':
          customTaxs.domains = tax.Terms.map(item => item.id);
          break;
          case 'subdominios':
            customTaxs.subdominios = tax.Terms.map(item => item.id);
            break;
            case 'hashtags':
              customTaxs.hashtags = tax.Terms.map(item => item.id);
              break;
        case 'lang_resources':
          customTaxs.language = tax.Terms.length > 0 ? tax.Terms[0] : null;
          break;
        case 'modos_resources':
          customTaxs.access = tax.Terms.map(item => item.id);
          break;
       /* case 'macro_areas_resources':
          customTaxs.macro = tax.Terms.map(item => item.id);
          break;*/
        case 'target_resources':
          customTaxs.targets = tax.Terms.map(item => item.id);
          break;
        case "tec_requirements_resources":
          customTaxs.techResources = tax.Terms.map(item => item.id);
          break;
        case "formato_resources":
          customTaxs.format = tax.Terms.map(item => item.id);
          break;
      }
    });

    let initValues = {
      title: data.title,
      author: data.author,
      email: data.email,
      organization: data.organization,
      tags: customTaxs.tags || [],
      //changed to contain various formats
      format: customTaxs.format || null,
      file: data.Files && data.Files.length > 0 && data.Files[0],
      thumbnail: data.Thumbnail,
      duration: data.duration,
      embed: data.embed,
      link: data.link,
      access: customTaxs.access || [],
      techResources: customTaxs.techResources || null,
      //otherTechResources: data.techResources ? stripAllTags(data.techResources) : null, // strip tags to avoid comming elements from tinymce
      // leave as is to avoid stripping tags
      otherTechResources: data.techResources ? data.techResources : null,
      description: data.description,
      exclusive: data.exclusive,
      isOnline: data.link || data.embed ? true : false,
      isFile: data.Files && data.Files.length > 0,
      subjects: customTaxs.subjects || [],
      domains: customTaxs.domains || [],
      years: customTaxs.years || [],
      subdominios: customTaxs.subdominios || [],
      hashtags: customTaxs.hashtags || [],
      language: customTaxs.language || null,
      op_proposal: data.Scripts.length > 0 ? data.Scripts[0].operation : null,
      script_id: data.Scripts.length > 0 ? data.Scripts[0].id : null,
      op_proposal_author: data.operation_author,
      targets: customTaxs.targets || [],
      terms: (customTaxs.years || [])
        .concat(customTaxs.subjects || [])
        .concat(customTaxs.domains || [])
        .concat(customTaxs.subdominios || [])
        .concat(customTaxs.hashtags || []),
      script_file:
        data.Scripts.length > 0 && data.Scripts[0].Files.length > 0
          ? data.Scripts[0].Files[0]
          : null
    };

    this.props.initForm(initValues, fields);
  }

  

  render() {
    const { page } = this.state;
    const { resource } = this.props;

    return (
      <div className="new-resource">
        <header className="new-form-header text-center">
          <h1>
            {resource && resource.data && resource.data.title
              ? <p dangerouslySetInnerHTML={{__html: resource.data.title}}></p>
              : 'Novo Recurso'}
          </h1>
          {this.printFormBreadcrumbs()}
        </header>
        <div className="new-form__container">
          <section className="container">
          {this.state.isLoading && (
          <Loader title="Carregando por favor aguarde..." />
            )}
            {page === 1 && (
              <WizardFormFirstPage
                onSubmit={this.nextPage}
                mapProps={this.props}
              />
            )}
            {page === 2 && (
              <WizardFormSecondPage
                previousPage={this.previousPage}
                onSubmit={this.handleSubmit}
                mapProps={this.props}
                submitionErr={this.props.resource.errorMessage}
              />
            )}
          </section>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    taxonomies: state.taxonomies,
    terms: state.terms,
    resource: state.resource,
    auth: state.auth,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchResource,
      fetchRecTerms,
      resetRecTerms,
      fetchTaxonomies,
      resetTaxonomies,
      fetchConfig,
      resetConfig,
      fetchTerms,
      submitResource,
      resetResource,
      resetResourceErrors,
      addAlert,
      resetForm: () => dispatch(reset('newResource')),
      destroy: () => dispatch(destroy('newResource')),
      initForm: (initValues, fields) =>
        dispatch(initialize('newResource', initValues, fields))
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NewResourceFormContainer));
