'use strict';

import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router-dom';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import AppBreadcrumbs from '#/components/common/breadcrumbs';
import ResourceDetails from '#/containers/resources/details';
import BottomNav from '#/components/navigation/bottomNav';

// Actions
import { fetchResource, fetchRelatedResources, fetchGenericResource } from '#/actions/resources';
import { fetchScripts } from '#/actions/scripts';
import { fetchConfig } from '#/actions/config';
import { fetchComments } from '#/actions/comments';

// Utils
import { isNode } from '#/utils';

class ResourceDetailsPage extends Component {
  componentDidMount() {

  }

  render() {
    let data = {
      title: (this.props.genericResource.data ? this.props.genericResource.data.title : "Detalhes de Recurso") + " - REDA"
    }

    if (this.props.genericResource.data && this.props.genericResource.data.description){
      data.description = this.props.genericResource.data.description
    }

    let prevRoute = !isNode && localStorage.getItem('prevRoute');

    let prevTarget = prevRoute && (prevRoute.indexOf('recursos')>=0 || prevRoute.indexOf('propostas')>=0 || prevRoute.indexOf('comentarios/pendentes')) ? prevRoute : '/recursos';

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/> 
        <AppBreadcrumbs location={this.props.location}  />
        <div className="container back-button">
            <Link to={prevTarget} className="cta primary no-bg"><i className="fa fa-chevron-left"></i>Voltar aos resultados da pesquisa</Link>
        </div>          
        <ResourceDetails match={this.props.match} location={this.props.location}/>
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { 
    genericResource: state.genericResource
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchGenericResource
  }, dispatch);
}

ResourceDetailsPage.needs = [
    fetchConfig,
    fetchResource,
    fetchGenericResource,    
    fetchScripts,
    fetchComments,
    fetchRelatedResources
]


export default connect(mapStateToProps, mapDispatchToProps)(ResourceDetailsPage);