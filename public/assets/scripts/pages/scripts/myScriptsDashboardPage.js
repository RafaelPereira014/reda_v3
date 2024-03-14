'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import ProfileNavContainer from '#/containers/nav/profileNav';
import DashBoard from '#/components/dashboard/scripts';
import BottomNav from '#/components/navigation/bottomNav';

// Utils
import { isPending } from '#/utils/scripts';

export default class DiscoverPage extends Component {
  render() {
    let data = {
      title: isPending(this.props.location.pathname) ? "Propostas Pendentes - Painel" : "Minhas propostas de operacionalização - Painel"
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