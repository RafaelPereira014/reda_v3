'use strict';

import React from 'react';
import { Component } from 'react';

// Apps listing
import ToolsList from '%/containers/tools/pending';

//  Components
export default class ToolsPendingListPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <ToolsList {...this.props} />
    );
  }
}