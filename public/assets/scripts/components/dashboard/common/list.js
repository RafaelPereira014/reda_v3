'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

// Utils
import { byString, setDateFormat, isNode } from '#/utils';

// Boostrap

// Components
import DeleteSingle from '#/components/common/deleteSingle';
import ConfirmBox from '#/components/dashboard/common/confirmBox';
import { truncate } from '#/utils';

var renderApprove = (el, props) => {
	if (props.toApprove){
		return (
			<div className="actions">
				<ConfirmBox 
				continueAction={()=> props.setApprove(true, el.id, null)} 
				className="cta primary no-bg small" 
				title="Aprovar Comentário"
				text="Tem a certeza que deseja aprovar este comentário?">
					Aprovar
				</ConfirmBox>
				<ConfirmBox 
				continueAction={(message)=> props.setApprove(false, el.id, message)} 
				className="cta primary no-bg small delete-action"
				title="Reprovar Comentário"
				text="Tem a certeza que deseja reprovar este comentário?"
				message={"Indique a razão de reprovação do comentário..."}>
					Reprovar
				</ConfirmBox>
			</div>
		)
	}
	
}

var printStatus = (el) => {
		return(
			<i 
				className={"fa fa-circle is-approved" + (el.status && el.approved ? " approved" : (!el.approved ? " pending" : ""))} 
				aria-hidden="true" 
				title={(el.status && el.approved ? " Aprovado" : (!el.status ? "Reprovado" : (!el.approved ? "Aguarda Aprovação" : "")))}>
			</i>
		)
}

var renderList = (list, props) => {	
	
	return list.map((el) => {
		let elTitle = el.title ? truncate(el.title, 10) : (props.titleKey && byString(el, props.titleKey) || "");
		let elDesc = el.description ? el.description : (props.descriptionKey && byString(el, props.descriptionKey) || "");
		let elSlug = el.slug || byString(el, props.slugKey) || "";

		var div = null;
    if(!isNode){
        div = document.createElement("div");
        div.innerHTML = elDesc;
    }

		return (
			<article className="col-xs-12" key={el.id}>
				<div className="list__element list__dashboard dashboard__element">
					{props.checkEl && 
						<div className="check-element">
							<input type="checkbox" name={"selected-element"+el.id} id={"selected-element"+el.id} checked={props.checkedList.indexOf(el.id)>=0}/>
							<label htmlFor={"selected-element"+el.id} onClick={() => props.checkEl(el.id)}></label>
						</div>
					}

					<div className="list__dashboard--container">
						<header className="list__dashboard--heading">
							<section className="left-col fLeft">
								<h1 title={elTitle}>{props.titleSuf}{elTitle}</h1>							
								<span>Criado a <time>{setDateFormat(el.created_at, "LLL")}</time></span>
								<p title={div ? div.innerText : elDesc}>{truncate(div ? div.innerText : elDesc, 40)}</p>
							</section>

							<div className="top-icons fRight absolute">
								<div className="type">
									{printStatus(el)}
								</div>
							</div>
							
							

							{/*BUTTONS*/}
							<div className="actions">
								{renderApprove(el, props)}
								{props.editTarget && <Link to={props.editTarget + elSlug} className="cta primary no-bg small">Editar</Link>}
								{props.viewTarget && <Link to={props.viewTarget + elSlug} className="cta primary no-bg small">Ver</Link>}
								{props.customTargets && props.customTargets.map((target, index) => {
									return <Link to={target.link + elSlug} className="cta primary no-bg small" key={index}>{target.label}</Link>
								})}
								{props.deleteSingle && <DeleteSingle className="cta primary no-bg small delete-action" deleteSingle={props.deleteSingle} item={elSlug}>Eliminar</DeleteSingle>}
							</div>
						</header>
					</div>
				</div>
			</article>
		);
    });
}

export const List = (props) => {	
	if (!props.list || !props.list.data || props.list.fetching || props.list.data.length==0){
		return <p className="text-center">Não existem resultados a disponibilizar.</p>
	}

	return(
		<section className="row">
			{renderList(props.list.data, props)}
		</section>
	);
}

List.propTypes = {
	list: PropTypes.object.isRequired,
	checkedList: PropTypes.array,
	checkEl: PropTypes.func,
	deleteSingle: PropTypes.func,
	editTarget: PropTypes.string,
	viewTarget: PropTypes.string,
	customTargets: PropTypes.array,
	titleKey: PropTypes.string,
	titleSuf: PropTypes.string,
	descriptionKey: PropTypes.string,
	slugKey: PropTypes.string
}