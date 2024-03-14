'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';

// Components
import { ResourcesList } from './common/list';

export default class RelatedResources extends Component {

	constructor(props){
		super(props);

		this.initialState = {
			limit: 4
		}

		this.state = this.initialState;

		this.fetchRelated = this.fetchRelated.bind(this);
	}

	componentDidMount(){
		let { params } = this.props.match;
		this.fetchRelated(params);
	}
	
	componentDidUpdate(prevProps) {
		let { params } = this.props.match;
		if (prevProps.match.params.resource != params.resource) {
			this.fetchRelated(params);	
		}   
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.relatedResources.fetched;
	}

	componentWillUnmount(){
		this.props.resetRelatedResources();
	}

	fetchRelated(params){
		this.props.fetchRelatedResources(params, this.state);	
		this.props.fetchConfig();
	}

	render() {
		if (this.props.relatedResources.fetched && (!this.props.relatedResources.data || this.props.relatedResources.data.length==0))
			return null;
		
		const { isAuthenticated } = this.props.auth;

		return (
			<section className="resources__recent">
				<div className="container">
					<div className="row">
						<div className="col-xs-12 text-left">
							<h2 className="resources__title">Outros recursos relacionados</h2>
						</div>
					</div>
					<ResourcesList 
						list={this.props.relatedResources} 
						config={this.props.config.data} 
						maxcol={3} 
						viewmore 
						isAuthenticated={isAuthenticated} 
						hideOptions={true}/>
				</div>
			</section>
		);
	}
}

RelatedResources.propTypes = {
	relatedResources: PropTypes.object.isRequired,
	origin: PropTypes.string.isRequired,
	config: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
}