'use strict';

import React from 'react';
import { Component } from 'react';

// Apps listing
import AppsList from '%/containers/apps';

//  Components
export default class AppsListPage extends Component {
  constructor(props) {
    super(props);  
  }
  
  render() {   
    return (
        <AppsList {...this.props} />
    );
  }
}