'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import AppsIndex from '#/containers/apps';
import AppBreadcrumbs from '#/components/common/breadcrumbs';
import BottomNav from '#/components/navigation/bottomNav';

// Actions
import { fetchConfig } from '#/actions/config';
import { searchApps } from '#/actions/apps';
import { fetchRecTerms, resetRecTerms } from '#/actions/recterms';
import { fetchTaxonomies, resetTaxonomies } from '#/actions/taxonomies';

export default class AppsPage extends Component {
  render() {
    let data = {
      title: "Aplicações - REDA"
    }


    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <AppBreadcrumbs location={this.props.location} />
        <AppsIndex location={this.props.location}/>
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}

AppsPage.needs = [
    fetchConfig,
    searchApps,
    fetchRecTerms,
    resetRecTerms,
    fetchTaxonomies,
    resetTaxonomies
]