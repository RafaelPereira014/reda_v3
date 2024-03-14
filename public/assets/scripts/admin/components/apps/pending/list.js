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
                            <GenericPopup 
                                title={el.title}
                                btnTitle={`Ler descrição de ${el.title}`}
                                description={el.description}
                                className="btn__circle btn__circle--dark-green outline margin__right--10"
                                contentClass="text-left">
                                    <i className="fas fa-eye"></i>
                            </GenericPopup> 
                
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