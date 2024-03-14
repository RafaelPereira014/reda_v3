'use strict';

import React from 'react';
import { Component } from 'react';
import fetch from 'isomorphic-fetch';

// Components
import {Link} from 'react-router-dom';

// Config
import appConfig from '#/appConfig';

// Utils
import { isNode } from '#/utils';

export default class ExploreBlock extends Component {
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
				if (!json.explore)
							throw new Error('No data');

						this.setState(json.explore);
			})
			.catch(() => {
				/* console.log(message); */
			});
	}
	

	render() {
		if (Object.keys(this.state).length<=0){
			return null
		}

		return (
			<div className="col-xs-12 col-sm-6 block__container" style={{"backgroundImage": `url(${this.state.image.src})`}}>
				<div className="block__overlay"></div>
				<div className="block__side block__side--text">
					<h1>{this.state.title}</h1>
					<span dangerouslySetInnerHTML={{__html: this.state.text}}></span>
					<Link to="/ligacoes/experimenta" className="cta white outline">{this.state.button}</Link>
				</div>
			</div>
		);
	}
}