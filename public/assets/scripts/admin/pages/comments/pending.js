'use strict';

import React from 'react';
import { Component } from 'react';

// Resources listing
import CommentsList from '%/containers/comments/pending';

//  Components
export default class CommentsPendingListPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <CommentsList {...this.props} />
    );
  }
}