'use strict';

import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';


export default class AlertsBox extends Component {
	constructor(props) {
		super(props);

		this.setTimer = this.setTimer.bind(this);
		this.dismissAlert = this.dismissAlert.bind(this);

		this.state = {
			visible: false
		}
	}

	componentDidMount(){
		this.setTimer();

		if (!this.state.visible && this.props.alerts.message && this.props.alerts.resultType){
			this.setTimer();
			this.setState({visible: true});
		}
	}

	componentWillUnmount(){
		clearTimeout(this._timer);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { message, resultType } = this.props.alerts;

		if (nextProps.alerts.message!=message && nextProps.alerts.resultType!=resultType){	    	
			this.setTimer();
			this.setState({visible: true});
		}
	}

	UNSAFE_componentWillUpdate(prevProps){
		const { message, resultType } = this.props.alerts;

		if (prevProps.alerts.message!=message && prevProps.alerts.resultType!=resultType){	    	
			this.setTimer();
			this.setState({visible: true});
		}
	}

	dismissAlert(){
		this.setState({visible: false});
		this.props.removeAlert();
		clearTimeout(this._timer);
	}

	// Set timer to hide alert box
	setTimer() {

		// clear any existing timer
		this._timer != null ? clearTimeout(this._timer) : null;

		// hide after `delay` milliseconds
		this._timer = setTimeout(function(){
			this.setState({visible: false});
			this._timer = null;
			this.props.removeAlert();
		}.bind(this), this.props.delay);
	}

	render(){
		const { message, resultType } = this.props.alerts;
		const { visible } = this.state;

		return(
			<div className={"alert-fixed alert" + (resultType ? " alert-"+resultType : "") + (!message || !visible ? " hide" : "") + (message && visible ? " animate-show" : "")}>
				<button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.dismissAlert}><span aria-hidden="true">&times;</span></button>
				<span dangerouslySetInnerHTML={{__html: message}}></span>
			</div>
		);
	}
}

AlertsBox.propTypes = {
	alerts: PropTypes.object.isRequired
}

AlertsBox.defaultProps = {
	delay: 5000
}