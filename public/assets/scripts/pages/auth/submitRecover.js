'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import SubmitRecoverPage from '#/containers/auth/submitRecover';
import BottomNav from '#/components/navigation/bottomNav';

export default class SubmitPasswordPage extends Component {
  render() {
    let data = {
      title: "Alterar Palavra-passe - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <SubmitRecoverPage match={this.props.match}/>
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}