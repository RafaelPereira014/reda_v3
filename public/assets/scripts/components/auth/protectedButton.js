'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import Modal from 'react-bootstrap/lib/Modal';

import LoginFormContainer from '#/containers/auth/loginForm';

export default class ProtectedButton extends Component {
  constructor(props){
    super(props);

    this.state = {showModal: false};

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

  }

  open(){
    this.setState({showModal: true});
  }

  close(){
    this.setState({showModal: false});
  }


  render() {
    return (
      <div className="protected-button">
        <button onClick={this.open} className={this.props.className}>{this.props.children}</button>
        <Modal show={this.state.showModal} onHide={this.close} dialogClassName="login-dialog">
          <Modal.Header closeButton>
            <section>
              <i className="fa fa-lock"></i>
            </section>
            <Modal.Title>Parece que ainda não se autenticou na plataforma...</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p>
              Para que tenha acesso a todos os recursos disponíveis, terá de efetuar a sua autenticação.
            </p>
            <p>
              Caso ainda não esteja registado, aproveite esta oportunidade para o <Link to="/registar" className="cta primary no-bg simple">fazer</Link>!
            </p>
            <LoginFormContainer target={this.props.target}/>
          </Modal.Body>
          <Modal.Footer>
            <p>
              Não é professor? Não deixe de explorar esta plataforma.
            </p>
            <Link to="/ligacoes/sugestoes" className="cta primary outline small">Sugestões</Link>
            <Link to="aplicacoes" className="cta primary outline small">Aplicações</Link>
            {/*<Link to="noticias" className="cta primary outline small">Notícias</Link>*/}            
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

ProtectedButton.propTypes = {
  className: PropTypes.string,
  target: PropTypes.string.isRequired
}