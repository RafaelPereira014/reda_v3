'use strict';

import { connect } from 'react-redux';
import profileNav from '#/components/navigation/profileNav';

function mapStateToProps(state) {
  return { 
    auth: state.auth
  };
}

export default connect(mapStateToProps, null)(profileNav);