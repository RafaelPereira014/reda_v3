'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import UsersOverview from '%/components/overview/month/users';

//  Dispatch
import { searchMonthUsers, resetUsers } from '#/actions/user';

function mapStateToProps(state) {
  return { 
      users: state.users
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({
    searchMonthUsers,
    resetUsers 
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UsersOverview));