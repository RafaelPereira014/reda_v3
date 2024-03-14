'use strict';

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import _ from 'lodash';

// Utils
import { toggleClass, removeClass, isNode } from '#/utils';
import { setScrollClass } from '#/utils/filters';
import { parseQS } from '#/utils/history';

// Components
import Collapsible from '#/components/common/collapse';
import { CheckboxGroup, Checkbox } from 'react-checkbox-group';
import SearchBar from '#/components/search/searchBar';
import HelpPopover from '#/components/common/helpPopover';

export default class ResourcesFilters extends Component {
  constructor(props) {
    super(props);

    //  Refs
    this.app__filter = React.createRef();
    this.backdrop = React.createRef();
    this.filters_list = React.createRef();

    //  State
    this.initialState = {
      terms: [],
      active_rels: [],
      update: false
    };

    this.state = this.initialState;

    this.topPos = null;

    //
    //	Submition
    //
    this.submitFilters = this.submitFilters.bind(this);

    //
    //	Change events
    //
    this.termsChange = this.termsChange.bind(this);
    this.getRelated = this.getRelated.bind(this);
    this.toggleList = this.toggleList.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.setInitialState = this.setInitialState.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    //
    //	Renders
    //
    this.renderTerms = this.renderTerms.bind(this);
  }

  async componentDidMount() {

    if (!isNode) {
      window.addEventListener('scroll', _.debounce(this.handleScroll, 100));
    }

    await this.props.fetchTaxonomies([
			{
				key: "type",
				value: "rec"
			},
			{
				key: "terms",
				value: true
			},
			{
				key: "exclude",
				value: [
					'tags_resources'
				]
			}
		], false);

    // Are there any filters from localStorage or state?
    var localFilters =
      !isNode && localStorage && JSON.parse(localStorage.getItem('filters'));

    // Has queryString?
    if (this.props.location.search && !_.isEmpty(this.props.location.search)) {
      var query = parseQS(this.props.location.search);

      this.setInitialState({
        terms: query.termos || [],
      });

      // Has filters on state?
    } else if (this.props.filters.data != null) {
      this.setInitialState(
        this.props.filters.data.filters || this.props.filters.data
      );

      // If anything else fails, has filters on localstorage?
    } else if (localFilters && localFilters.filters) {
      this.setInitialState(localFilters.filters);
    }
  }

  // Reset filters on unmount
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);

    //this.props.resetYears();
    this.props.resetRecTerms();

    //	Remove open class from body on unmount
    removeClass('open', document.getElementsByTagName('BODY')[0]);
    removeClass('filter-menu', document.getElementsByTagName('BODY')[0]);
  }

  componentDidUpdate(prevProps) {

    // Did I try to reset from pressing the NEW SEARCH option, making parentFilters empty?
    if (
      this.props.location.pathname == prevProps.location.pathname &&
      this.props.location.key != prevProps.location.key &&
      _.isEmpty(this.props.parentFilters)
    ) {
      this.clearAll();

      //If previous state is different, then warn container
    } else if (
      this.state.update &&
      this.props.location.pathname == prevProps.location.pathname &&
      this.props.location.key == prevProps.location.key
    ) {
      this.submitFilters();
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props.taxonomies.fetched!=nextProps.taxonomies.fetched || nextState.update===true;
  }

  // Set filters class based on scroll
  handleScroll() {
    if (
      this.app__filter &&
      this.props.resources &&
      this.props.resources.length > 0
    ) {
      let el = this.app__filter.current;
      let elTop = el.getBoundingClientRect().top;

      if (!this.topPos && elTop) {
        this.topPos =
          el.getBoundingClientRect().top +
          (window.pageYOffset || document.documentElement.scrollTop || 0);
      }

      if (this.topPos) {
        setScrollClass(el, 'filters--fixed', this.topPos);
      }
    }
  }

  // Set initial state on mount
  setInitialState(state) {
    const { terms } = state;

    let finalData = {
      terms:
        (terms &&
          terms.length > 0 &&
          (typeof terms === 'string'
            ? [parseInt(terms)]
            : terms.map(term => parseInt(term)))) ||
        [],
      update: true
    };

    finalData.active_rels = this.getRelated(finalData.terms);

    // Set state based on the built data
    this.setState(finalData);

    this.submitFilters(finalData);
  }

  // Change list statue
  toggleList() {
    let list = this.filters_list;
    let backdrop = this.backdrop;
    let body = document.getElementsByTagName('BODY')[0];

    toggleClass('open', list.current);
    toggleClass('open', backdrop.current);
    toggleClass('open', body);
    toggleClass('filter-menu', body);
  }

  //
  //	On submit
  //
  submitFilters(state) {
    // Change filters
    this.props.onFilterChange(state || this.state);

    // Disable update
    this.setState({ update: false });
  }

  //
  //	Clear all filters
  //
  clearAll() {
    this.setState({
      ...this.initialState,
      update: true
    });

    !isNode && localStorage.setItem('filters', null);

    /*if (this.props.resetParent){
			this.props.resetParent();
		}*/
  }

  //
  //	Handle Changes
  //
  termsChange(data) {
    let active_rels = this.getRelated(data);
    this.setState({
      terms: data,
      update: true,
      active_rels
    });    
  }

  //
  //  Check if selected has related and get the list
  //
  getRelated(selected){
    const { data } = this.props.taxonomies;
    let finalStruct = [];

    let withRelationships = data && data.filter( tax => tax.topRelLevel && tax.topRelLevel>0);


    withRelationships.map( (tax) => {
      finalStruct['pos_'+tax.topRelLevel] = [];

      let selectedTerms = tax.Terms.filter( term => selected.indexOf(term.id)>=0);

      selectedTerms.map( (terms) => {
        terms.Relationship.map( rel => finalStruct['pos_'+tax.topRelLevel].push(parseInt(rel.id)));
      });

    });
    
    return finalStruct;
  }

  //
  //	RENDER DATA
  //
  // Render terms list
  renderTerms(){
    const { data } = this.props.taxonomies;
    
		if (!data || data.length==0){
			return null;
    }
    
		
		return(			
			<Fragment>
				{data.map( (item) => {
          let isOpen = false;
					if(item.Terms && item.Terms.length>0){
            
            let curList = item.Terms && item.Terms.map((term) => {
              let rels = null;
              // If has level and is not first
              if(item.topRelLevel && item.topRelLevel>1){
              // For each term, get relationships
              // If relationship is in active relationships based on upper level                              
                if(term.Relationship.length>0){
                  rels = term.Relationship.filter((rel) => {
                    let exists = true;

                    for(var i = parseInt(item.topRelLevel)-1; i>=1; i--){
                      if(this.state.active_rels['pos_'+(i)] && this.state.active_rels['pos_'+(i)].length>0){
                        exists = exists ? this.state.active_rels['pos_'+(i)].indexOf(parseInt(rel.id))>=0 : exists;
                      }else{
                        exists = false;
                      }
                    }

                    return exists;                            
                  
                  });
                }
              }
              
              if(item.topRelLevel==1 || item.topRelLevel==null || (rels!==null && rels.length>0)){
                isOpen = isOpen == false ? this.state.terms.indexOf(term.id)>=0 : isOpen;
                return (
                  <div key={term.id} className="col-xs-12">
                    <Checkbox value={term.id} id={"term-"+term.id}/> 
                    <label htmlFor={"term-"+term.id}>{term.title}</label>
                  </div>
                )	
              }
              return null;
              
            }).filter( el => el!=null);

            // If gets empty in the begining, remove all selected
            {/* if(!isOpen){
              let removeTerms = item.Terms && item.Terms.reduce((acc, cur) => {
                return [...acc, cur.id]
              }, []);

              let finalTerms = this.state.terms.filter( term => removeTerms.indexOf(term)<0);
              this.setState({
                terms:  finalTerms,
                update: true
              })
              return null;
            } */}

            if (curList && curList.length>0){

              return (
                <Collapsible 
                  title={item.title} 
                  iconOpen="fa fa-chevron-up" 
                  iconClosed="fa fa-chevron-down" 
                  isOpen={isOpen} 
                  key={item.id}
                >
                  <CheckboxGroup
                      name="terms"
                      value={this.state.terms}
                      onChange={this.termsChange}
                      hide={['todos']}
                    >
                      
                        <div className="row">
                        {curList}
                        </div>
                  </CheckboxGroup>
                </Collapsible>
              );
            }


            return null;
					}
				})}
			</Fragment>
		)
	}

  render() {
    const { taxonomies } = this.props;
    if (!taxonomies.data){
      return null;
    }
      

    return (
      <div className="app__filter" ref={this.app__filter}>
        <div className="backdrop" ref={this.backdrop} onClick={this.toggleList} />
        <div className="row filters-button">
          <div className="col-xs-12">
            <button className="cta primary outline" onClick={this.toggleList}>
              <i className="fa fa-filter" />Pesquise por...
            </button>
          </div>
        </div>
        <div className="row filters__list" ref={this.filters_list}>
          {/* Title */}
          <div className="col-xs-10 filters__list--title">
            <h6>Pesquise por:</h6>
          </div>
          {/* Close Button */}
          <div className="col-xs-2 filters__list--close">
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={this.toggleList}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="col-xs-12 filter-search-container">
            <HelpPopover
              className="fa fa-question-circle form-help fRight"
              id="tags_popover"
              placement="right"
              title="Utilize a vírgula, o ponto e vírgula ou a tecla ENTER para separar as palavras ou expressões. Na sua pesquisa utilize também o singular/plural ou forma derivada da palavra-chave."
            />
            <SearchBar
              onSubmit={this.props.onSubmit}
              onChangeTags={this.props.onChangeTags}
              tags={this.props.tags}
            />
          </div>
          <div className="col-xs-12 filters__list--elements">
            {this.renderTerms()}
          </div>
          <div className="col-xs-12 filters__list--submit">
            <button className="cta primary" onClick={this.toggleList}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }
}

ResourcesFilters.propTypes = {
  recterms: PropTypes.object.isRequired,
  taxonomies: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  resetParent: PropTypes.func,
  location: PropTypes.object.isRequired,
  parentFilters: PropTypes.object
};