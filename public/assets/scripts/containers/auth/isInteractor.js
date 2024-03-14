'use strict';

import { Component } from 'react';
import { connect } from 'react-redux';

class IsInteractor extends Component {
    constructor(props){
        super(props);
        this.allowedUsers = ['admin', 'teacher', 'editor'];
    }

    render() {
        return (
            this.props.isAuthenticated === true && this.props.data && this.props.data.user && this.allowedUsers.indexOf(this.props.data.user.role)>=0
                ? this.props.children
                : null                
        )
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    data: state.auth.data
});

export default connect(mapStateToProps)(IsInteractor);