'use strict';

import { connect } from 'react-redux';
import { fetchHighlights, resetHighlights } from '#/actions/resources';
import { bindActionCreators } from 'redux';
import ResourceHighlights from '#/components/resources/highlights';

function mapStateToProps(state) {
  return { 
		highlights: state.highlights,
		auth: state.auth,
		resources: state.resources
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
		fetchHighlights,
		resetHighlights
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceHighlights);