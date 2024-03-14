'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

// Utils
import { setDateFormat, isNode } from '#/utils';

// Boostrap
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

// Components
import Rating from '#/components/common/rating';
import SvgComponent from '#/components/common/svg';
/* import ProtectedButton from '#/components/auth/protectedButton'; */
import DeleteSingle from '#/components/common/deleteSingle';
import IsAdmin from '#/containers/auth/isAdmin';
import IsInteractor from '#/containers/auth/isInteractor';
import ConfirmBox from '#/containers/dashboard/common/confirmBox'; 

// Utils
import { truncate } from '#/utils';

var renderButtons = (el, props) => {
	if (!props.actions){
		return null;
	}

	if (!props.toApprove){
		return (
			<div className="actions">
				<Link to={"/editarrecurso/" + el.slug} className="cta primary no-bg small">Editar</Link>
				<DeleteSingle className="cta primary no-bg small delete-action" deleteSingle={props.deleteSingle} item={el.slug}>Eliminar</DeleteSingle>
			</div>
		)
	}

	let approvalType = !el.approvedScientific && !el.approvedLinguistic ? " Cientificamente" : (el.approvedScientific && !el.approvedLinguistic ? " Linguisticamente" : "");
	
	return (
		<div className="actions">
			<ConfirmBox 
			continueAction={()=> props.setApprove(true, el, null)} 
			className="cta primary no-bg small" 
			title="Aprovar Recurso"
			text={"Tem a certeza que deseja aprovar" + approvalType + " este recurso?"}>
              {"Aprovar" + approvalType}
            </ConfirmBox>
			<ConfirmBox 
			continueAction={(message, messagesList)=> props.setApprove(false, el, message, messagesList)} 
			className="cta primary no-bg small delete-action"
			title="Reprovar Recurso"
			text="Tem a certeza que deseja reprovar este recurso? Indique o motivo."
			message={"Indique outro motivo de reprovação do recurso..."}
			messagesList={props.disapproveMessages}
			dialogType="disapprove-dialog">
              Reprovar
            </ConfirmBox>
		</div>
	)
	
}

var printStatus = (el, props) => {
	if (props.user.user.id == el.user_id || props.user.user.role=='admin'){
		return(
			<i 
				className={"fa fa-circle is-approved" + (el.status && el.approved ? " approved" : (!el.approved ? " pending" : ""))} 
				aria-hidden="true" 
				title={(el.status && el.approved ? " Aprovado" : (!el.status ? "Reprovado" : (!el.approved ? "Aguarda Aprovação" : "")))}>
			</i>
		)
	}

	return null
}

var renderList = (list, props) => {	

	return list.map((el) => {

		// Type tooltip
		let tooltip = null;
		
		if (el.Formats){
			tooltip = (
				<Tooltip id={"resource_" + el.id}>{el.Formats[0].title}</Tooltip>
			);
		}

		var div = null;
    if(!isNode){
        div = document.createElement("div");
        div.innerHTML = el.description;
    }

		return (
			<article className="col-xs-12" key={el.id}>
				<div className="list__element list__dashboard dashboard__element">
					{!props.toApprove && props.actions && <div className="check-element">
						<input type="checkbox" name={"selected-resource"+el.id} id={"selected-resource"+el.id} checked={props.checkedList.indexOf(el.id)>=0}/>
						<label htmlFor={"selected-resource"+el.id} onClick={() => props.checkEl(el.id)}></label>
					</div>}

					<div className="list__dashboard--container">
						<header className="list__dashboard--heading">
							<Link to={"/recursos/detalhes-recurso/" + el.slug} className="left-col fLeft">
								<h1 title={el.title}>
								<div dangerouslySetInnerHTML={{ __html: truncate(el.title, 10) }} />
								</h1>
								{/*<h1 title={el.title}>{truncate(el.title, 10)}</h1>*/}
								<span>Criado a <time>{setDateFormat(el.created_at, "LLL")}</time></span>
								<p title={div ? div.innerText : el.description}>{truncate(div ? div.innerText : el.description, 40)}</p>	      				      		
							</Link>
							
							{el.Formats && <div className="top-icons fRight">															
								<div className="type">
									<OverlayTrigger placement="left" overlay={tooltip}>
										<span>
											<SvgComponent element={(props.config && props.config.formatIcons)+"/"+el.Formats[0].Image.name+"."+el.Formats[0].Image.extension} color={el.Formats[0].color || '#83ae03'}/>
										</span>
									</OverlayTrigger>
									{printStatus(el, props)}

									{el.hasOwnProperty('didContact') && el.didContact>0 && 
										<span className={"fa fa-reply"} title="Contactado" style={{paddingLeft: "10px", color: "#ffa700"}}>				      						
										</span>
									}
								</div>		      				
							</div>}

							{/*BUTTONS*/}
							{renderButtons(el, props)}
						</header>


						
						{!props.toApprove && 
						<footer className="list__dashboard--footer">
							<div className="rating fLeft">
								<Rating readonly initialRate={parseInt(el.ratingAvg)}/>
							</div>	      			
							<div className="fRight right-col actions--right">
								<Link to={"/recursos/detalhes-recurso/" + el.slug } className="cta primary outline small">Ver Recurso</Link>
								<IsInteractor>
									<Link to={"/gerirpropostas/" + el.slug } className="cta primary outline small">Gerir propostas</Link>
								</IsInteractor>
								<span className="actions-container">
									<i className={"action-btn fa fa-" + ((el.isFavorite) ? "heart" : "heart-o")} title="Favorito" onClick={()=> props.setFavorite(el.id)}></i>
									<IsAdmin>
										<i className={"action-btn fa fa-" + (el.highlight ? "flag" : "flag-o")} onClick={()=> props.setHighlight(el.id)} title="Recurso do Mês"></i>
									</IsAdmin>
								</span>
							</div>
						</footer>}
					</div>
				</div>
			</article>
		);
    });
}

export const ResourcesList = (props) => {	
	if (!props.list || !props.list.data || props.list.fetching || props.list.data.length==0){
		return <p className="text-center">Não foram encontrados resultados.</p>
	}

	return(
		<section className="row">
			{renderList(props.list.data, props)}
		</section>
	);
}

ResourcesList.propTypes = {
	list: PropTypes.object.isRequired
}

ResourcesList.defaultProps = {
	actions: true
}
