'use strict';

import { connect } from 'react-redux';
import TeacherBlock from '#/components/blocks/teacher';

function mapStateToProps(state) {
  return { 
    auth: state.auth
  };
}


export default connect(mapStateToProps, null)(TeacherBlock);