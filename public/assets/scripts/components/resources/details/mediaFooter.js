'use strict';

import React from 'react';

// Components
import FavoriteIcon from '#/components/resources/actions/favorite';
import {EmailIcon} from '#/components/resources/actions/email';
import ShareIcon from '#/components/resources/actions/share';
import {EmbedIcon} from '#/components/resources/actions/embed';
import HighlightIcon from '#/components/resources/actions/highlight';
import IsAuthenticated from '#/containers/auth/isAuth';
import IsAdmin from '#/containers/auth/isAdmin';
import ConfirmBox from '#/components/common/externalConnection';


// Utils
import { setUrl, isNode } from '#/utils';
import apiPath from '#/appConfig';
import ReactGA from 'react-ga';

/**
 *
 *	Helper functions
 * 
 */
const downloadFile = (el) => {
	if (el.currentTarget.getAttribute('href')){
		ReactGA.ga('send', 'event', 'File', 'Download', setUrl(apiPath.domain+el.currentTarget.getAttribute('href').replace(/^\/|\/$/g, '')));
	}
}

const printAction = (filesPath, file, url) => {
	if (file){
		return(
			<li>
				<a href={apiPath.domainClean+filesPath + "/" + file.name + "." + file.extension}  
				className="media__action media__action--main" 
				title="Descarregar Ficheiro"
				download
				onClick={(el) => downloadFile(el)}>
					<i className="fa fa-download"></i>
				</a>
			</li>
		);
	}else if(url){
		return(
			<li>
				<ConfirmBox target={setUrl(url)} type="Resource Link" className="media__action media__action--main" title="Abrir Recurso"><i className="fa fa-link"></i><span>Abrir</span></ConfirmBox>
			</li>
		);
	}

	return null;
}

export default (props) => {
	const { filesPath, file, url, setFavorite, setHighlight, isHighlight, isFavorite, resource } = props;

	return (
		<ul className="media-footer">
			{printAction(filesPath, file, url)}
			<IsAdmin>				
				<li>
					<HighlightIcon isHighlight={isHighlight} setHighlight={setHighlight} resourceId={resource.id}/>
				</li>
			</IsAdmin>
			<IsAuthenticated>
				<li>
					<FavoriteIcon isFavorite={isFavorite} setFavorite={setFavorite} resourceId={resource.id}/>
				</li>
			</IsAuthenticated>
			{!isNode && <li>
				<EmailIcon to="" subject={"Recurso REDA: " + resource.title} body={resource.title + " " + (!isNode && window.location.href)}/>
			</li>}
			<li>
				<ShareIcon resource={resource} />
			</li>
			{resource.embed && <li>
				<EmbedIcon code={resource.embed} />
			</li>}
		</ul>
	);
}