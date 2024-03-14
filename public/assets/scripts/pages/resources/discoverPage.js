'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import ResourcesContainer from '#/containers/resources';
import AppBreadcrumbs from '#/components/common/breadcrumbs';
import BottomNav from '#/components/navigation/bottomNav';

// Actions
import { fetchConfig } from '#/actions/config';
import { searchResources } from '#/actions/resources';
import { fetchTaxonomies } from '#/actions/taxonomies';

// Contexts
import { ResourceFiltersContext } from '#/contexts/resources/filters';

class DiscoverPage extends Component {
  constructor(props) {
    super(props);
  }


  render() {    
    let data = {
      title: "Recursos - REDA"
    }


    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <AppBreadcrumbs location={this.props.location} />
        <ResourceFiltersContext.Consumer>
            {({open, filtersDidReset, toggleFiltersReset, toggleFilters}) => (
              <ResourcesContainer
                location={this.props.location}
                match={this.props.match}
                filtersOpened={open}
                toggleFilters={() => toggleFilters()}
                filtersDidReset={filtersDidReset}
                toggleFiltersReset={toggleFiltersReset}/>
            )}
        </ResourceFiltersContext.Consumer>
      
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}

DiscoverPage.needs = [
    fetchConfig,
    searchResources,    
    fetchTaxonomies
]

export default DiscoverPage;