'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import ProfileNavContainer from '#/containers/nav/profileNav';
import DashBoard from '#/components/dashboard/apps';
import BottomNav from '#/components/navigation/bottomNav';

export default class DiscoverPage extends Component {
  render() {
    let data = {
      title: "Aplicações - Painel"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <ProfileNavContainer location={this.props.location}/>
        <DashBoard location={this.props.location} param={this.props.match.params} {...this.props}/>
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}