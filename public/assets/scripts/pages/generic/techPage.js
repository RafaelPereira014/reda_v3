'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import TechPage from '#/containers/generic/techPage';
import BottomNav from '#/components/navigation/bottomNav';

// Actions
import { fetchConfig } from '#/actions/config';

// Utils
import { scrollToTop } from '#/utils';

export default class TechPageContainer extends Component {
  componentDidMount() {
    scrollToTop();
  }
  
  render() {
    let data = {
      title: "Ficha técnica - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location} match={this.props.match}/>
        <TechPage />
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}

TechPageContainer.needs = [
  fetchConfig
]