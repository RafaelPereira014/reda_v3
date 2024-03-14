'use strict';

import React from 'react';
import { Component } from 'react';

// Google Analytics
import ReactGA from 'react-ga';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import AlertBox from '#/containers/common/alerts';
import GovBanner from '#/components/common/govBanner';

// Utils
import { isNode } from '#/utils';

// Contexts
import { ResourceFiltersContext } from '#/contexts/resources/filters';


class App extends Component {
  constructor(props){
    super(props);

    this.toggleFilters = () => {
      this.setState(state => ({
        open: !state.open
      }));
    };

    this.toggleFiltersReset = () => {
      this.setState(state => ({
        filtersDidReset: !state.filtersDidReset
      }));
    };

    this.state = {
      open: false,
      filtersDidReset: false,
      toggleFilters: this.toggleFilters,
      toggleFiltersReset: this.toggleFiltersReset,
    };

    this.onRouteChanged = this.onRouteChanged.bind(this);
    this.setPrevRoute = this.setPrevRoute.bind(this);
  
  }

  // Trigger route change when location changes also
  componentDidUpdate() {
    let prevRoute = localStorage.getItem('cur');
     if (this.props.location.pathname != localStorage.getItem('cur')) {
      this.onRouteChanged(prevRoute);
    }

    localStorage.setItem('cur', this.props.location.pathname);
  }

  // Reset returnTo variable with route changes and is different from "/recursos"
  onRouteChanged(prevRoute) {
    if (!isNode && prevRoute!='/recursos'){
      localStorage.removeItem('returnTo');
    }

    if(!isNode){
      ReactGA.set({ page: prevRoute });
      ReactGA.pageview(prevRoute);
    }

    this.setPrevRoute();
    
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setPrevRoute(nextProps.location);
  }

  setPrevRoute(nextProps = null){
    const {
      pathname,
      search,
      hash
    } = nextProps || this.props.location;


    // Set previous route only if related to resources
    let prevRoute = !isNode && pathname.indexOf('/recursos/detalhes-recurso/')<0 && 
    (pathname.indexOf('recursos')>=0 || 
      pathname.indexOf('comentarios/pendentes')>=0 || 
      pathname.indexOf('propostas')>=0) 
    ? pathname+search+hash : localStorage.getItem('prevRoute');

    
    !isNode && localStorage.setItem('prevRoute', prevRoute);
  }

  render() {
    return (
      <ResourceFiltersContext.Provider value={this.state}>
        <DocHead location={this.props.location}/>
        <AlertBox delay={7000}/>
        <GovBanner />
        {this.props.children}
      </ResourceFiltersContext.Provider>
    );
  }
}

export default App;