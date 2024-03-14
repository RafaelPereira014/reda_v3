'use strict';

import { connect } from 'react-redux';
import { fetchConfig } from '#/actions/config';
import { fetchFromChannel, fetchFromPlaylist } from '#/actions/videos';
import { bindActionCreators } from 'redux';
import AboutIndex from '#/components/about';

function mapStateToProps(state) {
  return { 
    auth: state.auth,
    config: state.config,
    videos: state.videos
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchConfig,
    fetchFromChannel,
    fetchFromPlaylist
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(AboutIndex);