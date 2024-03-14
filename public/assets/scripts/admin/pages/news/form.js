'use strict';

import React from 'react';
import { Component } from 'react';

// Apps listing
import NewsForm from '%/containers/news/form/new';

//  Components
export default class NewsFormPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <NewsForm {...this.props} />
    );
  }
}