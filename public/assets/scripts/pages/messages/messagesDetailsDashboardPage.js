'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import ProfileNavContainer from '#/containers/nav/profileNav';
import DashBoard from '#/components/dashboard/messages/details';
import BottomNav from '#/components/navigation/bottomNav';

// Utils

export default class MessagesDetailsDashboardPage extends Component {
  render() {
    let data = {
      title: "Mensagens de Recurso - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <ProfileNavContainer location={this.props.location}/>
        <DashBoard location={this.props.location} match={this.props.match} {...this.props}/>
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}