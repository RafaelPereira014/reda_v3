'use strict';

import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';

import ConfirmBox from '#/components/common/confirmBox';

export default class HideResource extends Component{
	constructor(props){
		super(props);

		this.hideEl = this.hideEl.bind(this);
	}

	hideEl(item){
		console.log('hideEl', item);
		this.props.hideResource(item)
			.then(this.props.cb);		
	}

	render(){
		const { className, item } = this.props;

		return(
			<ConfirmBox title={"Ocultar elemento(s)"} continueAction={()=> this.hideEl(item)} deleteIcon="fa fa-trash-o" className={className}>
				{this.props.children}
			</ConfirmBox>
		)	
	}
	
}

HideResource.propTypes= {
    hideResource: PropTypes.func.isRequired,
    cb: PropTypes.func.isRequired
}