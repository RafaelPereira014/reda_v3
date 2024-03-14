'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { 
    searchUsers,
    updateUsers,
    setRole,
    deleteUser
} from '#/actions/user';
import { fetchRoles } from '#/actions/roles';
import { bindActionCreators } from 'redux';
import UsersManage from '%/components/users';

function mapStateToProps(state) {
  return { 
    users: state.users,
    auth: state.auth,
    roles: state.roles
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    searchUsers,
    updateUsers,
    fetchRoles,
    setRole,
    deleteUser
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UsersManage));