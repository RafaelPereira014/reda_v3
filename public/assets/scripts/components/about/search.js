'use strict';

import React from 'react';

// Components
import SearchContainer from '#/containers/search';

export default (props) => {
	return (
		<div className="about__search" id="about-search">
			<h1 className="text-center">Primeira pesquisa</h1>
			<p className="text-center">Faça agora a sua primeira pesquisa e aproveite a grande variedade de informação que temos para lhe oferecer.</p>
			<div className="container" key="search-container">
				<SearchContainer key="search-container" searchTags={true}/>
			</div>	
			<footer className="hidden-xs">
				<img src={props.config.data.background_images+"/res_example.png"} alt="Exemplo de recursos" className="img-responsive"/>
			</footer>			
		</div>		
	);
}
