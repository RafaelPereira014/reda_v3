'use strict';

import React from 'react';
import { Component } from 'react';

// Resources listing
import ResourcesList from '%/containers/resources/pending';
import HiddenList from '%/containers/resources/hidden';

//  Components
export default class ResourcesHiddenListPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {  
    return (
        <HiddenList {...this.props} />
    );
  }
}