'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import PrivacyPolicy from '#/containers/generic/privacyPolicy';
import BottomNav from '#/components/navigation/bottomNav';

// Utils
import { scrollToTop } from '#/utils';

export default class NewResourcePage extends Component {
  componentDidMount() {
    scrollToTop();
  }

  render() {
    let data = {
      title: "Política de privacidade - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <PrivacyPolicy />
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}