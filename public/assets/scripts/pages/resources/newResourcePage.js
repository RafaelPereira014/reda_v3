'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import NewResourceFormContainer from '#/containers/dashboard/resources/newResourceForm';
import BottomNav from '#/components/navigation/bottomNav';

export default class NewResourcePage extends Component {
  render() {
    let data = {
      title: "Novo/Editar recurso - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <NewResourceFormContainer match={this.props.match} />
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}