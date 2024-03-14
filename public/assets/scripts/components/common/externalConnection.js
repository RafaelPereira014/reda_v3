'use strict';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// Components
import Modal from 'react-bootstrap/lib/Modal';

// Utils
import { setUrl } from '#/utils';
import ReactGA from 'react-ga';


export default class ExternalConnection extends Component {
  constructor(props){
    super(props);

    this.state = {showModal: false};

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onContinue = this.onContinue.bind(this);

  }

  open(){
    this.setState({showModal: true});
  }

  close(){
    this.setState({showModal: false});
  }

  onContinue(){
    this.setState({showModal: false});

    ReactGA.ga('send', 'event', this.props.type, 'External', setUrl(this.props.target));
  }


  render() {
    
    return (
      <Fragment>
        <button onClick={this.open} className={this.props.className} title={this.props.title}>{this.props.children}</button>
        <Modal show={this.state.showModal} onHide={this.close} dialogClassName="external__connection">
          <Modal.Header closeButton>
            <Modal.Title>Está a sair do sítio REDA!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Está a sair do sítio REDA da Direção Regional de Educação dos Açores.  A DRE não se responsabiliza nem tem qualquer controlo sobre as opiniões expressas ou a informação externa à plataforma. Os termos e condições bem como as políticas de privacidade da plataforma REDA não se aplicam à página que irá aceder.</p>
            <p>Obrigado por nos visitar e volte sempre!</p>
          </Modal.Body>
          <Modal.Footer >
            <a href={setUrl(this.props.target)} className="cta primary" target="_blank" rel="noopener noreferrer" title="Compreendi" onClick={() => this.onContinue()}>Compreendi</a>
            <button className="cta primary outline no-border"  title="Não, obrigado!" onClick={() => this.close()}>Não, obrigado!</button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    )
  }
}

ExternalConnection.propTypes = {
  className: PropTypes.string,
  target: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string
}

ExternalConnection.defaultProps = {
  type: 'Link'
}