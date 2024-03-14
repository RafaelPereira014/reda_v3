import React, { Fragment } from 'react';

//  Utils
import {setDateFormat} from '#/utils';

//  Components
import TableView from '%/components/common/table'
import ConfirmBox from '#/containers/dashboard/common/confirmBox'; 

export default (props) => {
    if(!props.list.data || props.list.data.length==0){
        return null;
    }

    let header = [
        'Título',
        'Data de criação',
        'Submetido por...',
        'Aprovação',
        'Ativar'        
    ]



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
                            <a href={"/recursos/detalhes-recurso/"+el.slug}
                            className="btn__circle btn__circle--dark-green outline margin__right--10"
                            title={"Abrir detalhes do recurso: "+el.title}
                            target="_blank"
                            rel="noopener noreferrer">
                                <i className="fas fa-eye"></i>
                            </a>
                            {el.title} <small><strong><em>(ID: {el.id})</em></strong></small>
                        </td>
                        <td>{setDateFormat(el.created_at, "LLL")}</td>
                        <td>{el.User ? el.User.name : ''}</td>
                        <td className="vMiddle">
                          
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
                            {/* hidden */}
                            <td className="vMiddle">
                            <ConfirmBox 
                                            continueAction={()=> props.undoHidden(el)} 
                                            className="btn__circle btn__circle--c2 outline"
                                            title="Ativar Recurso"
                                            text="Tem a certeza que pretende voltar a ativar este recurso?"


                                            dialogType="disapprove-dialog">
                                                <i className="fas fa-check"></i>
                                        </ConfirmBox>
                        </td>
                    </Fragment>
                )
            }
            />
    )
}