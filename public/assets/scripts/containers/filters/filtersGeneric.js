'use strict';

import { connect } from 'react-redux';
import { fetchTaxonomies, resetTaxonomies } from '#/actions/taxonomies';
import { getFilters, resetFilters, setFilters } from '#/actions/filters';
import { bindActionCreators } from 'redux';
import GenFilters from '#/components/common/filters/generic';

function mapStateToProps(state) {
  return { 
    auth: state.auth,
    filters: state.filters,
    taxonomies: state.taxonomies
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    setFilters,
    getFilters,
    resetFilters,
    fetchTaxonomies,
    resetTaxonomies
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(GenFilters);