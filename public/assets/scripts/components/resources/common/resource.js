'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import apiPath from '#/appConfig';

// Components
import Rating from '#/components/common/rating';
import IsAuthenticated from '#/containers/auth/isAuth';
import IsAdmin from '#/containers/auth/isAdmin';
import IsInteractor from '#/containers/auth/isInteractor';
import YearsList from '#/components/resources/common/years';

// Utils
import { truncate, setDateFormat, isNode } from '#/utils';
import YoutubeAPI from '#/utils/youtubeApi';
import { getBreaker } from '#/utils/list';

//
//	Render button according to app status
//
const renderProtected = (obj, target) => {

	return (
	<Link to={target}>
		{obj}
	</Link>
	)
}

//
//	Render option buttons
//
const optionsRender = (el, isAuthenticated, addscript, viewmore, auth) => {

	// Require option to add scripts
	if (addscript && isAuthenticated){
		return (
			<span className="list__element--buttons">
				<Link to={"/recursos/detalhes-recurso/" + el.slug} title="Ver recurso" className="cta primary outline no-border">Ver recurso</Link>
				{auth && auth.data && auth.data.user &&  auth.data.user.role=='admin' &&
					<Link to={"/editarrecurso/" + el.slug} title="Editar recurso" className="cta primary outline no-border">Editar recurso</Link>
				}
				<IsInteractor>
					<Link to={"/novaproposta/" + el.slug } title="Adicionar proposta de operacionalização" className="cta primary outline no-border">Adicionar propostas de operacionalização</Link>
				</IsInteractor>
			</span>
		)
	}

	// Require option to view more
	return (
		<span className="list__element--buttons">
			<Link to={"/recursos/detalhes-recurso/" + el.slug} title="Ver recurso" className="cta primary outline no-border">Ver recurso</Link>
			{auth && auth.data && auth.data.user && (auth.data.user.id == el.user_id || auth.data.user.role=='admin') && auth.data.user.role!='student' && auth.data.user.role!='user' &&
				<Link to={"/editarrecurso/" + el.slug} title="Editar recurso" className="cta primary outline no-border">Editar recurso</Link>
			}
		</span>
	)


}

//
//	Render favorite and highlight button
//
const renderAuthOptions = (el, isAuthenticated, setHighlight, setFavorite, hideOptions) => {
	if (!hideOptions){
		return (
			<IsAuthenticated>
				<div className="resource__element--topicons">
					<i className={"clickable fa fa-" + ((el.isFavorite) ? "heart" : "heart-o")} title="Favorito" onClick={()=> setFavorite(el.id)}></i>
					<IsAdmin>
						<i className={"clickable fa fa-" + ((el.highlight) ? "flag" : "flag-o")} title="Recurso do Mês" onClick={()=> setHighlight(el.id)}></i>
					</IsAdmin>
				</div>
			</IsAuthenticated>
		)
	}

	return null;
}

//
//	Render image
//
const renderImage = (el, props) => {
	const { files, background_images } = props.config;

	let image = null;

	//	If has thumbnail to show
	if(el.Thumbnail){
		image = files+"/resources"+"/"+el.slug + "/" + el.Thumbnail.name + "." + el.Thumbnail.extension;
	}

	//	If has embed code, check if is youtube
	if(!image && (el.embed || el.link) && (el.Formats && el.Formats.length>0 && el.Formats[0].slug.indexOf("video")>=0)){
		const isYoutube = YoutubeAPI.youTubeGetID(el.embed || el.link);
		image = isYoutube ? `https://img.youtube.com/vi/${isYoutube}/mqdefault.jpg` : image;
	}

	//	If none, them show default image
	if(!image){
		image = background_images+"/account-bg.jpg";
	}


	return renderProtected(
		<span style={{backgroundImage: `url(${image})`}}></span>
	,"/recursos/detalhes-recurso/" + el.slug, props);

}

export const ResourceElement = (props) => {

	if (!props.el){
		return null
	}

	const { 
		addscript, 
		viewmore, 
		isAuthenticated, 
		el, 
		index, 
		config, 
		setHighlight, 
		setFavorite,
		hideOptions,
		auth,
		colsList
	} = props;

	if(!config){
		return null;
	}

	const genericAreaColor = '#383838';

	//
	//	Set metadata
	//
	//let macros = el.Metadata && el.Metadata.filter(row => row.taxonomy==='macro_areas_resources');
	let disciplinas = el.Metadata && el.Metadata.filter(row => row.taxonomy==='areas_resources');

	//macros = el.Metadata && macros.length>0 ? (macros[0].Terms.length>1 ? {title: 'Multidisciplinar', color: genericAreaColor} : (macros[0].Terms.length==1 ? macros[0].Terms[0] : null)) : null;
	disciplinas = el.Metadata && disciplinas.length>0 ? (disciplinas[0].Terms.length>1 ? {title: 'Multidisciplinar', color: genericAreaColor} : (disciplinas[0].Terms.length==1 ? disciplinas[0].Terms[0] : null)) : null;

	let years = el.Metadata ? el.Metadata.filter(row => row.taxonomy==='anos_resources') : null;

	//	Prepare description
	var div = null;
	if(!isNode){
			div = document.createElement("div");
			div.innerHTML = el.description;
	} 
	const formats = el.Formats.map(format => format.title).join(', ');
	return(		
		<article 
			className={"margin__bottom--30 col-xs-12 col-sm-" + colsList.sm + " col-md-" + colsList.md + " col-lg-" + colsList.lg + getBreaker(index, colsList)} >
				
			<div className="resource__element">
				<div className="resource__thumb">
					{renderImage(el, props)}
					{disciplinas && 
						<div className="meta-area" style={{background:"linear-gradient(-120deg, transparent 15px, "+(genericAreaColor)+" 0px)"}}>
							{disciplinas.title}						
						</div>						
					}
				</div>
				<div className="resource__element-wrapper">
					{renderAuthOptions(el, isAuthenticated, setHighlight, setFavorite, hideOptions)}
					{/* renderLocked(el.exclusive, isAuthenticated) */}
					{
						renderProtected(
							<header>					
								<h1 title={el.title}>
								<div dangerouslySetInnerHTML={{ __html: truncate(el.title, 4) }} />
								</h1>					
								<p title={div ? div.innerText : el.description}>{truncate(div ? div.innerText : el.description, 15)}</p>
							</header>
						,"/recursos/detalhes-recurso/" + el.slug, props)
					}

					{optionsRender(el, isAuthenticated, addscript, viewmore, auth)}	
				</div>

				<footer>
					<div className="floating">
						<time className="fLeft">{setDateFormat(el.created_at, "LL")}</time>
						<div className="rating fRight">
							<Rating readonly initialRate={parseInt(el.ratingAvg)}/>
						</div>
					</div>
					<div className="floating margin__top--10">
						{/*
							el.Formats && el.Formats.length>0 && 
							<div className="type fLeft">{el.Formats[0].title + (el.Formats[0].slug.indexOf("video")>=0 ? " - "+el.duration : "")}</div>
				*/}
				{el.Formats && el.Formats.length>0 && <div className="type fLeft">{formats}</div>}
						<YearsList className="fRight" list={years && years.length>0 && years[0].Terms && years[0].Terms.length>0 ? years[0].Terms : null}></YearsList>
					</div>    			
				</footer>	
			</div>
		</article>		
		
	);	
}

ResourceElement.propTypes = {
	el: PropTypes.object.isRequired,
	colsList: PropTypes.object,
	addscript: PropTypes.bool,
	viewmore: PropTypes.bool,
	isAuthenticated: PropTypes.bool.isRequired,
	classColCount: PropTypes.number,
	config: PropTypes.object
}