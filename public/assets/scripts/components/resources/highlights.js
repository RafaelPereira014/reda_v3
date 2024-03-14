'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';

// Components
import { AppCarousel as HighlightsCarousel } from './carousel';
import IsAuth from '#/containers/auth/isAuth';

export default class ResourceHighlights extends Component {
	constructor(props){
		super(props);
	}

	componentDidMount(){
		this.props.fetchHighlights();		
	}

	componentWillUnmount(){
		this.props.resetHighlights();
	}

	shouldComponentUpdate(nextProps,) {
		return nextProps.highlights.fetched;
	}

	UNSAFE_componentWillUpdate(nextProps) {
		if (nextProps.auth.isAuthenticated != this.props.auth.isAuthenticated){
			this.props.fetchHighlights();
		}  
	}

	render() {
		const { data, fetched, isFetching } = this.props.highlights;
/*
		let extra = [{
			title: "Bem-vindo à plataforma REDA",
			description: "REDA é uma plataforma dedicada à disponibilização de conteúdos educativos para a comunidade educativa."
		}]*/
		let extra = null;

		if (!fetched || !data || data.length==0 || isFetching || !this.props.auth.isAuthenticated){
			return (
				<div className="container no-highlights-header margin__top--30">
					<div className="col-xs-12 text-center">
						<h1>Bem-vindo à plataforma REDA</h1>						
					</div>

					<div className="col-xs-12 col-sm-6 col-sm-offset-3 text-center">
						<p>
							Recursos Educativos Digitais e Abertos (REDA) é uma plataforma dedicada à disponibilização de conteúdos educativos para a comunidade escolar.
						</p>					
					</div>					
				</div>
			)
		}

		var settings = {
			interval: 5000,
			indicators: false,
			nextIcon: <i className="fa fa-chevron-right" aria-hidden="true"></i>,
			prevIcon: <i className="fa fa-chevron-left" aria-hidden="true"></i>
		}

		return (
			<IsAuth>
				<HighlightsCarousel data={this.props.highlights} extra={extra} settings={settings} isAuthenticated={this.props.auth.isAuthenticated}/>
			</IsAuth>
		);
	}
}

ResourceHighlights.propTypes = {
	highlights: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
}
