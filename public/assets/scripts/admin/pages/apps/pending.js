'use strict';

import React from 'react';
import { Component } from 'react';

// Apps listing
import AppsList from '%/containers/apps/pending';

//  Components
export default class AppsPendingListPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <AppsList {...this.props} />
    );
  }
}