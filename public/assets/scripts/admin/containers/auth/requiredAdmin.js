'use strict';

import React from 'react';
import { connect } from 'react-redux';
import AppConfig from '#/appConfig';

import { addAlert } from '#/actions/alerts';
import { bindActionCreators } from 'redux';

// Alerts
import * as alertMessages from '#/actions/message-types';

// Utils
import { isNode } from '#/utils';

export function requireAuth(Component, data) {

    class AuthenticatedComponent extends React.Component {

        UNSAFE_componentWillMount() {
            this.checkAuth();
        }

        UNSAFE_componentWillReceiveProps() {
            this.checkAuth();
        }

        _isRole(){
            const { auth } = this.props;
            
            if (!data || !data.roles || !auth.data.user.role) 
                return true;

            const { roles } = data;

            return auth.isAuthenticated && roles.indexOf(auth.data.user.role)>=0;
        }

        checkAuth() {
            var localToken = !isNode && localStorage && localStorage.getItem('reda_uid_t') || null

            if (!this.props.isAuthenticated || !localToken || !this._isRole()) {
                /* let redirectAfterLogin = this.props.location.pathname; */
                !isNode && this.props.addAlert(alertMessages.NO_LOGIN, alertMessages.ERROR);

                const BASE_URL = `${AppConfig.domain}`;


                if(!isNode){
                    window.location.href = BASE_URL;
                }else{
                    this.props.history.push(`/`);
                }
            }
        }

        render() {
            return (
                <div>
                    {this.props.isAuthenticated === true
                        ? <Component {...this.props}/>
                        : null
                    }
                </div>
            )
        }
    }

    const mapStateToProps = (state) => ({
        isAuthenticated: state.auth.isAuthenticated,
        auth: state.auth,
        resource: state.resource.data
    });

    const mapDispatchToProps = (dispatch) => { 
      return bindActionCreators({ 
        addAlert
      }, dispatch);
    }
    
    return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
}