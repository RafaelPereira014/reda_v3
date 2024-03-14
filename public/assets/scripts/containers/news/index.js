'use strict';
import { connect } from 'react-redux';
import { resetNews, fetchNews } from '#/actions/news';
import { resetConfig, fetchConfig } from '#/actions/config';
import { bindActionCreators } from 'redux';
import { withRouter } from "react-router-dom";


function mapStateToProps(state) {
  return { 
    news: state.news,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    resetNews,
    fetchNews,
    resetConfig,
    fetchConfig
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps);