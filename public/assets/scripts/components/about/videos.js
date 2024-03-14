'use strict';

import React from 'react';

// Components
import {Link} from 'react-router-dom';
import {VideosList} from '#/components/videos/list';

export const VideosListContainer = (props) => {
	if (!props.videos || !props.videos.data || !props.videos.data.items || props.videos.data.items.length==0){
		return <div></div>
	}

	return (
		<div className="about__videos light-background">
			<h1 className="text-center">Vídeos de ajuda</h1>
			<p className="text-center">Aceda a um conjunto de vídeos que o podem auxiliar na utilização da plataforma.</p>
			<VideosList videos={props.videos} idKey={props.idKey} colsList={props.cols} />
			<div className="text-center about__videos--buttons">
				<Link to="/ajuda" className="cta primary outline">Ver todos os vídeos</Link>
			</div>			
		</div>		
	);
}

VideosListContainer.defaultProps = {
	cols:{
		lg:3,
		md:4,
		sm:6,
		xs:6
	}
}