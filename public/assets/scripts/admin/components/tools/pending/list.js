import React, { Fragment } from 'react';

//  Utils
import {setDateFormat} from '#/utils';

//  Components
import TableView from '%/components/common/table'
import ConfirmBox from '#/containers/dashboard/common/confirmBox'; 
import GenericPopup from '#/components/common/genericPopup';

export default (props) => {
    if(!props.list.data || props.list.data.length==0){
        return null;
    }

    let header = [
        'Título',
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
                                title={el.title}
                                btnTitle={`Ler descrição de ${el.title}`}
                                description={el.description}
                                className="btn__circle btn__circle--dark-green outline margin__right--10"
                                contentClass="text-left">
                                    <i className="fas fa-eye"></i>
                            </GenericPopup>
                            {
                                el.link && <a href={el.link.indexOf('http')>=0 ? el.link : `http://${el.link}`}
                                className="btn__circle btn__circle--dark-green outline margin__right--10"
                                title={"Abrir ferramenta: "+el.title}
                                target="_blank" rel="noopener noreferrer">
                                    <i className="fas fa-external-link-alt"></i>
                                </a>
                            }
                            
                
                            {el.title} <small><strong><em>(ID: {el.id})</em></strong></small>
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