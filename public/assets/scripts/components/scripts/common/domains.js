'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {CheckboxGroup, Checkbox} from 'react-checkbox-group';

import _ from 'lodash';

// Utils
import { getBreaker } from '#/utils/list';


export default class DomainsList extends Component{
	constructor(props){
		super(props);

		//
		//	Event handlers
		//
		this.setDomains = this.setDomains.bind(this);
	}

	setDomains(group){
		this.props.setDomains(group);
	}

	// Check if domains are in any subject
	// DOMAINS MUST BE PROVIDED WITH THEIR SUBJECTS ASSOCIATED
	domainsOfSubject(script, domains){

		// Make copy of domains to maintain immutable
		let domainsCopy = _.assign([], domains.data);

		// Are any subjects selected
		if (script.subjects && script.subjects.length>0){
	
			domainsCopy = _.filter(domainsCopy, (domain) => {
				let exists = false;

				// If domain subjects was selected
				for (let domainSubject of domain.Subjects){
					exists = script.subjects.indexOf(domainSubject.id) >= 0;
				}

				return exists;
			});

			// Avoid returning duplicates
			return _.uniqBy(domainsCopy, 'title');
		}

		return null;
	}

	render(){
		let colsList = {
			lg: 3,
			md: 3,
			sm: 4
		}

		const { field, meta, scripts, scriptIndex, domains, colClass, cols, extraClass } = this.props;

		// Get domains to present
		const totalDomains = this.domainsOfSubject(scripts[scriptIndex], domains);

		if ((!scripts[scriptIndex].subjects || scripts[scriptIndex].subjects.length==0) || !totalDomains || totalDomains.length==0){
			return null;
		}

		if (cols){
			colsList = cols
		}

		return (
			<div className="row">
				<div className="col-xs-12">
					<label className="input-title">Domínios*</label>
					<div className={`form-group ${meta.touched && meta.invalid ? 'has-error' : ''}`}>

					{(() => {
		
						if (totalDomains && totalDomains.length>0){            	
							return(
								<CheckboxGroup
											name={"domains-checkbox-"+scriptIndex}
											value={field.value}
											onChange={this.setDomains}
										>
													<div className="row">
														{totalDomains.map((item,index) => {
															return (
																<div key={item.id} className={colClass || (extraClass + " col-xs-" + (colsList.xs || 6) + " col-sm-" + colsList.sm + " col-md-" + colsList.md + " col-lg-" + colsList.lg + " " +getBreaker(index, colsList))}>
																	<Checkbox value={item.id} id={"domains-" + scriptIndex + "-" + item.id}/> 
																	<label htmlFor={"domains-" + scriptIndex + "-" +item.id}>{item.title}</label>
																</div>
															)
														})}
													</div>
								</CheckboxGroup>
							)
						}
					})()}            
						{meta.touched && meta.error && <div className="text-danger">{meta.error}</div>}
					</div>
				</div>
			</div>
		)
	}
}

DomainsList.propTypes = {
	field: PropTypes.object.isRequired,
	meta: PropTypes.object.isRequired,
	scripts: PropTypes.array.isRequired,
	scriptIndex: PropTypes.number.isRequired,
	setDomains: PropTypes.func.isRequired,
	domains: PropTypes.object.isRequired,
	colsList: PropTypes.object,
	colClass: PropTypes.string,
	extraClass: PropTypes.string
}