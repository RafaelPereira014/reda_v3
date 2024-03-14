'use strict';

import React from 'react';
import { Component } from 'react';

// Resources listing
import ResourcesList from '%/containers/resources/pending';

//  Components
export default class ResourcesPendingListPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <ResourcesList {...this.props} />
    );
  }
}