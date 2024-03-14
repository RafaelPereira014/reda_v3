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
                            {el.title} <small><strong><em>(ID: {el.id})</em></strong></small>
                        </td>
                        <td>{setDateFormat(el.created_at, "LLL")}</td>
                        <td>{el.User ? el.User.name : ''}</td>
                        <td className="vMiddle">
                            <a href={"/editarferramenta/"+el.slug}
                                className="btn__circle btn__circle--dark-green outline margin__right--10"
                                title={"Editar aplicação: "+el.title}
                                target="_blank"
                                rel="noopener noreferrer">
                                    <i className="fas fa-pen"></i>
                            </a>
                          <ConfirmBox 
                                continueAction={() => props.deleteEl(el.slug)} 
                                className="btn__circle btn__circle--c3 outline"
                                title="Eliminar ferramenta"
                                text="Tem a certeza que deseja eliminar esta ferramenta?">
                                    <i className="far fa-trash-alt"></i>
                            </ConfirmBox>
                        </td>
                    </Fragment>
                )
            }
            />
    )
}