'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Share
import {
  ShareButtons,
  generateShareIcon,
} from 'react-share';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');

// Components
import Modal from 'react-bootstrap/lib/Modal';

// Utils
import { isNode } from '#/utils';

// Config
import appConfig from '#/appConfig';

export default class SharePopup extends Component {
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
    const { data } = this.props;

    if (!data){
      return null;
    }
    
    return (
      <span>
        <button onClick={this.open} className={this.props.className}>{this.props.children}</button>
        <Modal show={this.state.showModal} onHide={this.close} dialogClassName="share-dialog">
          <Modal.Header closeButton>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <section>
              <FacebookShareButton
                url={!isNode && window.location.href || appConfig.domain}
                
                quote={data.description}
                className="network__share--button">
                <FacebookIcon
                  size={50}
                  round />
              </FacebookShareButton>

              <TwitterShareButton
                url={!isNode && window.location.href || appConfig.domain}
                title={data.title}
                className="network__share--button">
                <TwitterIcon
                  size={50}
                  round />
              </TwitterShareButton>

              <GooglePlusShareButton
                url={!isNode && window.location.href || appConfig.domain}
                title={data.title}
                className="network__share--button">
                <GooglePlusIcon
                  size={50}
                  round />
              </GooglePlusShareButton>

              <LinkedinShareButton
                 url={!isNode && window.location.href || appConfig.domain}
                title={data.title}
                className="network__share--button">
                <LinkedinIcon
                  size={50}
                  round />
              </LinkedinShareButton>
            </section>
          </Modal.Body>
        </Modal>
      </span>
    )
  }
}

SharePopup.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string
}