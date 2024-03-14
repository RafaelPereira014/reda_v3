'use strict';

import React from 'react';

// Components
import VideoModal from '#/components/videos/videoModal';

// Utils
import { byString } from '#/utils';
import { getBreaker } from '#/utils/list';

export const VideosList = (props) => {
	var url = 'https://www.youtube.com/embed';

	const { colsList } = props;
	/*<article className={"col-xs-12 col-sm-3 col-lg-" + classColCount+getBreaker(idx, props.maxcol)} key={idx}>*/
	return (
		<section className="videos__container">
			<div className="container">
				{props.children}
				{props.videos && props.videos.length>0 && props.videos.map((video, idx) => {
					return(
						<article className={"col-xs-" + colsList.xs + " col-sm-" + colsList.sm + " col-md-" + colsList.md + " col-lg-" + colsList.lg + getBreaker(idx, colsList)} key={video.id || idx} >
							{/*<iframe src={`${url}/${video.id.videoId}`} />*/}
							<VideoModal 
							body={<iframe src={`${url}/${byString(video, props.idKey)}`} allowFullScreen/>} 
							className="video__modal--open"
							title={video.snippet.title}>
								<figure>
									<img src={video.snippet.thumbnails.high.url} className="img-responsive"/>
									<figcaption>{video.snippet.title}</figcaption>
								</figure>
							</VideoModal>
						</article>					
					)
				})}
				
			</div>
		</section>
	);	
}

VideosList.defaultProps = {
	idKey: 'id.videoId',
	maxcol: 4,
	colsList:{
		lg:3,
		md:4,
		sm:6,
		xs:6
	}
}