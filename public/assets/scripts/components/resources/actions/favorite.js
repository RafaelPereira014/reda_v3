'use strict';

import React from 'react';

function getIcon(isFavorite){
	return (isFavorite) ? "fa-heart" : "fa-heart-o";
}

export default (props) => {
	return(
		<div className="media__action favorite" onClick={() => props.setFavorite(props.resourceId)} title="Favorito">
			<i className={"fa " + getIcon(props.isFavorite)}></i>
		</div>
	);
}