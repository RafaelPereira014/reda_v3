'use strict';

import React from 'react';
import { Component } from 'react';


// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import ToolsIndex from '#/containers/tools';
import AppBreadcrumbs from '#/components/common/breadcrumbs';
import BottomNav from '#/components/navigation/bottomNav';

// Actions
import { fetchConfig } from '#/actions/config';

export default class ToolsPage extends Component {
  render() {
    let data = {
      title: "Ferramentas - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location} match={this.props.match}/>
        <AppBreadcrumbs location={this.props.location} />
        <ToolsIndex match={this.props.match} location={this.props.location}/>
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}

ToolsPage.needs = [
  /* searchHints, */
  fetchConfig
]