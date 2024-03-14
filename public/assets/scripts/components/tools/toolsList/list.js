'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Components
import { ToolElement } from './single';

var renderList = (list, props) => {	

	const { cols } = props;

	// Overwrite columns style
	let colsList = _.assign(props.defaultColsList, cols);

	return list.map((el, index) => {
		return <ToolElement 
			colsList={colsList} 
			el={el} 
			index={index} 
			key={el.id || index} 
			config={props.config}
			limitChar={props.limitChar}
		/>
    });
}

export const ToolsList = (props) => {	
	if (props.list.fetching){
		return <p className="margin__top--30 margin__bottom--60">A carregar...</p>;
	}

	if (!props.list || !props.list.data || props.list.data.length==0){
		return <p className="text-center margin__top--30 margin__bottom--60">Não foram encontrados resultados.</p>;
	}

	return(
		<section className="row">
			{renderList(props.list.data, props)}
		</section>
	);
}

ToolsList.propTypes = {
	list: PropTypes.object.isRequired,
	maxcol: PropTypes.number
}

ToolsList.defaultProps = {
	defaultColsList: {
		lg: 3,
		md: 3,
		sm: 4
	}
}