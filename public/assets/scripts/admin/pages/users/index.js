'use strict';

import React from 'react';
import { Component } from 'react';

// Apps listing
import UsersList from '%/containers/users';

//  Components
export default class UsersListPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <UsersList {...this.props} />
    );
  }
}