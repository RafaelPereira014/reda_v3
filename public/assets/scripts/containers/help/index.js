'use strict';

import { connect } from 'react-redux';
import { fetchConfig } from '#/actions/config';
import { fetchFromPlaylist } from '#/actions/videos';
import { bindActionCreators } from 'redux';
import HelpIndex from '#/components/help';

function mapStateToProps(state) {
  return { 
    config: state.config,
    videos: state.videos
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchConfig,
    fetchFromPlaylist
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(HelpIndex);