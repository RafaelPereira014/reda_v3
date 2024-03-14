'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import SignupForm from '#/containers/auth/signupForm';
import BottomNav from '#/components/navigation/bottomNav';

export default class NewResourcePage extends Component {
  render() {
    let data = {
      title: "Registar - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <SignupForm />
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}