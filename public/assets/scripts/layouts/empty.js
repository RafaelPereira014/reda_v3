'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Utils
import { isNode } from '#/utils';

export default class Empty extends Component {

	UNSAFE_componentWillReceiveProps() {

		const {
			pathname,
			search,
			hash
		} = this.props.location;

		// Set previous route only if related to resources
		let prevRoute = !isNode && pathname.indexOf('/recursos/detalhes-recurso/')<0 && pathname.indexOf('recursos')>=0 ? pathname+search+hash : localStorage.getItem('prevRoute');

		!isNode && localStorage.setItem('prevRoute', prevRoute);
	}

  render() {
    return (
      <div>
        <DocHead />
        {this.props.children}
      </div>
    );
  }
}
