'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';

// Components
import { FormatsList } from './list';

export default class FormatsBanner extends Component {
	constructor(props){
		super(props);

		this.onFilter = this.onFilter.bind(this);
	}

	componentDidMount(){
		if (!this.props.formatsAll.fetched){
			this.props.fetchAllFormats();	
		}
		
		this.props.fetchConfig();	
	}

	shouldComponentUpdate(nextProps, nextState) {
	 	return JSON.stringify(nextProps.formatsAll) != JSON.stringify(this.props.formatsAll) || JSON.stringify(nextProps.config) != JSON.stringify(this.props.config);
	}

	onFilter(selectedFormat){
		const { formatsAll } = this.props;		

		let formatsToUse = [selectedFormat.id];

		if (formatsAll.data && selectedFormat.type && selectedFormat.type == 'all'){
			formatsToUse.length = 0;

			for (let item of formatsAll.data){
				if (item.type != 'all'){
					formatsToUse.push(item.id);
				};				
			}
		}

		this.props.searchResources({formats: formatsToUse})
		.then(() => {
			this.props.setFilters({filters: {formats: formatsToUse}});
			this.context.router.history.push('/recursos');
		})
	}

	render() {
		const { formatsAll, config } = this.props;

		if (!formatsAll || !formatsAll.data || formatsAll.fetching || formatsAll.data.length==0 || !config.data){
			return null
		}

		return (
			<div className="formats">
				<FormatsList formats={this.props.formatsAll} onFilter={this.onFilter} config={this.props.config}/>
			</div>
		);
	}
}

FormatsBanner.propTypes = {
	formatsAll: PropTypes.object.isRequired,
	config: PropTypes.object.isRequired
}

FormatsBanner.contextTypes = {
  router: PropTypes.object
}