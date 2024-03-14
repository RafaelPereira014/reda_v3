'use strict';

import { connect } from 'react-redux';
import { fetchResources, setHighlights, setFavorites, resetResources } from '#/actions/resources';
import { fetchConfig } from '#/actions/config';
import { bindActionCreators } from 'redux';
import RecentResources from '#/components/resources/recent';

function mapStateToProps(state) {
  return { 
    resources: state.resources,
    auth: state.auth,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchResources, 
    fetchConfig,
    setHighlights, 
    setFavorites,
    resetResources
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(RecentResources);