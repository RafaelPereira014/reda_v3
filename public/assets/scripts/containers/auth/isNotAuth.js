'use strict';

import { Component } from 'react';
import { connect } from 'react-redux';

class IsNotAuthenticated extends Component {

    render() {
        return (
            this.props.isAuthenticated === false ? this.props.children : null          
        )
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(IsNotAuthenticated);