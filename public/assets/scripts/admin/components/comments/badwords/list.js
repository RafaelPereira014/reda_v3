import React, { Fragment } from 'react';

//  Utils
import {setDateFormat} from '#/utils';

//  Components
import TableView from '%/components/common/table'
import ConfirmBox from '#/containers/dashboard/common/confirmBox'; 

export default (props) => {
    if(!props.list || !props.list.data || props.list.data.length==0){
        return null;
    }

    let header = [
        'Título',
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
                        <td>
                            <ConfirmBox 
                                continueAction={()=> props.deleteWord(el)} 
                                className="btn__circle btn__circle--danger outline" 
                                title={"Apagar palavra"}
                                text={"Tem a certeza que deseja apagar esta palavra?"}>
                                    <i className="far fa-trash-alt"></i>
                            </ConfirmBox>
                        </td>                      
                    </Fragment>
                )
            }
            />
    )
}