'use strict';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// Components
import Modal from 'react-bootstrap/lib/Modal';


export default class GenericPopup extends Component {
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
      <Fragment>
        <button onClick={this.open} className={this.props.className} title={this.props.btnTitle || this.props.children}>{this.props.children}</button>
        <Modal show={this.state.showModal} onHide={this.close} dialogClassName={"generic-dialog "+this.props.dialogClass}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className={this.props.contentClass || "text-center"}>
            <p dangerouslySetInnerHTML={{__html: this.props.description}}/>
          </Modal.Body>
        </Modal>
      </Fragment>
    )
  }
}

GenericPopup.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  contentClass: PropTypes.string,
  dialogClass: PropTypes.string
}