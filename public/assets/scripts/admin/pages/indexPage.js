'use strict';

import React from 'react';
import { Component } from 'react';

//  Components
import Overview from '%/containers/overview';

//  Utils
import { scrollToTop } from '#/utils';

export default class IndexPage extends Component {
  constructor(props) {
    super(props)
    
  }

  
  componentDidMount() {
    scrollToTop();
  }
  
  
  render() {   
    return (
      <div>
          <Overview />
      </div>
    );
  }
}