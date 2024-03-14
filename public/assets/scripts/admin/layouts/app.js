'use strict';

import React from 'react';
import { Component, Fragment } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

//  Components
import AlertBox from '#/containers/common/alerts';
import SideMenu from "%/containers/common/sideMenu";
import TopBar from "%/containers/common/topbar";

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      title: 'Dashboard - REDA'
    };
  }

  render() {
    return (
      <Fragment>
        <DocHead data={this.state} location={this.props.location}/>
        <AlertBox delay={7000}/>
        <SideMenu {...this.props}/>
        <main className="page-container dashboard">
          <TopBar />          
          <div className="body-container">
            {this.props.children}
          </div>
          
        </main>        
      </Fragment>
    );
  }
}

export default App;