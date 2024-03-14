'use strict';

import React from 'react';
import { Component } from 'react';

// Apps listing
import AppsOverview from '%/containers/overview/month/apps';

//  Components
export default class AppsOverviewPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <AppsOverview {...this.props} />
    );
  }
}