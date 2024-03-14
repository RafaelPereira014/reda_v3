'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import ProfileNavContainer from '#/containers/nav/profileNav';
import ProfileForm from '#/containers/dashboard/user/infoUpdateForm';
import BottomNav from '#/components/navigation/bottomNav';

export default class DiscoverPage extends Component {
  render() {
    let data = {
      title: "Meu perfil - Painel"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <ProfileNavContainer location={this.props.location}/>
        <ProfileForm location={this.props.location} match={this.props.match} {...this.props}/>
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}