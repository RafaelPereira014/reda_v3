'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import RequestRecover from '#/containers/auth/requestRecover';
import BottomNav from '#/components/navigation/bottomNav';

export default class RecoverPasswordPage extends Component {
  render() {
    let data = {
      title: "Recuperar Palavra-passe - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <RequestRecover />
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}