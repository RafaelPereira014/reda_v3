'use strict';

import { connect } from 'react-redux';
import ContributeBlock from '#/components/blocks/contribute';

function mapStateToProps(state) {
  return { 
    auth: state.auth
  };
}


export default connect(mapStateToProps, null)(ContributeBlock);