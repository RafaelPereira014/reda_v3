'use strict';

import React from 'react';
import { Component } from 'react';

// Containers
import HeaderContainer from '#/containers/header';
import NewsContainer from '#/containers/news';
import BottomNav from '#/components/navigation/bottomNav';
import AppBreadcrumbs from '#/components/common/breadcrumbs';
export default class NewsPage extends Component {
  render() {   
    return (
      <div>
        <HeaderContainer location={this.props.location} />
        <AppBreadcrumbs location={this.props.location} />
        <NewsContainer location={this.props.location}/>	          
        <BottomNav location={this.props.location} />
      </div>
    );
  }
}
