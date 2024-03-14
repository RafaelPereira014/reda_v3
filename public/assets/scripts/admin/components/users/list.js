import React, { Fragment } from 'react';

//  Utils
import {setDateFormat} from '#/utils';

//  Components
import TableView from '%/components/common/table'
import Dropdown from '#/components/common/dropdown';
import ConfirmBox from '#/containers/dashboard/common/confirmBox'; 

export default (props) => {
    if(!props.list.data || props.list.data.length==0){
        return null;
    }

    let header = [
        'Nome',
        'E-mail',
        'Organização',
        'Criado a',
        'Tipo de utilizador',
        'Ações',
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
                            {el.name} {el.status===false && <small><strong><em>(não confirmado)</em></strong></small>}
                        </td>
                        <td>{el.email}</td>
                        <td>{el.organization}</td>
                        <td>{setDateFormat(el.created_at, "LLL")}</td>
                        <td style={{minWidth: '120px'}}>
                            {props.otherData && props.otherData.roles.data && props.otherData.roles.data.length>0 ? 
                                <Dropdown
                                    list={props.otherData.roles.data}
                                    listValue="type"
                                    listTitle="value"
                                    startValue={el.Role.type}
                                    onChange={props.events.onDropdownChange}
                                    onChangeParams={{userId: el.id}}
                                />
                                :
                                <span className="text-center">{el.Role.value}</span>
                            }
                        </td>
                        <td className="vMiddle">
                            <ConfirmBox 
                                continueAction={() => props.events.deleteUser(el.id)} 
                                className="btn__circle btn__circle--c3 outline"
                                title="Eliminar utilizador"
                                text="Tem a certeza que deseja eliminar este utilizador?">
                                    <i className="far fa-trash-alt"></i>
                            </ConfirmBox>
                        </td>
                    </Fragment>
                )
            }
            />
    )
}