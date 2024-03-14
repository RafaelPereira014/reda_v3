import React, { Component } from 'react';

// Components
/* import {Link} from 'react-router-dom'; */

export default class TopBar extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { auth } = this.props;

        if(!auth.data || !auth.isAuthenticated){
            return null;
        }

        return(
            <div className="top-bar">
                <div className="container-fluid">
                    <div className="text-right">
                        {auth.data.user.name} <a onClick={this.props.logout} href="/" title="Sair" className="btn__circle outline logout__btn">
                            <i className="fas fa-sign-out-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}