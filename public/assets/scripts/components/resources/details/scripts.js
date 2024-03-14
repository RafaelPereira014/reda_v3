'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import apiPath from '#/appConfig';
import { downloadFile } from '#/utils/ga';
import { setDateFormat } from '#/utils';


// Components
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import TechFile from '#/components/resources/techFile';
import IsInteractor from '#/containers/auth/isInteractor';

const renderScripts = (scripts, resourceData, filesPath, auth) => {
	return (
		<Tabs defaultActiveKey={1} className={"tabs-container scripts-container"+ (!scripts || scripts.length==0 ? " hide-tab" : "")} id="scripts-tabs">
			{scripts && scripts.length>=1 ? scripts.map((script, index) => {                

				let thisAuthor = script && script.User && script.User.Role && script.User.Role.type==='admin' ? 'Equipa REDA' : (script && script.User ? script.User.name : null);
				let thisOrganization = script.User.organization || "Sem dados...";

				return (					
					<Tab eventKey={index+1} title={"Proposta " + (index+1)} key={script.id} >
						{thisAuthor && <div className="row">
							<div className="col-xs-12">
								<label>Autor:</label>
								{thisAuthor}
							</div>
						</div>}
						<div className="row">
							<div className="col-xs-12">
								<label>Organização:</label>
								{thisOrganization}
							</div>
						</div>

						{ auth && auth.isAuthenticated && (auth.data.user.role === 'admin' || auth.data.user.role === 'editor' || auth.data.user.id===script.User.id) ?
							<div className="row">
								<div className="col-xs-12">
									<label>Criado a:</label>
									<span><time dateTime={setDateFormat(script.created_at, "YYYY-MM-DDThh:mm:ssTZD")}>{setDateFormat(script.created_at, "LLL")}</time></span>
								</div>
							</div>
						:
							null
						}

						<div className="row">
							<div className="col-xs-12 op-proposal">
								<label className="block">Proposta de Operacionalização</label>
								<div className="tinymce-text" dangerouslySetInnerHTML={{__html: script.operation}}></div>
								{/* <pre>
									{script.operation}
								</pre> */}
							</div>
						</div>
						
						{script.Files && script.Files.length>0 && 
							<div className="row">
								<div className="col-xs-12 op-proposal">
									{
										script.Files.map((file) => {
											return(
												<div key={file.id}>
													<a href={apiPath.domainClean+filesPath + "/" + file.name + "." + file.extension}  
														className="cta primary" 
														title="Descarregar Ficheiro"
														download
														onClick={(el) => downloadFile(el)}>
															<i className="fa fa-download"></i>
															Descarregar documentos de apoio
													</a>
												</div>
											)
										})
									}
								</div>
							</div>
						}

						{/* Tech File */}
						<TechFile details={script} maxCol={3} showTitle={false} showTopTaxs={true}/>
					</Tab>
				)				
			}) : null}
		</Tabs>
	)
}

const ScriptsList = (props) => {
	const { data, resource, resourceData, filesPath, auth } = props;
	if ((!data || data.length==0) && !resourceData.operation){
		return (
			<section className="scripts-detail">
				<div className="container text-center">
					<h1>Propostas de operacionalização</h1>
					<p>Contribua com uma nova proposta de operacionalização.</p>

					<IsInteractor>
						<div className="text-center no-script">
							<Link to={"/novaproposta/"+resource} className="cta primary outline">Publique a sua proposta</Link>
						</div>
					</IsInteractor>
				</div>
			</section>
		);
	}

	return(
		<section className="scripts-detail">
			<div className="container">
				<h1 className="text-center">Propostas de operacionalização</h1>
				{renderScripts(data, resourceData, filesPath, auth)}
				<IsInteractor>
					<div className="text-center scripts-options">
						<Link to={"/novaproposta/"+resource} className="cta primary outline">Adicionar nova proposta</Link>
						<Link to={"/gerirpropostas/"+resource} className="cta primary outline">Gerir as minhas propostas</Link>
					</div>
				</IsInteractor>
			</div>
		</section>
	);
}

ScriptsList.propTypes = {
	data: PropTypes.array,
	resourceId: PropTypes.number
}

export default ScriptsList