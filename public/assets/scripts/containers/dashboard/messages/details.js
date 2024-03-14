'use strict';

import { connect } from 'react-redux';

import { withRouter } from "react-router-dom";

import { fetchContacts, resetContacts, addContact, setContactRead } from '#/actions/contacts';
import { addAlert } from '#/actions/alerts';
import { bindActionCreators } from 'redux';
import MessagesDetails from '#/components/dashboard/messages/details/list';

function mapStateToProps(state) {
  return { 
    auth: state.auth,
    contacts: state.contacts
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchContacts,
    resetContacts,
    addContact,
    addAlert,
    setContactRead
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MessagesDetails));