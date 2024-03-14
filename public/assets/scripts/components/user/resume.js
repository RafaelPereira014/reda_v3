'use strict';

import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import {Link} from 'react-router-dom';

export default class UserResume extends Component {
	constructor(props){
		super(props);

		// Renders
		this.renderName = this.renderName.bind(this);
		this.setButton = this.setButton.bind(this);

		this.allowedUsers = ['admin', 'teacher', 'editor'];
	}

	componentDidMount(){		
		this.props.fetchConfig();
	}

	setButton(){
		const { location, auth } = this.props;

		if (auth && auth.data && auth.data.user.role && this.allowedUsers.indexOf(auth.data.user.role)<0){
			return false;
		}

		// Mapping buttons options
		let mapping = [
			["/painel/meusrecursos", "/novorecurso", "Novo recurso"],
			["/painel/aplicacoes", "/novaaplicacao", "Nova aplicação"],
			["/painel/ferramentas", "/novaferramenta", "Nova ferramenta"]
		];

		let url = null;
		let text = null;

		// Set options for button
		mapping.map(item => {
			if(location.pathname == item[0]){
				url = item[1];
				text = item[2];
			}
		})

		if (url==null || text==null){
			return null;
		}

		return (
			<div className="col-xs-12 text-center">
				<Link to={url} className="cta primary">{text}</Link>
			</div>
		);
	}

	renderName(){
		const { auth } = this.props;

		return (<h4>
			<div>
				<span>
					{auth && auth.data && auth.data.user ? auth.data.user.name : ''}
				</span>
			</div>
		</h4>)
	}

	render() {

		const { auth, config, showImage } = this.props;

		if ((!auth.data && !auth.data.user) || !config.data)
			return null

		const user = auth.data.user;

		const image = auth.data.user.image || config.data.icons+"/user.png";
		
		return (
			<div className="container">
				<div className="row user-resume">
					<div className="col-xs-12">
						{showImage && <div className="user-image" style={{"backgroundImage": `url(${image})`}}></div>}
						{!showImage && <p>Bem-vindo(a)!</p>}
						{this.renderName(user)}	
					</div>					
					{this.setButton()}					
				</div>
			</div>
		);
	}
}

UserResume.propTypes = {
	auth: PropTypes.object.isRequired,
	showImage: PropTypes.bool
}

UserResume.defaultProps = {
	showImage: false
}