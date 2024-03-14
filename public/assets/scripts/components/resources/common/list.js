'use strict';

import React from 'react';
import PropTypes from 'prop-types';

// Components
import { ResourceElement } from './resource';

// Utils
import _ from 'lodash';

var renderList = (list, props) => {	
	const { 
		addscript, 
		viewmore, 
		isAuthenticated, 
		setHighlight, 
		setFavorite, 
		hideOptions, 
		auth,
		cols
	} = props;

	// Overwrite columns style
	let colsList = _.assign(props.defaultColsList, cols);

	return list.map((el, index) => {
		if(el.Formats){
			return <ResourceElement 
				addscript={addscript} 
				viewmore={viewmore} 
				isAuthenticated={isAuthenticated} 
				el={el} 
				index={index} 
				key={el.id || index} 
				config={props.config}
				setHighlight={setHighlight}
				setFavorite={setFavorite}
				hideOptions={hideOptions}
				auth={auth}
				colsList={colsList}
			/>
		}else{
			return null;
		}
		
    });
}

export const ResourcesList = (props) => {	
	if (props.list.fetching){
		return <p className="margin__top--30 margin__bottom--60">A carregar...</p>;
	}

	if(!props.list || !props.list.data || props.list.data.length==0){
		return <p className="text-center margin__top--30 margin__bottom--60">Não foram encontrados resultados.</p>;
	}

	const { auth } = props;

	const interactors = ["teacher",	"editor"];

	return(
		<section className={"row" + (auth && auth.data && auth.data.user && auth.data.user.role=='admin' ? ' admin' : (
			auth && auth.data && auth.data.user && interactors.indexOf(auth.data.user.role)>=0 ? ' auth' : ''
		))}>
			{renderList(props.list.data, props)}
		</section>
	);
}

ResourcesList.propTypes = {
	list: PropTypes.object.isRequired,
	defaultColsList: PropTypes.object,
	cols: PropTypes.object,
	addscript: PropTypes.bool,
	viewmore: PropTypes.bool,
	isAuthenticated: PropTypes.bool.isRequired,
	hideOptions: PropTypes.bool
}

ResourcesList.defaultProps = {
	defaultColsList: {
		lg: 3,
		md: 3,
		sm: 4
	}
}