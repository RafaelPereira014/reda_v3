'use strict';

import React from 'react';
import PropTypes from 'prop-types';

// Components
/* import SvgComponent from '#/components/common/svg'; */
import AppPopup from '#/components/common/externalConnection';
import GenericPopup from '#/components/common/genericPopup';

// Utils
import { truncate } from '#/utils';
import { getBreaker, needsMoreButton } from '#/utils/list';

export const AppElement = (props) => {

	const { 
		el, 
		colsList, 
		index, 
		config,
		limitChar
	} = props;

	if(!el){
		return null;
	}

	return(		
			<article 
				className={"col-xs-12 col-sm-" + colsList.sm + " col-md-" + colsList.md + " col-lg-" + colsList.lg + getBreaker(index, colsList)} >
				<div className="list__element list__element--app">
					<header>
						<div className="list__element--picture">
							{el.Thumbnail && <img src={config.files+"/apps/"+el.slug+"/"+el.Thumbnail.name+"."+el.Thumbnail.extension} />}
						</div>      				
						
						<section className="bg-img">
							<h1 title={el.title}>{el.title}</h1>
							<ul>
								{el.Taxonomies.map((tax) => {
									if(tax.slug.indexOf('sistemas')>=0 && tax.Terms && tax.Terms.length>0){
										return tax.Terms.map((system, index) => <li key={system.id || index}><i className={"fa fa-"+ system.icon} title={system.title}></i>{system.title}</li>)
									}
								})}
							</ul>
						</section>		      		
					</header>

					<section>
						<p title={el.description}>{limitChar!=null && limitChar==false ? el.description : truncate(el.description, 15)}</p>
					</section>	      		

					<footer className="text-center">
						{needsMoreButton(el.description, 15) && 
							<GenericPopup 
								title={el.title}
								description={el.description}
								className="cta primary outline block no-border"
								contentClass="text-left">
								Ler mais
							</GenericPopup> 
						}
						{
							el.Taxonomies.map((tax) => {
								if(tax.slug.indexOf('sistemas')>=0 && tax.Terms && tax.Terms.length>0){
									return tax.Terms.map((system, index) => <AppPopup key={system.id || index} target={system.metadata} title={`Descarregar aplicação para ${system.title}`} className="cta primary outline no-border"><i className={"fa fa-"+ system.icon} title={`Descarregar aplicação para ${system.title}`}></i></AppPopup>)
								}
							})     			
						}
					</footer>	
				</div>
		</article>			
	);	
}

AppElement.propTypes = {
	el: PropTypes.object.isRequired,
	colsList: PropTypes.object,
	classColCount: PropTypes.number,
	config: PropTypes.object
}