'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { fetchUserContacts, resetContacts } from '#/actions/contacts';
import { bindActionCreators } from 'redux';
import MessagesList from '#/containers/dashboard/messages';

function mapStateToProps(state) {
  return { 
    auth: state.auth,
    contacts: state.contacts
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchUserContacts,
    resetContacts
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MessagesList));