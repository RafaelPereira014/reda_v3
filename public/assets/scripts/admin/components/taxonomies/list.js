import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

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
        'Tipo',
        'Data de criação',     
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
                        <td>{el.Type ? el.Type.title : ''}</td>
                        <td>{setDateFormat(el.created_at, "LLL")}</td>        
                        <td className="vMiddle">
                            <Link
                                to={`/dashboard/taxonomias/${el.slug}`}
                                className="btn__circle btn__circle--c1 outline" >
                                    <i className="fas fa-pen"></i> 
                            </Link>
                            {
                                !el.locked && 
                                <ConfirmBox 
                                    continueAction={()=> props.deleteEl(el)} 
                                    className="btn__circle btn__circle--danger outline" 
                                    title={"Apagar taxonomia"}
                                    text={"Tem a certeza que deseja apagar esta taxonomia?"}>
                                        <i className="fas fa-trash"></i>
                                </ConfirmBox>
                            }
                        </td>                
                    </Fragment>
                )
            }
            />
    )
}