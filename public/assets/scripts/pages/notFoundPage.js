'use strict';

import React from 'react';
import { Component } from 'react';
import { withRouter } from "react-router-dom";

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import BottomNav from '#/components/navigation/bottomNav';

class NotFoundPage extends Component {
  constructor(props) {
    super(props);
    
    this.backClick = this.backClick.bind(this);
  }

  backClick(){
    this.props.history.goBack()
  }

  render() {
    let data = {
      title: "Página não encontrada - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location} background="noWhite"/>
        <div className="page-not-found light-background">
          <div className="container">
            <div className="col-xs-10 col-xs-offset-1 text-center">
              <h1>Oops! Não foi possível encontrar a página pretendida.</h1>
              <p>Talvez seja melhor <button onClick={this.backClick} className="cta primary outline">Voltar</button></p>
            </div>
          </div>          
        </div>
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}

export default withRouter(NotFoundPage);