'use strict';

import React from 'react';
import { Component } from 'react';

// Resources listing
import BadwordsList from '%/containers/comments/badwords';

//  Components
export default class BadwordsListPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <BadwordsList {...this.props} />
    );
  }
}