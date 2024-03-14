'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import NewToolFormContainer from '#/containers/dashboard/tools/newToolForm';
import BottomNav from '#/components/navigation/bottomNav';

export default class NewToolPage extends Component {
  render() {

    let data = {
      title: "Adicionar/Editar Ferramenta - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <NewToolFormContainer match={this.props.match} />
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}