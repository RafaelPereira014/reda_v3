'use strict';
import { connect } from 'react-redux';
import { fetchContacts, addContact, resetContacts } from '#/actions/contacts';
import { addAlert } from '#/actions/alerts';
import { bindActionCreators } from 'redux';
import ContactForm from '#/components/resources/common/contactForm';

function mapStateToProps(state) {
  return { 
		contacts: state.contacts,
		auth: state.auth
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
		fetchContacts, 
		resetContacts,
		addContact,
		addAlert
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(ContactForm);