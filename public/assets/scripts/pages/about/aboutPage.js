'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import AboutIndex from '#/containers/about';
import BottomNav from '#/components/navigation/bottomNav';

// Actions
import { fetchConfig } from '#/actions/config';
import { fetchRecTerms } from '#/actions/recterms';
import { fetchTaxonomies } from '#/actions/taxonomies';

// Utils
import { scrollToTop } from '#/utils';

export default class AboutPage extends Component {
  componentDidMount() {
    scrollToTop();
  }

  render() {
    let data = {
      title: "Sobre - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location} match={this.props.match}/>
        <AboutIndex />
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}

AboutPage.needs = [
  fetchConfig,
  fetchRecTerms,
  fetchTaxonomies
]