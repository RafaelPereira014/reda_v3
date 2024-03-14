'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import AppBreadcrumbs from '#/components/common/breadcrumbs';
import HelpIndex from '#/containers/help';
import BottomNav from '#/components/navigation/bottomNav';

// Actions
import { fetchConfig } from '#/actions/config';
import { fetchFromPlaylist } from '#/actions/videos';

// Utils
import { scrollToTop } from '#/utils';

export default class HelpPage extends Component {
  componentDidMount(){
    scrollToTop();
  }

  render() {
    let data = {
      title: "Ajuda - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location} match={this.props.match}/>
        <AppBreadcrumbs location={this.props.location} />
        <HelpIndex match={this.props.match} location={this.props.location} />
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}

HelpPage.needs = [
  fetchConfig,
  fetchFromPlaylist
]