'use strict';

import { Component } from 'react';
import { connect } from 'react-redux';

class IsAuthenticated extends Component {

    render() {
        return (
            this.props.isAuthenticated === true ? this.props.children : null       
        )
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(IsAuthenticated);