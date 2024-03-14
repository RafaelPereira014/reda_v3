'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import SignupConfirm from '#/containers/auth/signupConfirm';
import BottomNav from '#/components/navigation/bottomNav';

export default class SignupConfirmPage extends Component {
  render() {
    let data = {
      title: "Confirmar Registo - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <SignupConfirm location={this.props.location} match={this.props.match} />           
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}