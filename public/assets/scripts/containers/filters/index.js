'use strict';

import { connect } from 'react-redux';
import { fetchRecTerms, resetRecTerms } from '#/actions/recterms';
import { fetchTaxonomies, resetTaxonomies } from '#/actions/taxonomies';
import { setFilters, getFilters, resetFilters, searchResourcesFilters } from '#/actions/filters';
import { bindActionCreators } from 'redux';
import ResourcesFilters from '#/components/resources/common/filters';

function mapStateToProps(state) {
  return { 
    recterms: state.recterms,
    taxonomies: state.taxonomies,
    filters: state.filters
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchRecTerms,
    resetRecTerms,
    fetchTaxonomies,
    resetTaxonomies,
    setFilters,
    getFilters,
    resetFilters,
    searchResourcesFilters
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(ResourcesFilters);