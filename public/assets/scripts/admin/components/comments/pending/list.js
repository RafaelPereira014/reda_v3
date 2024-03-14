import React, { Fragment } from 'react';

//  Utils
import {setDateFormat} from '#/utils';

//  Components
import TableView from '%/components/common/table'
import ConfirmBox from '#/containers/dashboard/common/confirmBox'; 
import GenericPopup from '#/components/common/genericPopup';

export default (props) => {
    if(!props.list || !props.list.data || props.list.data.length==0){
        return null;
    }

    let header = [
        'Recurso',
        'Data de criação',
        'Submetido por...',
        'Ações'
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
            RenderRow={
                (
                    {
                        el
                    }
                ) => (
                    <Fragment>
                        <td>
                            <GenericPopup 
                                title={el.Resource.title}
                                btnTitle={`Ler descrição de ${el.Resource.title}`}
                                description={el.text}
                                className="btn__circle btn__circle--dark-green outline margin__right--5"
                                contentClass="text-left">
                                    <i className="fas fa-eye"></i>
                            </GenericPopup> 
                            <a href={"/recursos/detalhes-recurso/"+el.Resource.slug}
                            className="btn__circle btn__circle--dark-green outline margin__right--10"
                            title={"Abrir detalhes do recurso: "+el.Resource.title}
                            target="_blank"
                            rel="noopener noreferrer">
                                <i className="fas fa-external-link-alt"></i>
                            </a>
                
                            {el.Resource.title} <small><strong><em>(ID: {el.id})</em></strong></small>
                        </td>
                        <td>{setDateFormat(el.created_at, "LLL")}</td>
                        <td>{el.User ? el.User.name : ''}</td>
                        <td className="vMiddle">

                            <Fragment>
                                <ConfirmBox 
                                    continueAction={()=> props.setApprove(true, el, null)} 
                                    className="btn__circle btn__circle--c2 outline" 
                                    title={"Aprovar comentário"}
                                    text={"Tem a certeza que deseja aprovar este comentário?"}>
                                        <i className="fas fa-check"></i>
                                </ConfirmBox>

                                <ConfirmBox 
                                    continueAction={(message, messagesList)=> props.setApprove(false, el, message, messagesList)} 
                                    className="btn__circle btn__circle--c3 outline"
                                    title="Reprovar comentário"
                                    text="Tem a certeza que deseja reprovar este comentário? Indique o motivo."
                                    message={"Indique outro motivo de reprovação do comentário..."}
                                    messagesList={props.disapproveMessages}
                                    dialogType="disapprove-dialog">
                                        <i className="fas fa-times"></i>
                                </ConfirmBox>
                            </Fragment>

                        </td>
                    </Fragment>
                )
            }
            />
    )
}