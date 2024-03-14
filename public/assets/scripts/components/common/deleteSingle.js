'use strict';

import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import ConfirmBox from '#/components/common/confirmBox';

// Utils
import ReactGA from 'react-ga';

export default class DeleteSingle extends Component{
	constructor(props){
		super(props);

		this.deleteEl = this.deleteEl.bind(this);
	}

	deleteEl(item){
		this.props.deleteSingle(item);	

		ReactGA.event({
			category: 'Editing',
			action: 'Eliminou um elemento',
			label: 'Eliminar elemento'
		});	
	}

	render(){
		const { className, item, title } = this.props;

		return(
			<ConfirmBox continueAction={()=> this.deleteEl(item)} deleteIcon="fa fa-trash-o" className={className} title={title || ""}>
              {this.props.children}
            </ConfirmBox>
		)	
	}
	
}

DeleteSingle.propTypes= {
    deleteSingle: PropTypes.func.isRequired
}