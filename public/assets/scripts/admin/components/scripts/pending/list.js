import React, { Fragment } from 'react';

//  Utils
import {setDateFormat, truncate, isNode} from '#/utils';

//  Components
import TableView from '%/components/common/table'
import ConfirmBox from '#/containers/dashboard/common/confirmBox'; 
import GenericPopup from '#/components/common/genericPopup';
import ReactDOMServer from 'react-dom/server';
import TechFile from '#/components/resources/techFile';

import apiPath from '#/appConfig';

const printPopupBody = (el, props) => {
	let author = el.User.name || null;
	let organization = el.User.organization || "Sem dados...";

	const { files } = props.config;
	const filesPath = files+"/scripts"+"/"+el.Resource.slug;

    var div = null;
    if(!isNode){
        div = document.createElement("div");
        div.innerHTML = el.operation;
    }
    

	return ReactDOMServer.renderToString(
		<section>
			<div className="row">
				<section className="col-xs-12">
					<span>Criada a <time dateTime={setDateFormat(el.created_at, "YYYY-MM-DDThh:mm:ssTZD")}>{setDateFormat(el.created_at, "LLL")}</time></span>
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
					<h6 title={div ? div.innerText : el.operation}>Proposta de Operacionalização</h6>					
					<div className="tinymce-text" dangerouslySetInnerHTML={{__html: el.operation}}></div>
					
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

export default (props) => {
    if(!props.list.data || props.list.data.length==0){
        return null;
    }

    let header = [
        'Recurso',
        'Data de criação',
        'Submetido por...',        
    ]

    if(props.activeKey!=='all'){
        header.push(['Ações']);
    }else{
        header.push(['Aprovado...']);
    }

    return (
        <TableView
            data={props.list.data}
            header={header}
            responsive={true}
            tableClass="stripped"
            totalPages={props.list.totalPages}
            onPageChange={props.onPageChange}
            activePage={props.activePage}
            clickEvent={props.onClick}
            RenderRow={
                (
                    {
                        el                        
                    }
                ) => (
                    <Fragment>
                        <td>

                            <GenericPopup
                                dialogClass="fullwidth-dialog"
                                description={printPopupBody(el, props)}
                                title="Proposta de operacionalização"
                                btnTitle="Ler proposta"
                                contentClass="script-dialog"
                                className="btn__circle btn__circle--dark-green outline margin__right--10"
                            >
                                <i className="fas fa-eye"></i>
                            </GenericPopup>

                            {el.Resource.title} <small><strong><em>(ID: {el.id})</em></strong></small>
                        </td>
                        <td>{setDateFormat(el.created_at, "LLL")}</td>
                        <td>{el.User ? el.User.name : ''}</td>
                        <td className="vMiddle">
                            {
                                props.activeKey!=='all' &&
                                    <Fragment>
                                        <ConfirmBox 
                                            continueAction={()=> props.setApprove(true, el, null)} 
                                            className="btn__circle btn__circle--c2 outline" 
                                            title={"Aprovar " + (props.activeKey==='scientific' ? "científicamente" : "linguísticamente")}
                                            text={"Tem a certeza que deseja aprovar " + (props.activeKey==='scientific' ? "científicamente" : "linguísticamente")+" este recurso?"}>
                                                <i className="fas fa-check"></i>
                                        </ConfirmBox>

                                        <ConfirmBox 
                                            continueAction={(message, messagesList)=> props.setApprove(false, el, message, messagesList)} 
                                            className="btn__circle btn__circle--c3 outline"
                                            title="Reprovar Recurso"
                                            text="Tem a certeza que deseja reprovar este recurso? Indique o motivo."
                                            message={"Indique outro motivo de reprovação do recurso..."}
                                            messagesList={props.disapproveMessages}
                                            dialogType="disapprove-dialog">
                                                <i className="fas fa-times"></i>
                                        </ConfirmBox>
                                    </Fragment>
                            }

                            {/* Scientific */}
                            {props.activeKey==='all' && el.approvedScientific===1  && 
                                <button
                                    type="button"
                                    className="btn__circle btn__circle--c1 disabled"
                                    title="Científicamente"
                                >
                                    C
                                </button>
                            }

                             {/* Linguistic */}
                             {props.activeKey==='all' && el.approvedLinguistic===1  && 
                                <button
                                    type="button"
                                    className="btn__circle btn__circle--c2 disabled"
                                    title="Linguísticamente"
                                >
                                    L
                                </button>
                            }
                        </td>
                    </Fragment>
                )
            }
            />
    )
}