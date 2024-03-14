'use strict';

import React, { Component } from 'react';

// Utils
import { isNode } from '#/utils';

export default class SignupConfirmComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
        confirmed: null
    }
  }

  componentDidMount() {
    if(this.props.match.params && this.props.match.params.token){
        this.props.confirmSignup(this.props.match.params.token)
        .then(() => {
            // Are there any errors?
            this.setState({confirmed: true});
            
            if(!isNode){
                localStorage.setItem('returnTo', '/');
            }

        }).catch(() => {
            this.setState({confirmed: false});
        });
    }
  }

  render() {
    const { errors, fetched } = this.props.auth;

    return (
      <div className="confirm-signup light-background padding__topbottom--60">
          <div className="container">
            <div className="row">
                <div className="col-xs-12">
                    {this.state.confirmed && !errors && fetched &&
                        <React.Fragment>
                            <h1>O seu registo foi confirmado com sucesso!</h1>
                            <h1>Agora já pode entrar na REDA!</h1>
                        </React.Fragment>              
                    }

                    {this.state.confirmed && errors && fetched &&
                        <React.Fragment>
                            <h1>Ocorreram erros na confirmação do seu registo</h1>
                            <div className="alert alert-danger margin__top--30" role="alert">
                                <span>{errors || ''}</span>
                            </div>  
                        </React.Fragment>
                    }                 
                </div>
            </div>
          </div>
      </div>
    )
  }
}

SignupConfirmComponent.propTypes = {
}