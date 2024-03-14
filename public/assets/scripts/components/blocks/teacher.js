'use strict';

import React from 'react';
import { Component } from 'react';
import fetch from 'isomorphic-fetch';

// Components
import {Link} from 'react-router-dom';
import IsAuth from '#/containers/auth/isAuth';
import IsNotAuth from '#/containers/auth/isNotAuth';
import ProtectedButton from '#/components/auth/protectedButton';

// Config
import appConfig from '#/appConfig';

// Utils
import { isNode } from '#/utils';

export default class TeacherBlock extends Component {
	constructor(props){
		super(props);

		this.state = {};
	}

	componentDidMount(){
		return fetch((isNode ? appConfig.domain : '/')+'assets/scripts/dummy.json')
			.then(response => {
				if (response.status >= 400) {
					throw new Error('Bad response');
				}

				return response.json();
						
			})
			.then(json => {
				if (!json.teacher)
					throw new Error('No data');

				this.setState(json.teacher);
			})
			.catch(() => {
				/* console.log(message); */
			});
	}

	render() {
		if (Object.keys(this.state).length<=0){
			return null
		}

		const { auth } = this.props;

		return (
			<div className="col-xs-12 col-sm-6 block__container" style={{"backgroundImage": `url(${this.state.image.src})`}}>
				<div className="block__overlay"></div>
				<div className="block__side block__side--text">
					<h1>{this.state.title}</h1>
					<span dangerouslySetInnerHTML={{__html: this.state.text}}></span>
					<IsAuth>
						<Link to={auth.data && (auth.data.user.role=="user" || auth.data.user.role=="student")  ? "/painel/meusrecursos/favoritos" : "/painel/meusrecursos"} className="cta white outline">{this.state.button.text}</Link>
					</IsAuth>
					<IsNotAuth>
						<ProtectedButton target="/painel/meusrecursos" className="cta white outline">{this.state.button.text}</ProtectedButton>
					</IsNotAuth>
				</div>			
				
			</div>
		);
	}
}