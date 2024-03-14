'use strict';
import { connect } from 'react-redux';
import { resetNews, getNewsDetails } from '#/actions/news';
import { resetConfig, fetchConfig } from '#/actions/config';
import { bindActionCreators } from 'redux';


function mapStateToProps(state) {
  return { 
    newsDetail: state.newsDetail,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    resetNews,
    getNewsDetails,
    resetConfig,
    fetchConfig
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps);