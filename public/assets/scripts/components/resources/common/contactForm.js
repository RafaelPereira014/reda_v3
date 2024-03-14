'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Actions
import * as alertMessages from '#/actions/message-types';

// Components
import Modal from 'react-bootstrap/lib/Modal';

// Utils
import { removeClass, setDateFormat } from '#/utils';

export default class ContactForm extends Component{
	constructor(props){
		super(props);

		this.initialState = {
			showModal: false,
			showList: true,
			showForm: false,
			message: "",
			filters: {
				activePage: 1,
				limit: 5
			}
		};

		this.state = this.initialState;

		//
		//	Handle events
		//
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.showForm = this.showForm.bind(this);
		this.submitForm = this.submitForm.bind(this);
		this.setMessage = this.setMessage.bind(this);
		this.getContacts = this.getContacts.bind(this);
		this.moreContacts = this.moreContacts.bind(this);

		//
		//	Renders
		//
		this.renderHistory = this.renderHistory.bind(this);
		this.renderForm = this.renderForm.bind(this);
	}

	componentDidMount() {
		this.getContacts();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.filters.activePage!=this.state.filters.activePage){
			this.getContacts();
		}     
	}

	getContacts(){
		const { resource, fetchContacts } = this.props;

		resource && fetchContacts({resource}, this.state.filters);
	}

	moreContacts(){
		this.setState({
			...this.state,
			filters:{
				...this.state.filters,
				activePage: this.state.filters.activePage+1
			}			
		});
	}

	submitForm(){

		this.props.addContact({message:this.state.message}, this.props.resource)
		.then(() => {
			const { errorMessage, errorStatus } = this.props.contacts;

			// Dispatch errors to form if any
			if (errorMessage || errorStatus){
				this.props.addAlert(alertMessages.ALERT_SERVER_ERROR, alertMessages.ERROR);

			}else{        
				let message = alertMessages.ALERT_CONTACT_CREATE_SUCCESS;

				this.props.addAlert(message, alertMessages.SUCCESS);
				this.close();
			}
		})
	}

	setMessage(val){
		this.setState({
			message: val.target.value
		})
	}

	open(){
		removeClass('open', Array.from(document.querySelectorAll(".open")));
		removeClass('filter-menu', Array.from(document.querySelectorAll(".filter-menu")));
		removeClass('admin-op-menu', Array.from(document.querySelectorAll(".admin-op-menu")));
		removeClass('site-menu', Array.from(document.querySelectorAll(".site-menu")));

		this.setState({showModal: true});

		this.getContacts();
	}

	close(){
		this.props.resetContacts();
		this.setState(this.initialState);
	}

	showForm(){
		this.setState({
			showForm: !this.state.showForm,
			showList: !this.state.showList
		})
	}

	renderForm(){
		return(
			<section className="text-center">
				<textarea style={{"width":"100%"}} className="padding__topbottom--10 padding__leftright--10" rows="5"placeholder={this.props.message} onChange={this.setMessage}>{this.state.message}</textarea>
				<button className="cta primary margin__top--15" onClick={ () => this.submitForm()}>Enviar mensagem</button>
			</section>
		)
	}

	renderHistory(){
		const { contacts } = this.props;


		if (!contacts.data || contacts.data.length==0){
			return null;
		}

		return contacts.data.map((el, idx) => {
			return (
				<article key={el.id}>
					{idx>0 && 
						<hr />
					}

					<header>
						<small>{setDateFormat(el.created_at, "LLL")}</small>
						<h6>{el.User.name}</h6>
					</header>

					<p>{el.description}</p>					
				</article>
			)
		});
	}

	render(){

		// Set target
		let title = this.props.title || "";

		return (
			<span className="confirm-box" >
				<button className={this.props.className} onClick={this.open} title={this.props.title}>{this.props.children}</button>
				<Modal show={this.state.showModal} onHide={this.close} dialogClassName="confirm__box contact__form">
					<Modal.Header closeButton>	            
						<Modal.Title>{title}</Modal.Title>	            
					</Modal.Header>
					<Modal.Body>
						{!this.state.showList &&
							<button className="cta primary no-bg go-back" onClick={() => this.showForm()}><i className="fa fa-chevron-left"></i> Voltar</button>
						}
						{this.state.showList &&
							<section className="text-center margin__bottom--30">
						<button className="cta primary outline" title="Enviar Mensagem" onClick={() => this.showForm()}>Enviar nova mensagem</button>
							</section>
					}
						{this.state.showList ?	            	
							<section>
								<hr />
								<h5 className="margin__bottom--30 text-center">Mensagens enviadas pelo administrador</h5>
								{this.props.contacts && this.props.contacts.total && this.props.contacts.total>0 ? 
									<div>
										{this.renderHistory()}
										{this.props.contacts && this.props.contacts.data && this.props.contacts.total>this.props.contacts.data.length &&
											<div className="text-center">
												<button className="cta primary no-bg" title="Mais mensagens" onClick={this.moreContacts}>Carregar mais...</button>
											</div>
										}
									</div>
								:
									<div className="text-center">
										<i>Não foram ainda enviadas mensagens.</i>
									</div>
								}

							</section>

							:

							this.renderForm()
					}
					
					</Modal.Body>
					<Modal.Footer >
						<button className="cta primary outline no-border" title="Fechar" onClick={() => this.close()}>Fechar</button>
					</Modal.Footer>
				</Modal>
			</span>
		)
	}
}

ContactForm.propTypes = {
  className: PropTypes.string
}