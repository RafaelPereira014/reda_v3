'use strict';

import React from 'react';
import { Component } from 'react';

// Apps listing
import MessagesList from '%/containers/messages';

//  Utils
import { scrollToTop } from '#/utils';

//  Components
export default class MessagesListPage extends Component {
  constructor(props) {
    super(props)
    
  }

  componentDidMount() {
    scrollToTop();
  }
  
  
  render() {   
    return (
        <MessagesList {...this.props} basePath={'dashboard'}/>
    );
  }
}