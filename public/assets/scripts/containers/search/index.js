'use strict';

import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { fetchRecTerms, resetRecTerms } from '#/actions/recterms';
import { fetchTaxonomies, resetTaxonomies } from '#/actions/taxonomies';
import { searchResourcesFilters, setFiltersResources, resetFiltersResources } from '#/actions/filters';
import { bindActionCreators } from 'redux';
import SearchForm from '#/components/search/searchForm';

// Utils
import { scrollToTop } from '#/utils';
let hashtags = null;
class SearchContainer extends Component {

  constructor(props){
    super(props);

    this.state = {
      updated: false
    }



    this.onSubmit = this.onSubmit.bind(this);


  }

componentDidMount(){
  
  if (!this.props.location.pathname.includes("/recursos")){
   this.props.resetFiltersResources();
  }
  



  if(this.props.location.state != null || this.props.location.state != undefined){


    hashtags = this.props.location.state.hashtag


        // Request new resources
  // Save filters for further use
  // Redirect to results page
  let finalFilters = {
    filters: [],
    tags: [hashtags],
    activePage: 1
  }
  this.props.searchResourcesFilters(finalFilters)

    this.props.setFiltersResources(finalFilters);
    this.setState({updated: true})


  }
}



  componentDidUpdate(){





    // Update only if not in resources listing and is to explicitly update
    if (this.props.location.pathname !== '/recursos' && this.state.updated){
      this.setState({ updated: false });
      scrollToTop();
      this.props.history.push('/recursos');
    }



    

  }



  //
  //  Submit search form
  //
  async onSubmit(filters){
    //
    
    if (this.props.location.pathname !== '/recursos'){

      await this.props.resetFiltersResources();
    }
    
    let finalFilters = {};

    if(this.props.filtersResources.data){

      
     
      finalFilters = {
        ...this.props.filtersResources.data,
        tags: filters.tags,
        activePage: 1
      }
    }else{

      finalFilters = {
        filters: [],
        tags: filters.tags,
        activePage: 1
      }
    }
      

    // Request new resources
    // Save filters for further use
    // Redirect to results page
    this.props.searchResourcesFilters(finalFilters)
    .then(async () => {
      this.props.setFiltersResources(finalFilters);
      this.setState({updated: true})
    });
  }

	render() {



		return (

      <SearchForm {...this.props}  onSubmit={this.props.onSubmit || this.onSubmit}/> 


		);
	}
}

function mapStateToProps(state) {
  return { 
    filtersResources: state.filtersResources
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchRecTerms,
    resetRecTerms,
    fetchTaxonomies,
    resetTaxonomies,
    setFiltersResources,
    resetFiltersResources,
    searchResourcesFilters
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchContainer));