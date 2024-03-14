'use strict';

import React from 'react';
import { Component, Fragment } from 'react';

// Utils
import { isNode } from '#/utils';

//  Components
import Progress from "react-progress-2";


class MainWrapper extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <Fragment>
        {typeof Progress!=="undefined" && !isNode ? <Progress.Component /> : null}
        {this.props.children}
      </Fragment>
    );
  }
}

export default MainWrapper;