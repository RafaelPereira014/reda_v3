import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

// Actions
import * as alertMessages from '#/actions/message-types';

// Utils
import { setDateFormat, scrollToBottom } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';

export default class MessagesDetailsList extends Component{
    _ismounted = false;
    constructor(props){
        super(props);

        this.initialState = {
            /* activePage: 1,
            limit: 12, */
            message: ""
        }
        
        this.state = this.initialState;

        //
        //  Helpers
        //
        this.getContacts = this.getContacts.bind(this);
        /* this.moreContacts = this.moreContacts.bind(this); */

        //
        //  Renders
        //
        this.renderList = this.renderList.bind(this);
        this.renderForm = this.renderForm.bind(this);

        //
        //  Event Handlers
        //
        this.onChangePage = this.onChangePage.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.setMessage = this.setMessage.bind(this);
    }

    async componentDidMount() {
        this._ismounted = true;
        const { auth } = this.props;
        await this.props.fetchContacts(this.props.match.params, this.state);
        scrollToBottom();

        const { contacts } = this.props;

        // Set contact as READ if is new
        if(contacts && contacts.resource && contacts.resource.isNew){
            this.props.setContactRead(this.props.match.params.resource)
        }

        // Set all messages as READ
    }

    componentWillUnmount(){
        this._ismounted = false;
        this.props.resetContacts();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.activePage!=this.state.activePage){
            this.getContacts();            
        }
   }

    async getContacts(){
		const { match, contacts, fetchContacts } = this.props;
        if(this._ismounted){
            await fetchContacts(match.params, this.state);
            scrollToBottom();
        }
        
	}

	/* moreContacts(){
		this.setState({
            activePage: this.state.filters.activePage+1	
		});
	} */

    onChangePage(page){
        const { auth } = this.props;

        let tempState = {
            ...this.state,
            activePage: page            
        }

        if(page){
            this.setState({
                activePage: page
            });
        }

        this.props.fetchUserContacts(auth.data.user.id, tempState);
    }

    setMessage(val){
		this.setState({
			message: val.target.value
		})
	}

    async submitForm(){
		const { resource, auth } = this.props;

        if(this._ismounted){
            await this.props.addContact({message:this.state.message}, this.props.match.params.resource);
            
            const { errorMessage, errorStatus } = this.props.contacts;

            // Dispatch errors to form if any
            if (errorMessage || errorStatus){
                this.props.addAlert(alertMessages.ALERT_SERVER_ERROR, alertMessages.ERROR);

            }else{        
                let message = alertMessages.ALERT_CONTACT_CREATE_SUCCESS;

                this.props.addAlert(message, alertMessages.SUCCESS);

                this.getContacts(this.initialState);
                
            }
        }
    }
    
    renderForm(){
		return(
			<section className="padding__top--30 margin__top--15 margin__bottom--30 text-left border-top">
                <h6 className="margin__bottom--15">Responder...</h6>
				<textarea style={{"width":"100%"}} className="padding__topbottom--10 padding__leftright--10" rows="5" placeholder="Escreva a sua mensagem" onChange={this.setMessage} value={this.state.message}></textarea>
				<button className="cta primary margin__top--15" onClick={ () => this.submitForm()}>Enviar resposta</button>
			</section>
		)
	}
    
    renderList(){
        const { contacts, auth } = this.props;

		if (!contacts.data || contacts.data.length==0){
			return null;
        }
        

        return contacts.data.map((el, idx) => {
			return (
				<article key={el.id} className={"floating" + (el.User && el.User.id===auth.data.user.id ? " me" : "")}>
					<header className="margin__bottom--20">						
                        {
                            el.User ? <h6>{el.User.name}</h6> : null
                        }						
					</header>
                        
                    <div className="content">
                        <p>{el.description}</p> 
                        <small><em><time dateTime={el.created_at}>{setDateFormat(el.created_at, "LLL")}</time></em></small>
                    </div>
					                   			
				</article>
			)
		});
    }

    render(){
        const { contacts } = this.props;

        if(!contacts || !contacts.data || !contacts.resource){
            return null;
        }

        return(
            <div className="messages_list">
				<div className="row">
					<div className="col-xs-12">
						<h2 className="pannel-title">Mensagens de contacto</h2>
					</div>
				</div>
				<div className="row">
					{contacts.data.length>0 ?
						<div className="col-xs-12">
							<h6 className="border-bottom margin__bottom--15">
                                Recurso: <Link to={'/recursos/detalhes-recurso/'+contacts.resource.slug} className="cta primary no-bg padding--0" style={{fontSize: "18px"}}><em>{contacts.resource.title}</em></Link>
                            </h6>
							{this.renderList()}							
						</div>
					:
						<div className="row">
							<p className="text-center">Não foram encontrados resultados.</p>
						</div>
					}
				</div>

                <div className="row">
                    <div className="col-xs-12">
                        {this.renderForm()}
                    </div>
                </div>
			</div>
        )
    }
}