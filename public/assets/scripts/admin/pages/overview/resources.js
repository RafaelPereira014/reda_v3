'use strict';

import React from 'react';
import { Component } from 'react';

// Resources listing
import ResourcesOverview from '%/containers/overview/month/resources';

//  Components
export default class ResourcesOverviewPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <ResourcesOverview {...this.props} />
    );
  }
}