'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Utils
import { removeClass } from '#/utils';

// Components
import {Modal} from 'react-bootstrap';

export default class VideoOpen extends Component {
  constructor(props){
    super(props);

    this.state = {showModal: false};

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

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

  render() {
    return (
      <span className="video__open">
        <button  className={this.props.className} onClick={this.open}>{this.props.children}</button>
        <Modal show={this.state.showModal} onHide={this.close} dialogClassName="video__modal">
          <Modal.Header closeButton>
            <h6>{this.props.title}</h6>
          </Modal.Header>
          <Modal.Body >
            {this.props.body}
          </Modal.Body>
        </Modal>
      </span>
    )
  }
}

VideoOpen.propTypes = {
  className: PropTypes.string
}