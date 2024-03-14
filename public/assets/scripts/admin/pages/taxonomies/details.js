'use strict';

import React from 'react';
import { Component } from 'react';

// Apps listing
import TaxonomyDetails from '%/containers/taxonomies/details';

//  Components
export default class TaxonomyDetailsPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <TaxonomyDetails {...this.props} />
    );
  }
}