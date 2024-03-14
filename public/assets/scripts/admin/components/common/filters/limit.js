'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';

export default class LimitFilter extends Component {
	constructor(props){
		super(props);
	
		this.onFilterChange = this.onFilterChange.bind(this);
	}

	onFilterChange(e){
		this.props.onChange(parseInt(e.target.value));
	}

	render() {
    const items = []
    
    for(let idx = 10; idx<=100; idx+=10){
      items.push(<option key={idx} value={idx}>{idx}</option>)
    }

		return (
			<div className="limit">
				<label htmlFor="limit-box">Nº de resultados:</label>
				
				<select className="form-control" id="limit-box" onChange={this.onFilterChange} value={this.props.limit}>
          {items}
				</select>
			</div>
		);
	}
}

LimitFilter.propTypes = {
	onChange: PropTypes.func.isRequired,
	limit: PropTypes.number.isRequired
}