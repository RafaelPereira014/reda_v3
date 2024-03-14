'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import NewScriptFormContainer from '#/containers/dashboard/scripts/newScriptForm';
import BottomNav from '#/components/navigation/bottomNav';

export default class NewScriptPage extends Component {
  render() {
    let data = {
      title: "Gerir propostas de operacionalização - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <NewScriptFormContainer match={this.props.match}/>
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}