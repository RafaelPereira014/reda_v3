'use strict';

import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import ConfirmBox from '#/components/common/confirmBox';

// Utils
import ReactGA from 'react-ga';

export default class DeleteCollective extends Component{
	constructor(props){
		super(props);

		this.deleteList = this.deleteList.bind(this);
	}

	deleteList(items){
		this.props.deleteList(items);	
		
		ReactGA.event({
			category: 'Editing',
			action: 'Eliminou uma lista de elementos',
			label: 'Eliminar lista'
		});
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

DeleteCollective.propTypes= {
    deleteList: PropTypes.func.isRequired
}