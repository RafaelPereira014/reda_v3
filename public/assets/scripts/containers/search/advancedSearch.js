'use strict';

import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { fetchRecTerms, resetRecTerms } from '#/actions/recterms';
import { fetchTaxonomies, resetTaxonomies } from '#/actions/taxonomies';
import { searchResourcesFilters, setFiltersResources, resetFiltersResources } from '#/actions/filters';
import { bindActionCreators } from 'redux';
import AdvancedSearch from '#/components/search/advancedSearch';

class AdvancedSearchContainer extends Component {
  _isMounted = false;
    constructor(props){
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    async componentDidMount(){
      this._isMounted = true;

      if (this.props.location.pathname !== '/recursos'){
        await this.props.resetFiltersResources();
      }
    }

    componentWillUnmount(){
      this._isMounted = false;
    }


    //
    //  Submit search form
    //
    async onSubmit(filters){
      if(this.props.onSubmit){
        this.props.onSubmit({
          activePage: filters.activePage,
          terms: filters.terms
        })
        /* else{
          this.props.searchResourcesFilters(filters)
        } */

        if(this._isMounted){
          const { 
          terms, 
          activePage
          } = filters;
          
          if (this.props.location.pathname !== '/recursos'){
            await this.props.resetFiltersResources();
          }else{
            this.props.setFiltersResources({
              ...this.props.filtersResources.data,
              terms,
              activePage
            });
          }          
        }     
      }       
    }

    render() {
        return (
            <AdvancedSearch {...this.props} onSubmit={this.onSubmit}/>
        );
    }
}

function mapStateToProps(state) {
  return { 
    filtersResources: state.filtersResources,
    taxonomies: state.taxonomies,

  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchRecTerms,
    resetRecTerms,
    fetchTaxonomies,
    resetTaxonomies,
    setFiltersResources,
    searchResourcesFilters,
    resetFiltersResources
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchContainer);