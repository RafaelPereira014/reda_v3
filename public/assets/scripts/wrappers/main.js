'use strict';

import React from 'react';
import { Component } from 'react';

// Utils
import { isNode } from '#/utils';

import Progress from "react-progress-2";
import CookieBanner from '#/components/privacyPolicy/cookieBanner';

class MainWrapper extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        {typeof Progress!=="undefined" && !isNode ? <Progress.Component /> : null}
        {this.props.children}
        <CookieBanner />
      </div>
    );
  }
}

export default MainWrapper;