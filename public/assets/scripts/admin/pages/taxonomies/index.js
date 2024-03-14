'use strict';

import React from 'react';
import { Component } from 'react';

// Apps listing
import TaxonomiesList from '%/containers/taxonomies';

//  Components
export default class TaxonomiesListPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <TaxonomiesList {...this.props} />
    );
  }
}