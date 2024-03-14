'use strict';

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export default class DropdownContainer extends Component {
	constructor(props){
		super(props);


		//
		//	Event Handlers
		//
		
		//
		//	Renders
		//
		this.renderList = this.renderList.bind(this);
	}

	renderList(list, listValue, listTitle){
		if (list && list.length>0){
			return list.map(el => {
				let spaces = String.fromCharCode(0x2014).repeat(el.hierarchy_level-1 || 0);

				if(el.hierarchy_level && el.hierarchy_level>0){
					spaces+=String.fromCharCode(160);
				}

				return <Fragment key={el[listValue]}>
					<option value={el[listValue]}>

						{spaces+el[listTitle]}

					</option>
				</Fragment>;
			});
		}
	}

	render(){
		const { 
			list, 
			defaultOption, 
			onChange, 
			onChangeParams,
			startValue, 
			listValue, 
			listTitle,
			disabled,
			className,
			noedit
		} = this.props;

		if(noedit){
			const filtered = list.find(curEl => curEl.id == startValue)
			return<span>{filtered ? filtered.title : ''}</span>
		}

		return (
			<select className={"form-control" + (className ? " "+className : "")} disabled={!list || list.length==0 || disabled} value={startValue} onChange={evt => onChange(evt, onChangeParams)} >
				{defaultOption && <option value="" default >{defaultOption}</option>}
				{this.renderList(list, listValue, listTitle, 0)}
			</select>
		)
	}
}

DropdownContainer.propTypes = {
	list: PropTypes.array.isRequired,
	listValue: PropTypes.string.isRequired,
	listTitle: PropTypes.string.isRequired,
	startValue: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]).isRequired,
	onChange: PropTypes.func,
	onChangeParams: PropTypes.any,
	disabled: PropTypes.string,
	defaultOption: PropTypes.string
}