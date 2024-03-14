'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { resetNews, fetchNews, deleteNews } from '#/actions/news';
import { bindActionCreators } from 'redux';


function mapStateToProps(state) {
  return { 
    auth: state.auth,
    news: state.news
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    resetNews,
    fetchNews,
    deleteNews
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps);