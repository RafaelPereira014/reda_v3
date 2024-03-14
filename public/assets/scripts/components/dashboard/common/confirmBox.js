'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Utils
import { removeClass } from '#/utils';

// Components
import Modal from 'react-bootstrap/lib/Modal';
import CheckboxGroup from '#/components/common/checkboxGroup';

export default class ConfirmBoxDashboard extends Component {
  constructor(props){
    super(props);

    this.state = {
      showModal: false,
      message: null,
      messageBox: null,
      selectedMessages: []
    };

    

    //
    //  Renders
    //
    this.renderMessages = this.renderMessages.bind(this);

    //
    //  Event Handlers
    //
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.continueAction = this.continueAction.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.setMessages = this.setMessages.bind(this);
  }

  /* UNSAFE_componentWillUpdate(nextProps, nextState) {
    return JSON.stringify(nextProps) != JSON.stringify(this.props) || JSON.stringify(nextState) != JSON.stringify(this.state)
  } */

  open(){
    removeClass('open', Array.from(document.querySelectorAll(".open")));
    removeClass('filter-menu', Array.from(document.querySelectorAll(".filter-menu")));
    removeClass('admin-op-menu', Array.from(document.querySelectorAll(".admin-op-menu")));
    removeClass('site-menu', Array.from(document.querySelectorAll(".site-menu")));

    this.setState({showModal: true});
  }

  close(){
    this.setState({showModal: false});
  }

  continueAction(){
    this.props.continueAction(this.state.message, this.state.selectedMessages);
    this.close();
  }

  // Set selected messages from checkbox
  setMessages(val){
    this.setState({
      selectedMessages: val
    });
  }

  // Set custom message via textarea
  setMessage(val){
    this.setState({
      message: val.target.value
    });
  }

  renderMessages(){
    const { messagesList } = this.props;

    if(messagesList && messagesList.data && messagesList.data.length>0) { 

      let messageSection = '';
      let bodyElements = [];

      return (
        <div className="confirm-messages">
          {
            messagesList.data.map(mesEl => {
              bodyElements = [];

              if (messageSection!=mesEl.typeTitle){
                messageSection = mesEl.typeTitle;
                
                bodyElements = [
                  <h3 key={mesEl.id+'_title'}>{messageSection}</h3>
                ]
              }

              bodyElements.push(
                <CheckboxGroup 
                key={mesEl.id}
                data={[mesEl]}
                descKey="message"
                value={this.state.selectedMessages} 
                onChange={this.setMessages} 
                name="messages-group"
                colClass="col-xs-12"/>
              )
              return bodyElements;
            }
          )}
        </div>
      )
    }

    return null;
  }


  render() {
    const { messagesList, dialogType } = this.props;

    // Set target
    let text = this.props.text || "Tem a certeza que pretende confirmar?";
    let title = this.props.title || "Eliminar elemento(s)";

    return (
      <span className="confirm-box">
        <button  className={this.props.className} onClick={this.open}>{this.props.children}</button>
        <Modal show={this.state.showModal} onHide={this.close} dialogClassName={dialogType || ""}>
          <Modal.Header closeButton>
            <section>
              <i className="fa fa-user"></i>
            </section>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <p className="text-center">{text}</p>
            {this.renderMessages()}
            {this.props.message && messagesList && messagesList.data && messagesList.data.length>0 && 
              <h3>Outros</h3>
            }
            {this.props.message &&
              <textarea className="popup-textarea" placeholder={this.props.message} onChange={this.setMessage}>{this.state.message}</textarea>
            }
          </Modal.Body>
          <Modal.Footer>
            <button className="cta primary" onClick={this.continueAction}>Tenho a certeza!</button>
            <button className="cta primary outline no-border" onClick={this.close}>Não, obrigado!</button>
          </Modal.Footer>
        </Modal>
      </span>
    )
  }
}

ConfirmBoxDashboard.propTypes = {
  className: PropTypes.string,
  messagesList: PropTypes.object,
  dialogType: PropTypes.string,
  continueAction: PropTypes.func,
  title: PropTypes.string,
  text: PropTypes.string,
  message: PropTypes.string
}