import React, { Fragment } from 'react';

//  Utils
import {setDateFormat} from '#/utils';

//  Components
import TableView from '%/components/common/table'

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
                          <a href={`${props.detailsUrl}${el.slug}`}
                            className="btn__circle btn__circle--dark-green outline margin__right--10"
                            title={"Abrir detalhes: "+el.title}
                            target="_blank"
                            rel="noopener noreferrer">
                                <i className="fas fa-eye"></i>
                            </a>
                        </td>
                    </Fragment>
                )
            }
            />
    )
}