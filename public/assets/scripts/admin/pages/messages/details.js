'use strict';

import React from 'react';
import { Component } from 'react';

// Apps listing
import MessageDetails from '%/containers/messages/details';

//  Components
export default class MessageDetailsPage extends Component {
  constructor(props) {
    super(props)
    
  }
  
  render() {   
    return (
        <MessageDetails {...this.props} />
    );
  }
}