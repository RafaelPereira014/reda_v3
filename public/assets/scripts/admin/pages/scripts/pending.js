'use strict';

import React from 'react';
import { Component } from 'react';

// SCripts listing
import ScriptsList from '%/containers/scripts/pending';

//  Components
export default class ScriptsPendingListPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <ScriptsList {...this.props} />
    );
  }
}