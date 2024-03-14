'use strict';

import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';

import ConfirmBox from '#/components/common/confirmBox';

export default class DeleteResource extends Component{
	constructor(props){
		super(props);

		this.deleteEl = this.deleteEl.bind(this);
	}

	deleteEl(item){
		this.props.deleteResource(item)
			.then(this.props.cb);		
	}

	render(){
		const { className, item } = this.props;

		return(
			<ConfirmBox continueAction={()=> this.deleteEl(item)} deleteIcon="fa fa-trash-o" className={className}>
				{this.props.children}
			</ConfirmBox>
		)	
	}
	
}

DeleteResource.propTypes= {
    deleteResource: PropTypes.func.isRequired,
    cb: PropTypes.func.isRequired
}