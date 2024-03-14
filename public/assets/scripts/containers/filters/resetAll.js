'use strict';

import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { resetFilters } from '#/actions/filters';
import { bindActionCreators } from 'redux';

// Utils
import { isNode } from '#/utils';


export function resetAll(Comp) {

    class DesignatedComponent extends Component {
        constructor(props){
            super(props);

            this.resetAll = this.resetAll.bind(this);
        }

         UNSAFE_componentWillMount() {
            this.resetAll();
        }

         UNSAFE_componentWillReceiveProps() {
            this.resetAll();
        }

        resetAll(){
            this.props.resetFilters();

            !isNode && localStorage.setItem('filters', null);
        }

        render() {
            return (
                <Comp {...this.props}/>
            )
        }
    }

    const mapDispatchToProps = (dispatch) => { 
      return bindActionCreators({ 
        resetFilters,
      }, dispatch);
    }
    
    return connect(null, mapDispatchToProps)(DesignatedComponent);
}