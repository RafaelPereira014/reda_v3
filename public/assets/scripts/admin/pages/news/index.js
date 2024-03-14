'use strict';

import React from 'react';
import { Component } from 'react';

// Apps listing
import NewsList from '%/containers/news';

//  Components
export default class NewsListPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <NewsList {...this.props} />
    );
  }
}