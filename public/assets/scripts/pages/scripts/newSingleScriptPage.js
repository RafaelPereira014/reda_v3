'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import NewSingleScriptFormContainer from '#/containers/dashboard/scripts/newSingleScriptForm';
import BottomNav from '#/components/navigation/bottomNav';

export default class NewSingleSCriptPage extends Component {
  render() {
    let data = {
      title: "Criar/Editar Propostas de operacionalização - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <NewSingleScriptFormContainer match={this.props.match}/>
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}