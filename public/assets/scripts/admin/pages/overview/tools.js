'use strict';

import React from 'react';
import { Component } from 'react';

// Tools listing
import ToolsOverview from '%/containers/overview/month/tools';

//  Components
export default class ToolsOverviewPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <ToolsOverview {...this.props} />
    );
  }
}