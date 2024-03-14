'use strict';

import React from 'react';
import { Component } from 'react';
import fetch from 'isomorphic-fetch';

// Components
import LoginButton from '#/components/auth/loginButton';
import SvgComponent from '#/components/common/svg';
import {Link} from 'react-router-dom';

// Config
import appConfig from '#/appConfig';

// Utils
import { isNode } from '#/utils';

export default class ContributeBlock extends Component {
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
				if (!json.student)
							throw new Error('No data');

						this.setState(json.student);
			})
			.catch(() => {
				/* console.log(message); */
			});
	}


	render() {
		if (Object.keys(this.state).length<=0){
			return null
		}

		const section = this.state;

		return (
			<div className="block__contribute">
				<div className="container">
					<div className="row">
						<div className="col-xs-12 col-sm-8 col-sm-offset-2 block__contribute--col">
							<h2>{section.title}</h2>
							<SvgComponent element={section.icon} color="#ffffff"/>
							<p>{section.text}</p>
							{(() => {
								if (section.button.type=="login"){
									return !this.props.auth.isAuthenticated ?
										<LoginButton className="cta white outline">
											{section.button.text}
										</LoginButton>							
									: 
									<Link to="/painel/meusrecursos" className="cta white outline">
										{section.button.text}
									</Link>
								}else if(section.button.type=="feedback"){
									return<button className="cta white outline">{section.button.text}</button>
								}
							})()}
							
						</div>
					</div>				
				</div>
			</div>
		);
	}
}