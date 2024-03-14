'use strict';

import React from 'react';
import { Component } from 'react';

// Components
import Popup from '#/components/common/sharePopup';

export default class ShareIcon extends Component {
	constructor(props){
		super(props);
	}

	componentDidMount(){		
			
	}

	render() {
		const { resource } = this.props;

		if (!resource){
			return null
		}

		return (			
				<Popup
					title="Partilhe este recurso"
					data={resource} 
					className="media__action media__action--share">
					<i className="fa fa-share-alt"></i>
				</Popup>
		);
	}
}