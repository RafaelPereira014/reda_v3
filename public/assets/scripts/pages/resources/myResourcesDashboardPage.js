'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import ProfileNavContainer from '#/containers/nav/profileNav';
import DashBoard from '#/components/dashboard/resources';
import BottomNav from '#/components/navigation/bottomNav';

// Contexts
import { ResourceFiltersContext } from '#/contexts/resources/filters';

// Utils
import { getPage } from '#/utils/resources';

export default class DiscoverPage extends Component {
  render() {
    let data = {
      title: (this.props.match.params.type ? getPage(this.props.match.params.type) : "Os meus recursos") + " - Painel"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <ProfileNavContainer location={this.props.location}/>
        <ResourceFiltersContext.Consumer>
            {({open, toggleFilters}) => (
              <DashBoard location={this.props.location} match={this.props.match} filtersOpened={open} toggleFilters={() => toggleFilters()} {...this.props}/>
            )}
        </ResourceFiltersContext.Consumer>
        
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}
