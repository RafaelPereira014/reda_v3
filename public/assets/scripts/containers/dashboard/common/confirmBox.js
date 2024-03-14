'use strict';

import { connect } from 'react-redux';
import { 
  fetchMessages
} from '#/actions/messages';
import { bindActionCreators } from 'redux';
import ConfirmBox from '#/components/dashboard/common/confirmBox';

function mapStateToProps(state) {
  return { 
    messages: state.messages
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchMessages
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(ConfirmBox);