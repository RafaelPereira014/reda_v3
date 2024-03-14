'use strict';

import { connect } from 'react-redux';
import { fetchTestimonials } from '#/actions/testimonials';
import { addAlert } from '#/actions/alerts';
import { bindActionCreators } from 'redux';
import TestimonialsBlock from '#/components/blocks/testimonials';

function mapStateToProps(state) {
  return { 
    testimonials: state.testimonials,
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchTestimonials, 
    addAlert
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(TestimonialsBlock);