'use strict';

import { Component } from 'react';
import { connect } from 'react-redux';

class IsAdmin extends Component {

    render() {
        return (
            this.props.isAuthenticated === true && this.props.data && this.props.data.user && this.props.data.user.role == 'admin'
                ? this.props.children
                : null                
        )
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    data: state.auth.data
});

export default connect(mapStateToProps)(IsAdmin);