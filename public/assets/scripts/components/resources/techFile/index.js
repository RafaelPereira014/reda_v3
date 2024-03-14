'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Utils
import { stripAllTags } from '#/utils';

const renderList = (items) => {
	return (
		<ul>
			{items.map(item => {
				return <li key={item.id}>{item.title}</li>
			})}
		</ul>
	)
}

const techFile = (props) => {
	const {showTitle = true} = props;
	const { Taxonomies, techResources, id: rescId } = props.details;
	const { cols, showTopTaxs } = props;
	const ignoredTax = ['formato_resources','tags_resources','target_resources', 'tec_requirements_resources'];

	//	============================================
	//	Set order of top taxs
	//	============================================
	var topTaxsOrder = ["macro_areas_resources", "anos_resources", "areas_resources", "dominios_resources","subdominios","hashtags"];

	let finalTaxs = _.cloneDeep(Taxonomies);
	finalTaxs = _.sortBy(finalTaxs, function(obj){ 
		let index = _.indexOf(topTaxsOrder, obj.slug);

		if(index>=0){
			return index;
		}

		return finalTaxs.length-1;
	});

	let topTaxs = finalTaxs.filter((tax) => topTaxsOrder.indexOf(tax.slug)>=0);

	let otherTaxs = finalTaxs.filter((tax) => topTaxsOrder.indexOf(tax.slug)<0);



	//	============================================

	//	============================================
	//	Prepare tech requirements/resources
	//	============================================
	// Make seperate object for Tech Requirements
	let techReqTerms = [];
	let techReqTax = finalTaxs.find((tax) => tax.slug.indexOf('tec_requirements_resources')>=0);

	//	If there are any other tech resources provided extra terms list,
	//	and if current taxonomy is for tech resources, add the extra one to the list and order by title
	if(techResources){
		techReqTerms.push({
			id: 'other_tec_res_'+rescId,
			//title: stripAllTags(techResources)	// strip tags to avoid comming elements from tinymce
			title: techResources
		})
	}

	if(techReqTax){
		techReqTerms = techReqTerms.concat(techReqTax.Terms)
	}

	if(techReqTerms.length>0){
		techReqTerms = _.sortBy(techReqTerms, 'title');
	}

	//	============================================


	// Overwrite columns style
	let colsList = _.assign(props.defaultColsList, cols);
	return(
		<div className="tech-file">
			{showTitle && <div className="text-center">
				<h2>Ficha técnica</h2>
			</div>
			}
			{
				
				showTopTaxs && topTaxs && topTaxs.length>0 ?
					<div className="flex-container flex-row">
						{
							
							topTaxs.map((tax, idx) => {
								if(ignoredTax.indexOf(tax.slug)<0 && tax.Terms.length>0){
									let list = 
										<div key={tax.id} className={"flex-col-xs-12 flex-col-sm-" + colsList.sm + " flex-col-md-" + colsList.md + " flex-col-lg-" + colsList.lg + (idx>0 ?" border__left--light" : "")}>
											<h4>{tax.title}</h4>
											{renderList(tax.Terms)}	
										</div>
									return list;
								}
							})
						}
					</div>
					:
					null				
			}

			{
				(otherTaxs && otherTaxs.length>0 || techReqTerms.length>0) ?
					<div className="flex-container flex-row margin__top--30">
						{
							otherTaxs.map((tax) => {
								if(ignoredTax.indexOf(tax.slug)<0 && tax.Terms.length>0){
									let list = 
									<div key={tax.id} className={"flex-col-xs-12 flex-col-sm-" + colsList.sm + " flex-col-md-" + colsList.md + " flex-col-lg-" + colsList.lg}>
										<h4>{tax.title}</h4>
										{renderList(tax.Terms)}	
									</div>
									return list;
								}
							})
						}

						{	
							//	If there are any tech requirements
							techReqTerms.length>0 &&
								<div className={"flex-col-xs-12 flex-col-sm-" + colsList.sm + " flex-col-md-" + colsList.md + " flex-col-lg-" + colsList.lg}>
									<h4>Requisitos Técnicos</h4>
									{/*renderList(techReqTerms)*/}	
									{<ul><li dangerouslySetInnerHTML={{__html: techReqTerms.map((term) => term.title).join(', ')}}></li></ul>}
								</div>
						}
					</div>
				:
					null				
			}
		</div>		
	);
}

techFile.propTypes = {
	details: PropTypes.object.isRequired,
	cols: PropTypes.object
}

techFile.defaultProps = {
	defaultColsList: {
		lg:3,
		md:3,
		sm:6
	}
}

export default techFile