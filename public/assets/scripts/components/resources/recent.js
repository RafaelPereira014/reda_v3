'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { ResourcesList }  from './common/list';

export default class RecentResources extends Component {

	constructor(props){
		super(props);

		//
		//	Event handlers
		//
		this.setHighlight = this.setHighlight.bind(this);
		this.setFavorite = this.setFavorite.bind(this);
	}

	UNSAFE_componentWillMount(){
		this.props.resetResources();
	}

	componentDidMount(){

		this.props.fetchResources(null, 'recent');
		this.props.fetchConfig();		
	}

	UNSAFE_componentWillUpdate(nextProps) {
		if (nextProps.auth.isAuthenticated != this.props.auth.isAuthenticated){
			this.props.fetchResources(null, 'recent');
		}  
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.auth.isAuthenticated != this.props.auth.isAuthenticated || nextProps.resources.fetched;
	}

	componentWillUnmount(){
		this.props.resetResources();
	}

	// Set as highlighted
	setHighlight(resourceId){
		this.props.setHighlights(resourceId);
	}

	// Set as favorite
	setFavorite(resourceId){
		this.props.setFavorites(resourceId);
	}

	render() {
		if (!this.props.resources.data || !this.props.config.data)
			return null;
		
		const { isAuthenticated } = this.props.auth;

		return (
			<section className="resources__recent">
				<div className="container">
					<div className="row">
						<div className="col-xs-12">
							<h1 className="spaced__title">Últimos recursos</h1>
						</div>
					</div>
					{this.props.resources.data.length > 0 ?
						<ResourcesList 
							list={this.props.resources} 
							config={this.props.config.data}
							viewmore 
							addscript
							auth={this.props.auth} 
							isAuthenticated={isAuthenticated}
							setHighlight={this.setHighlight}
							setFavorite={this.setFavorite}
							cols={{
								lg:3,
								md:4,
								sm:6
							}}
							/>
						:
						<p className="text-center">Ainda não existem recursos a mostrar.</p>
				}
				</div>
			</section>
		);
	}
}

RecentResources.propTypes = {
	resources: PropTypes.object.isRequired,
	config: PropTypes.object.isRequired
}