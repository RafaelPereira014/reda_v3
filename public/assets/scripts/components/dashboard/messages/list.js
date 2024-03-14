import React, { Component, Fragment } from 'react';

// Components
import {Link} from 'react-router-dom';

// Bootstrap
import Pagination from 'react-bootstrap/lib/Pagination';

// Utils
import { setDateFormat } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import _ from 'lodash';

import IsAdmin from '#/containers/auth/isAdmin';
import IsInteractorNotAdmin from '#/containers/auth/isInteractorNotAdmin';

export default class MessagesList extends Component{
    _ismounted = false;
    
    constructor(props){       

        super(props);

        this.initialState = {
            activePage: 1,
            limit: 12,
        }
        
        this.state = this.initialState;

        //
        //  Renders
        //
        this.renderList = this.renderList.bind(this);

        //
        //  Event Handlers
        //
        this.onChangePage = this.onChangePage.bind(this);
    }

    async componentDidMount() {
        this._ismounted = true;
        
        // Set initial data
        let initialData = this.state;
        
        // Has queryString for filters?
		// 
		//
		// ALSO CHANGE IN searchForm.js TO UPDATE STATE
		// 		
		if(this.props.location.search && !_.isEmpty(this.props.location.search)){
			var query = parseQS(this.props.location.search);

			const { 
				pagina, 
			} = query;

			initialData.activePage = pagina ? parseInt(pagina) : initialData.activePage;
		}

        if(this._ismounted){
			let settingState = {
				activePage: initialData.activePage || 1,
			}

			this.setState(settingState);

			setQueryString(initialData, {history: this.props.history}, this.props.location)
        }
        
        this.props.fetchUserContacts(initialData);
    }

    componentDidUpdate(prevProps, prevState){
        if (prevState.activePage!=this.state.activePage){
            // Update querystring only if routing key is the same
            if (this.props.location.key == prevProps.location.key){	 			
                setQueryString(this.state, {history: this.props.history}, this.props.location);
            }
        }
    }

    componentWillUnmount(){
        this._ismounted = false;
        this.props.resetContacts();
    }

    onChangePage(page){

        let tempState = {
            limit: this.state.limit,
            activePage: page            
        }

        if(page){
            this.setState({
                activePage: page
            });
        }

        this.props.fetchUserContacts(tempState);
    }
    
    renderList(){
        const { contacts } = this.props;

        return (
            <div className="table-responsive margin__top--15 ">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Recurso</th>
                            <th>Última mensagem</th>
                            <th title="Número de mensagens">Nº mens.</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            contacts.data.map(contact => 
                                <tr className={"message" + (contact.isNew && contact.didInteract ? " unread" : " read")} key={contact.id}>
                                    <td style={{width: '55%'}} className="vMiddle">
                                        {
                                            contact.isNew && contact.didInteract ? <span className="status unread" title="Não lida"></span> : null
                                        }
                                        
                                        <Link to={'/'+ (this.props.basePath || 'painel') +'/mensagens/'+contact.slug} className={"cta black no-bg" + (contact.isNew && contact.didInteract ? " margin__left--30" : "")} title={(contact.isNew && contact.didInteract ? '(Não lida) ' : '') + contact.title}>{contact.title}</Link>          
                                    </td>
                                    <td className="vMiddle">
                                        {
                                            contact.Contacts && contact.Contacts.length>0 && 
                                            <Fragment>
                                                <strong>{contact.Contacts[0].User.name}</strong>
                                                <br/>
                                                <em>{setDateFormat(contact.Contacts[0].created_at, "LLL")}</em>
                                            </Fragment>
                                        }
                                        
                                    </td>
                                    <td className="text-center vMiddle">
                                        {contact && contact.Contacts ? contact.Contacts.length : 0}
                                    </td>
                                    <td className="vMiddle">
                                        <Link to={'/'+ (this.props.basePath || 'painel') +'/mensagens/'+contact.slug} className="cta primary outline small round">
                                            <i className="fa fa-chevron-right"></i>
                                        </Link>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }

    render(){
        const { contacts } = this.props;

        if(!contacts || !contacts.data){
            return <div className="text-center margin__top--30">
                Não existem mensagens a mostrar.
            </div>;
        }

        return(
            <div className="messages_list">
				<div className="row">
					<div className="col-xs-12">
                        <IsAdmin>
                            <h2 className="pannel-title">Mensagens de contacto de todos os administradores</h2>
                        </IsAdmin>
                        <IsInteractorNotAdmin>
                            <h2 className="pannel-title">As suas mensagens</h2>                            
                        </IsInteractorNotAdmin>
					</div>
				</div>
				<div className="row">
					{contacts.data.length>0 ?
						<div className="col-xs-12">
							<h6 className="border-bottom">{contacts.total} resultados</h6>
							{this.renderList()}

							{/* Pagination */}
							{(() => {
								if (contacts.totalPages>1){
									return <Pagination
                                        prev
                                        next
                                        first
                                        last
                                        ellipsis
                                        boundaryLinks
                                        items={contacts.totalPages}
                                        maxButtons={5}
                                        activePage={this.state.activePage}
                                        onSelect={this.onChangePage} />
								}
							})()}
						</div>
					:
						<div className="row">
							<p className="text-center">Não foram encontrados resultados.</p>
						</div>
					}
				</div>
			</div>
        )
    }
}