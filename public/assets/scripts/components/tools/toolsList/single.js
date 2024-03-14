'use strict';

import React from 'react';
import PropTypes from 'prop-types';

// Components
import Popup from '#/components/common/externalConnection';
import GenericPopup from '#/components/common/genericPopup';

// Utils
import { truncate } from '#/utils';
import { getBreaker, needsMoreButton } from '#/utils/list';


export const ToolElement = (props) => {

	if (!props.el){
		return null
	}

	const { 
		el, 
		index, 
		colsList, 
		limitChar
	} = props;

	//truncate(el.title, 4)

	return(		
		<article className={"col-xs-12 col-sm-" + colsList.sm + " col-md-" + colsList.md + " col-lg-" + colsList.lg + getBreaker(index, colsList)} >
			<div className="list__element list__element--link">
				<header>      			
					<section>
						<h1 title={el.title}>{el.title}</h1>
					</section>		      		
				</header>

				<section>
					<p title={el.description}>{limitChar!=null && limitChar==false ? el.description : truncate(el.description, 30)}</p>
				</section>	      	
				<footer className="text-center">	
					{needsMoreButton(el.description, 30) && 
						<GenericPopup 
							title={el.title}
							description={el.description}
							className="cta primary outline block no-border"
							contentClass="text-left">
							Ler mais
						</GenericPopup>
					}			
					{el.link && 
						<Popup key={index} target={el.link} className="cta primary outline block no-border">Abrir Endereço</Popup> 			
					}
				</footer>
			</div>
		</article>			
	);	
}

ToolElement.propTypes = {
	el: PropTypes.object.isRequired,
	colsList: PropTypes.object.isRequired,
	classColCount: PropTypes.number,
	config: PropTypes.object,
	limitChar: PropTypes.bool
}