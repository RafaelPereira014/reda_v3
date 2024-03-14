'use strict';

import React from 'react';

function getIcon(isHighlight){
	return (isHighlight) ? "fa-flag" : "fa-flag-o";
}

export default (props) => {
	return(
		<div className="media__action highlight" onClick={() => props.setHighlight(props.resourceId)} title="Recurso do Mês">
			<i className={"fa " + getIcon(props.isHighlight)}></i>
		</div>
	);
}