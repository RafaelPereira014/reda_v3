'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import NewAppFormContainer from '#/containers/dashboard/apps/newAppForm';
import BottomNav from '#/components/navigation/bottomNav';

export default class NewResourcePage extends Component {
  render() {
    let data = {
      title: "Nova/Editar Aplicação - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <NewAppFormContainer match={this.props.match} />
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}