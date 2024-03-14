'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOMServer from 'react-dom/server';
import {Link} from 'react-router-dom';

// Utils
import { setDateFormat } from '#/utils';
import apiPath from '#/appConfig';

// Boostrap

// Components
import ConfirmBox from '#/containers/dashboard/common/confirmBox'; 
import GenericPopup from '#/components/common/genericPopup';
import TechFile from '#/components/resources/techFile';

// Utils
import { truncate } from '#/utils';

var renderButtons = (el, props) => {
	if (!props.actions){
		return null;
	}

	let approvalType = !el.approvedScientific && !el.approvedLinguistic ? " Cientificamente" : (el.approvedScientific && !el.approvedLinguistic ? " Linguisticamente" : "");
	
	return (
		<div className="actions fLeft">
			<ConfirmBox 
			continueAction={()=> props.setApprove(true, el.id, null)} 
			className="cta primary no-bg small" 
			title="Aprovar Proposta"
			text={"Tem a certeza que deseja aprovar" + approvalType + " esta proposta?"}>
              {"Aprovar" + approvalType}
            </ConfirmBox>
			<ConfirmBox 
			continueAction={(message, messagesList)=> props.setApprove(false, el.id, message, messagesList)} 
			className="cta primary no-bg small delete-action"
			title="Reprovar Proposta"
			text="Tem a certeza que deseja reprovar esta proposta? Indique o motivo."
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

var printPopupBody = (el, props) => {
	let author = el.User.name || (el.User.Registration && el.User.Registration.name)  || null;
	let organization = el.User.organization || (el.User.Registration && el.User.Registration.department)  || "Sem dados...";

	const { files } = props.config;
	const filesPath = files+"/scripts"+"/"+el.Resource.slug;

	return ReactDOMServer.renderToString(
		<section>
			<div className="row">
				<section className="col-xs-12">
					<span>Criada a <time>{setDateFormat(el.created_at, "LLL")}</time></span>
					<h6 title={el.Resource.title}>Recurso</h6>
					<p>{truncate(el.Resource.title, 10)}</p>
				</section>

				<section className="col-xs-12">
					<h6 title={author}>Autor</h6>
					<p>{author}</p>
				</section>
				<section className="col-xs-12">
					<h6 title={organization}>Organização</h6>
					<p>{organization}</p>
				</section>

				<section className="col-xs-12 op-proposal">
					<h6 title={el.operation}>Proposta de Operacionalização</h6>					
					<pre>
						{el.operation}
					</pre>
					
					{el.Files && el.Files.length>0 && 
						<div key={el.Files[0].id}>
							<a href={apiPath.domainClean+filesPath + "/" + el.Files[0].name + "." + el.Files[0].extension}  
								className="cta primary" 
								title="Descarregar Ficheiro"
								download>
									<i className="fa fa-download"></i>
									Descarregar documentos de apoio
							</a>
						</div>
					}
				</section>
			</div>

			{/* Tech File */}
			<TechFile details={el} maxCol={3} showTitle={false} />
		</section>
	);
	
}


var renderList = (list, props) => {	

	const { files } = props.config;
	

	return list.map((el) => {
		if (!el.Resource){
			return null;
		}
		const filesPath = files+"/scripts"+"/"+el.Resource.slug;

		return (
			<article className="col-xs-12" key={el.id}>
				<div className="list__element list__dashboard dashboard__element">
					<div className="check-element">
						<input type="checkbox" name={"selected-script"+el.id} id={"selected-script"+el.id} checked={props.checkedList.indexOf(el.id)>=0}/>
						<label htmlFor={"selected-script"+el.id} onClick={() => props.checkEl(el.id)}></label>
					</div>
					<div className="list__dashboard--container">
						<header className="list__dashboard--heading">
							<div className="left-col fLeft">
								<h1 title={el.Resource.title}>Recurso: {truncate(el.Resource.title, 10)}</h1>
								<span>Criada a <time>{setDateFormat(el.created_at, "LLL")}</time></span>
								<p>{truncate(el.operation, 40)}</p>	

								{ el.Files && el.Files.length>0 && 
									<div key={el.Files[0].id}>
										<a href={apiPath.domainClean+filesPath + "/" + el.Files[0].name + "." + el.Files[0].extension}  
											className="cta primary small margin__bottom--15" 
											title="Descarregar Ficheiro"
											download>
												<i className="fa fa-download"></i>
												Descarregar documentos de apoio
										</a>
									</div>
								}					      				      		
							</div>

							<div className="top-icons fRight">															
								<div className="type">
									{printStatus(el, props)}
								</div>		      				
							</div>				      		
						</header>

						<footer className="list__dashboard--footer">  
							{/*BUTTONS*/}
							{renderButtons(el, props)}
								
							<div className="fRight right-col">
								<Link to={"/recursos/detalhes-recurso/" + el.Resource.slug } className="cta primary outline small">Ver Recurso</Link>
								<GenericPopup
									dialogClass="fullwidth-dialog"
									description={printPopupBody(el, props)}
									title="Proposta de operacionalização"
									contentClass="script-dialog"
									className="cta primary outline small"
								>
									Ler Proposta
								</GenericPopup>
							</div>
						</footer>
					</div>
				</div>
			</article>
		);
    });
}

export const ScriptsList = (props) => {	
	if (!props.list || !props.list.data || props.list.fetching || props.list.data.length==0){
		return <p className="text-center">Não foram encontrados resultados.</p>
	}

	return(
		<section className="row">
			{renderList(props.list.data, props)}
		</section>
	);
}

ScriptsList.propTypes = {
	list: PropTypes.object.isRequired
}

ScriptsList.defaultProps = {
	actions: true
}