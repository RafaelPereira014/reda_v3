'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';

export default class GenericOrdering extends Component {
	constructor(props){
		super(props);
	
		this.onOrderChange = this.onOrderChange.bind(this);
	}

	onOrderChange(e){
		this.props.onChange(e.target.value);
	}

	render() {
		return (
			<div className="ordering">
				<label htmlFor="order-box">Ordenar por:</label>
				
				<select className="form-control" id="order-box" onChange={this.onOrderChange} value={this.props.order}>
					<option value="recent">Mais recente</option>
					<option value="alfa--asc">Alfabética</option>			
				</select>
			</div>
		);
	}
}

GenericOrdering.propTypes = {
	onChange: PropTypes.func.isRequired,
	order: PropTypes.string.isRequired
}