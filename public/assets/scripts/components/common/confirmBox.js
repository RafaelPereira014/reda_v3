'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Utils
import { removeClass } from '#/utils';

// Components
import Modal from 'react-bootstrap/lib/Modal';

export default class ConfirmBox extends Component {
  constructor(props){
    super(props);

    this.state = {showModal: false};

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.continueAction = this.continueAction.bind(this);

  }

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
    this.props.continueAction(this.props.continueActionArgs || null);
    this.close();
  }


  render() {
    // Set target
    let text = this.props.text || "Tem a certeza que pretende confirmar?";
    let title = this.props.title || "Eliminar elemento(s)";

    return (
      <span className="confirm-box">
        <button className={this.props.className} onClick={this.open} title={this.props.title}>{this.props.children}</button>
        <Modal show={this.state.showModal} onHide={this.close} dialogClassName="confirm__box">
          <Modal.Header closeButton>
            <section>
              <i className={this.props.topIcon || "fa fa-user"}></i>
            </section>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <p className="text-center">{text}</p>
          </Modal.Body>
          <Modal.Footer >
            <button className="cta primary" title="Tenho a certeza!" onClick={this.continueAction}>Tenho a certeza!</button>
            <button className="cta primary outline no-border" title="Não, obrigado!" onClick={this.close}>Não, obrigado!</button>
          </Modal.Footer>
        </Modal>
      </span>
    )
  }
}

ConfirmBox.propTypes = {
  className: PropTypes.string
}