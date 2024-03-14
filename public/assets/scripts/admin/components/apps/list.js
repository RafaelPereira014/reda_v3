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
        'Lojas',
        'Data de criação',
        'Submetido por...',
    ]

    if(props.activeKey!=='all'){
        header.push(['Ações']);
    }else{
        header.push(['Aprovado...']);
    }

    let icons = {
        'ios': <i  key={'ios'} className="fab fa-apple"></i>,
        'android': <i  key={'android'} className="fab fa-android"></i>,
        'windows': <i  key={'windows'} className="fab fa-windows"></i>
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
                        <td>
                            {
                                el.Taxonomies.map((tax) => {
                                    if(tax.slug.indexOf('sistemas')>=0 && tax.Terms && tax.Terms.length>0){
                                        return tax.Terms.map((system, index) => 
                                            <a href={system.metadata.indexOf('http')>=0 ? system.metadata : `http://${system.metadata}`} 
                                                key={system.id || index}
                                                title={`Ver na Loja (${system.title})`}
                                                className="btn__circle btn__circle--dark-green outline margin__right--5"
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                {
                                                    Object.keys(icons).map(key => system.slug.indexOf(key)>=0 ? icons[key] : null)
                                                }
                                            </a>
                                        )
                                    }
                                })     			
                            }
                        </td>
                        <td>{setDateFormat(el.created_at, "LLL")}</td>
                        <td>{el.User ? el.User.name : ''}</td>
                        <td className="vMiddle">
                            <a href={"/editarapp/"+el.slug}
                                className="btn__circle btn__circle--dark-green outline margin__right--10"
                                title={"Editar aplicação: "+el.title}
                                target="_blank"
                                rel="noopener noreferrer">
                                    <i className="fas fa-pen"></i>
                            </a>
                          <ConfirmBox 
                                continueAction={() => props.deleteEl(el.id)} 
                                className="btn__circle btn__circle--c3 outline"
                                title="Eliminar aplicação"
                                text="Tem a certeza que deseja eliminar esta aplicação?">
                                    <i className="far fa-trash-alt"></i>
                            </ConfirmBox>
                        </td>
                    </Fragment>
                )
            }
            />
    )
}