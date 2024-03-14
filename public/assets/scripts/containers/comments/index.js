'use strict';

import { connect } from 'react-redux';
import { fetchComments, deleteComment } from '#/actions/comments';
import { addAlert } from '#/actions/alerts';
import { bindActionCreators } from 'redux';
import ResourceComments from '#/components/resources/comments/list';

function mapStateToProps(state) {
  return { 
		comments: state.comments,
		auth: state.auth
  };
}

function mapDispatchToProps(dispatch) { 
	return bindActionCreators({ 
		fetchComments, 
		deleteComment,
		addAlert
	}, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(ResourceComments);