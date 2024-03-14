'use strict';

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import TaxList from '%/components/taxonomies';

import { 
  fetchTaxonomies, 
  searchTaxonomies,
  resetTaxonomies,
  deleteTaxonomy,
} from '#/actions/taxonomies';

function mapStateToProps(state) {
  return { 
    auth: state.auth,
    config: state.config,
    taxonomies: state.taxonomies
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchTaxonomies, 
    searchTaxonomies,
    resetTaxonomies, 
    deleteTaxonomy
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TaxList));