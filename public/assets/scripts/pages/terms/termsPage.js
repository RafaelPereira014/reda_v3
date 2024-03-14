'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import TermsText from '#/components/terms';
import AppBreadcrumbs from '#/components/common/breadcrumbs';
import BottomNav from '#/components/navigation/bottomNav';

export default class NewResourcePage extends Component {
  render() {
    let data = {
      title: "Termos e condições - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <AppBreadcrumbs location={this.props.location}  />
        <div className="light-background terms-page">
          <TermsText />
        </div>        
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}