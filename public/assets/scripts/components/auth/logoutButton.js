'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

// Utils
import { removeClass } from '#/utils';

// Components
import { logout } from '#/actions/auth';


class LogoutButton extends Component {
  constructor(props){
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout(){
    this.props.logout();
    
    removeClass('open', Array.from(document.querySelectorAll(".open")));
    removeClass('filter-menu', Array.from(document.querySelectorAll(".filter-menu")));
    removeClass('admin-op-menu', Array.from(document.querySelectorAll(".admin-op-menu")));
    removeClass('site-menu', Array.from(document.querySelectorAll(".site-menu")));

    this.props.history.push('/');
  }

  render() {
    return (
      <li>
        <button onClick={this.logout} className="link-effect">Sair</button>
      </li>
    )
  }
}

LogoutButton.needs = [
  logout
]

export default connect(null, { logout })(withRouter(LogoutButton));