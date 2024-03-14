'use strict';

import React from 'react';
import { Component } from 'react';

// Apps listing
import TaxRels from '%/containers/taxonomies/relationships';

//  Components
export default class TaxRelsPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <TaxRels {...this.props} />
    );
  }
}