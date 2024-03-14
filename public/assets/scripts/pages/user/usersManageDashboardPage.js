'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import ProfileNavContainer from '#/containers/nav/profileNav';
import UsersManage from '#/components/dashboard/users/manage';
import BottomNav from '#/components/navigation/bottomNav';

export default class DiscoverPage extends Component {
  render() {
    let data = {
      title: "Gerir Utilizadores - Painel"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <ProfileNavContainer location={this.props.location}/>
        <UsersManage location={this.props.location} match={this.props.match} {...this.props}/>
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}