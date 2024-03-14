'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { 
    fetchBadwords, 
    deleteBadword,
    resetBadwords,
    addBadword
} from '#/actions/comments';
import { bindActionCreators } from 'redux';
import Badwords from '%/components/comments/badwords';

function mapStateToProps(state) {
  return { 
    badwords: state.badwords,
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchBadwords, 
    deleteBadword,
    resetBadwords,
    addBadword
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Badwords));