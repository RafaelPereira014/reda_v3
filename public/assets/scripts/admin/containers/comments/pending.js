'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { 
  fetchPending, 
  setApproved,
  resetComments
} from '#/actions/comments';
import { bindActionCreators } from 'redux';
import PendingComments from '%/components/comments/pending';

function mapStateToProps(state) {
  return { 
    comments: state.comments,
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchPending, 
    setApproved,
    resetComments
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PendingComments));