'use strict';

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from "react-router-dom";
import { reset, initialize, destroy } from 'redux-form';

import { getNewsDetails, resetNews, submitNews } from '#/actions/news';
import { fetchConfig, resetConfig } from '#/actions/config';

// Alerts
import * as alertMessages from '#/actions/message-types';
import { addAlert } from '#/actions/alerts';

// Components

import GoBack from '#/components/common/goBack';

class NewNewsContainer extends Component {
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
    const { slug } = this.props.match.params;

    //
    //  If to edit, get tax
    //
    if (slug){
      this.props.getNewsDetails(slug, true).then(() => {

        // If the owner is not current user and current is not admin, go back
        if (
          this.props.newsDetail.errorMessage
        ) {
          this.props.history.push('/dashboard/artigos');
        } else {
          this.initForm();
        }
      });
    }
  }

  // Reset form on leave
  componentWillUnmount() {
    this.props.resetForm();
    this.props.destroy();
    this.props.resetNews();
  }

  //
  //  Submit form
  //
  handleSubmit(values) {
    const { slug } = this.props.match.params;

    // MAKE SUBMITION
    return new Promise((resolve, reject) => {
      return this.props
        .submitNews(values, slug)
        .then(() => {
          const { errorMessage, errorStatus } = this.props.newsDetail;

          // Dispatch errors to form if any
          if ((errorMessage || errorStatus) && errorMessage.form_errors) {
            reject(errorMessage.form_errors);
            this.props.addAlert(
              alertMessages.ALERT_NEWS_ADD_ERROR,
              alertMessages.ERROR
            );
          } else if (errorMessage || errorStatus) {
            reject();
            this.props.addAlert(
              alertMessages.ALERT_SERVER_ERROR,
              alertMessages.ERROR
            );
          } else {
            let message = !slug ? alertMessages.ALERT_NEWS_CREATE_SUCCESS : alertMessages.ALERT_NEWS_EDIT_SUCCESS;

            
            this.props.addAlert(message, alertMessages.SUCCESS);
            this.props.resetNews();
            resolve();
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
  initForm(){
    const { newsDetail } = this.props;

    const fields = [ 
        'title',
        'description',
        'thumbnail'
    ]

    let initValues = {
      title: newsDetail && newsDetail.data ? newsDetail.data.title : null,
      description: newsDetail && newsDetail.data ? newsDetail.data.description : null,
      thumbnail: newsDetail && newsDetail.data ? newsDetail.data.Thumbnail: null,
    }

    this.props.initForm(initValues, fields);          
  }

  render() {
    const { newsDetail } = this.props;
    return (
      <Fragment>
        <GoBack />
        <header className="margin__bottom--30">
          <h1>{newsDetail && newsDetail.data && newsDetail.data.title ? `A editar: ${newsDetail.data.title}` : ("Novo artigo")}</h1>
        </header>
        <section>

        </section>        
      </Fragment>
    )
  }
}


function mapStateToProps(state) {
  return { 
      newsDetail: state.newsDetail,
      config: state.config
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchConfig,
    resetConfig,
    getNewsDetails,
    resetNews,
    addAlert,
    submitNews,
    resetForm: () => dispatch(reset('newNews')),
    destroy: () => dispatch(destroy('newNews')),
    initForm: (initValues, fields) => dispatch(initialize('newNews', initValues, fields))
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewNewsContainer));