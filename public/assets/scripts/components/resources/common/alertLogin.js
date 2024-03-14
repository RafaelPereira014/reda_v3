'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import Alert from 'react-bootstrap/lib/Alert';
import LoginButton from '#/components/auth/loginButton';

// Utils
import { isNode } from '#/utils';

export default class AlertLogin extends Component{
	constructor(props){
		super(props);

		//
		//	Handle events
		//
		this.handleAlertDismiss = this.handleAlertDismiss.bind(this);

		this.state = {
			alertVisible: true
		}
	}

	componentDidMount(){
		let localLoginAlert = !isNode && localStorage && localStorage.getItem('login_alert')!=null ? localStorage.getItem('login_alert')==="true" : true;
		this.setState({alertVisible: localLoginAlert});
	}

	handleAlertDismiss() {
		this.setState({alertVisible: false});
		!isNode && localStorage.setItem('login_alert', false);
	}

	render(){
		if (this.state.alertVisible==false){
			return null;
		}

		return(
			<section className="row">
				<div className="col-xs-12">
				<Alert bsStyle="warning" className="alert" onDismiss={this.handleAlertDismiss}>
						<p>Esta listagem pode conter resultados restritos ao utilizador não registado, pelo que aconselhamos que realize a sua autenticação.</p>
					<LoginButton className="btn btn-warning list-alert" location={this.props.location.pathname}>
						Entrar na REDA
					</LoginButton>
					</Alert>
				</div>
			</section>
		)		
	}
}

AlertLogin.propTypes = {
	location: PropTypes.object.isRequired
}