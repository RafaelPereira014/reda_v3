'use strict';

import React from 'react';
import { Component } from 'react';

// Users listing
import UsersOverview from '%/containers/overview/month/users';

//  Components
export default class UsersOverviewPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <UsersOverview {...this.props} />
    );
  }
}