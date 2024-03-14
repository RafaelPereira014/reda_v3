'use strict';

import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';

import ConfirmBox from '#/components/common/confirmBox';

export default class DeleteCollectiveResources extends Component{
	constructor(props){
		super(props);

		this.deleteList = this.deleteList.bind(this);
	}

	deleteList(items){
		this.props.deleteResources(items)
			.then(this.props.cb);		
	}

	render(){
		const { className, items } = this.props;

		return(
			<ConfirmBox continueAction={()=> this.deleteList(items)} deleteIcon="fa fa-trash-o" className={className}>
				{this.props.children}
			</ConfirmBox>
		)	
	}
	
}

DeleteCollectiveResources.propTypes= {
    deleteResources: PropTypes.func.isRequired,
    cb: PropTypes.func.isRequired
}