'use strict';

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import _, { set } from 'lodash';






// Utils
import { toggleClass, removeClass, isNode } from '#/utils';
import { setScrollClass } from '#/utils/filters';
import { parseQS } from '#/utils/history';
import * as relsUtils from '#/utils/termsRelationships';
import apiPath from '#/appConfig';



// Components
import Picky from "react-picky";


let subdominios = [];
let conceitos = [];
let finalData ;


let selectedDisciplinas = []
let selectAnos = []

let selectedDominios = []
let selectedSubDominios = []
let selectedConceitos = []


let url = [];

export default class AdvancedSearch extends Component {
  


  _isMounted = false;
  constructor(props) {

    
    super(props);

    console.log('props', props);

  

    this.initialState = {
      terms: [],
      active_rels: {},
      update: false,
      firstRender: true
    };

    this.state = {
      getDominios: [],
      loading: true,
    };

    this.state = this.initialState;

    //  Refs
    this.resource__filter = React.createRef();
    this.filters_list = React.createRef();
    this.backdrop = React.createRef();
    this.resetFiltersResources = this.resetFiltersResources.bind(this);

    //
    //	Submition
    //
    this.submitFilters = this.submitFilters.bind(this);

    //
    //	Change events
    //
    /* this.termsChange = this.termsChange.bind(this); */
    this.toggleList = this.toggleList.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.setInitialState = this.setInitialState.bind(this);
    this.handleScroll = this.handleScroll.bind(this);

    //
    //	Renders
    //
    this.renderTerms = this.renderTerms.bind(this);

    //
    //  Helpers
    //
    this.getTermsList = this.getTermsList.bind(this);
    this.getTaxList = this.getTaxList.bind(this);
  }

  async componentDidMount() {
    

    url = [];
    this.fetchDominios(url);

    if (!isNode) {
      window.addEventListener('scroll', _.debounce(this.handleScroll, 100));
    }

    this._isMounted = true;

    await this.getTaxList();





    // Are there any filters from localStorage or state?
    var localFilters =
      !isNode && localStorage && JSON.parse(localStorage.getItem('filters_resources'));

    // Has queryString?
    if (this._isMounted){
      if (this.props.location.search && !_.isEmpty(this.props.location.search)) {
        var query = parseQS(this.props.location.search);

        this.setInitialState({
          terms: query.termos || [],
        });

        // Has filters on state?
      } else if (this.props.filtersResources.data != null) {



          this.fetchDominios(['disciplinas[]='+selectedDisciplinas[0].id+'&']);
        
        





        this.setInitialState(
          this.props.filtersResources.data.filters || this.props.filtersResources.data
        );

        





        // If anything else fails, has filters on localstorage?
      } else if (localFilters && localFilters.filters) {
        this.setInitialState(localFilters.filters);

      }
    }
  }

  // Reset filters on unmount
  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('scroll', this.handleScroll);

    //	Remove open class from body on unmount
    removeClass('open', document.getElementsByTagName('BODY')[0]);
    removeClass('filter-menu', document.getElementsByTagName('BODY')[0]);
  }

  componentDidUpdate(prevProps) {

 
    
    if(this._isMounted){
      // Did I try to reset from pressing the NEW SEARCH option, making parentFilters empty?
      if ((!this.props.filtersResources.data && prevProps.filtersResources.data !==null) || this.props.filtersDidReset) {
        this.clearAll();

        //If previous state is different, then warn container
      } else if (
        this.state.update &&
        this.props.location.pathname == prevProps.location.pathname &&
        this.props.location.key == prevProps.location.key
      ) {
        this.submitFilters();
      }
      
      /* if((this.props.location.pathname !== prevProps.location.pathname ||
        this.props.location.key != prevProps.location.key) && !this.state.update){
          this.props.resetTaxonomies();
          this.getTaxList();
        } */

      if(prevProps.open!=this.props.open){
        this.toggleList();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props.taxonomies.fetched!=nextProps.taxonomies.fetched || nextState.update===true || nextProps.open!==this.props.open || this.props.location.pathname !== nextProps.location.pathname || this.props.location.key != nextProps.location.key;
  }

  // Set filters class based on scroll
  handleScroll() {
    if (
      this.resource__filter &&
      this.props.resources &&
      this.props.resources.length > 0
    ) {
      let el = this.resource__filter.current;
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

  async getTaxList(){
    let fetchFilters = [
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
          'tags_resources',
          'formato_resources',
          'modos_resources',
          'target_resources',
          'lang_resources',
          'tec_requirements_resources'
				]
			}
    ]

    // Check if filters to fetch taxonomies where given


    await this.props.fetchTaxonomies(fetchFilters, this.props.fetchFilters && this.props.fetchFilters.required ? this.props.fetchFilters.required : false);

  
  }

  // Set initial state on mount
  setInitialState(state) {
    const { terms } = state;


    finalData = {
      terms:
        (terms &&
          terms.length > 0 &&
          (typeof terms === 'string'
            ? [parseInt(terms)]
            : terms.map(term => parseInt(term)))) ||
        [],
      update: true,
    };

    // Get active relationships from selected terms
  
    finalData.active_rels = relsUtils.getRelated(finalData.terms, this.props.taxonomies.data);

    // Set state based on the built data

    this.setState(finalData);

    /* this.submitFilters(finalData); */
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
  submitFilters(state = null) {

  }

  //
  //	Clear all filters
  //
  clearAll() {
    selectedDisciplinas = []
    selectedDominios = []
    selectAnos = []
    selectedSubDominios = []
    selectedConceitos = []
    if(this._isMounted){
      this.setState({
        ...this.initialState,
        update: true
      });

      if(this.props.filtersDidReset){
        this.props.toggleFiltersReset();
      }
    }
  }

  //
  //  Get terms list based on active relationships
  //


  //
  //	Handle Changes
  //
 async termsChange(prev, cur) {






if (cur.filter(e => e.taxonomy === 7).length > 0) {
  selectedDisciplinas = cur;
}

if (cur.filter(e => e.taxonomy === 8).length > 0) {
  selectedDominios = cur;
}

if(cur.filter(e => e.taxonomy === 5).length > 0){
  selectAnos = cur;
}
if (cur.filter(e => e.taxonomy === 21).length > 0) {
  selectedSubDominios = cur;
}
if (cur.filter(e => e.taxonomy === 22).length > 0) {
  selectedConceitos = cur;
}






if(cur.length < 1 && prev.length > 0){

  if(prev.filter(e => e.taxonomy === 5).length > 0){
    selectAnos = [];
  }else if(prev.filter(e => e.taxonomy === 7).length > 0){
    selectedDisciplinas = [];
  }else if(prev.filter(e => e.taxonomy === 8).length > 0){
    selectedDominios = [];
  }else if(prev.filter(e => e.taxonomy === 21).length > 0){
    selectedSubDominios = [];
  }else if(prev.filter(e => e.taxonomy === 22).length > 0){
    selectedConceitos = [];
  }


}



if(selectedDisciplinas && selectedDisciplinas.length==1){
  
  url = selectedDisciplinas.map((valor)=>
  url = 'disciplinas[]='+valor.id+'&'
  )
  this.fetchDominios(url);
}



  /*await fetch(apiPath.api + 'relationships/listterms?limit=9999&levels=5&'+url.join(''), {
    method: 'GET',
  })
  .then((responseJson) => console.log(responseJson.result))
  .catch((error) => {
    console.error(error);
  }
  );*/



  











    // Return previous terms as IDs
    let prevTerms = prev.reduce( (acc, cur) => [cur.id, ...acc], [])

    // Get all terms and remove the previous one if already exists in previous
    let finalTerms = this.state.terms.filter(function(value){
      return prevTerms.indexOf(value)<0;
    });
    


    // Join current terms
    finalTerms = finalTerms.concat(cur.reduce( (acc, cur) => [cur.id, ...acc], []));

    /* finalTerms = finalTerms.reduce( (acc, cur) => [cur.id, ...acc], []) */









   /* let disciplinas = selectedDisciplinas.map((num) => num.id);
    let anos = selectAnos.map((num) => num.id);
    let dominios = selectedDominios.map((num) => num.id);
    let subdominios = selectedSubDominios.map((num) => num.id);*/





   

    console.log(this.props)

    if(this._isMounted){
      this.setState({
        terms: finalTerms,
        update: true
      });

      this.props.setFiltersResources({
        ...this.props.filtersResources.data,
        activePage: 1,
        filters:{
          terms: [7346],
        },      
      })
    }





  }

async fetchDominios(url){
  this.setState({ loading: true });
  await fetch( apiPath.api + 'relationships/listterms?limit=9999&levels=5&'+url.join(''))
  .then(response => response.json())
  .then(result => {
    this.setState({ getDominios: result, loading: false });

    

  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}

  getTermsList(dominios){








    
        const { data } = this.props.taxonomies;
    
        const filteredData = data.filter(obj => obj.id === 5 || obj.id === 7);
    
        let finalTerms = [];
    
        filteredData.map((item) => {
          if(item.Terms && item.Terms.length>0){
            item.Terms.map(obj => obj.id);
    
            const idArray = item.Terms.map(obj => obj.id);
            
            finalTerms = finalTerms.concat(idArray);
    
    
    
          }
        })
    
        if(selectedDisciplinas && selectedDisciplinas.length==1 && dominios){
          
    if(dominios.result.rows){
      dominios=dominios.result.rows
    }

    if(dominios.result){
      dominios=dominios.result
    }


          const termIds = dominios.map(item => parseInt(item.term_id_3));
          const termIds2 = dominios.map(item => 

            parseInt(item.term_id_4)
          

            );
          const termIds3 = dominios.map(item => 

      parseInt(item.term_id_5)
          
            
      
            
            );


        finalTerms = finalTerms.concat(termIds, termIds2, termIds3);
        const uniqueArray = Array.from(new Set(finalTerms));

        return uniqueArray;
        }






       // finalTerms = finalTerms.concat([16812]);
        return finalTerms;
      
  }

  resetFiltersResources(){
    !isNode && localStorage.setItem('filters_resources', null);



    this.props.setFiltersResources({
      ...this.props.filtersResources.data,
      activePage: 1,
      filters:{
        terms: [],
      },      
    })


    this.clearAll();





  }

  //
  //	RENDER DATA
  //
  // Render terms list
  renderTerms(){


    const { data } = this.props.taxonomies;
    const { getDominios } = this.state;






		if (!data || data.length==0){
			return null;
    }

    let termsList = this.getTermsList(getDominios);
 
 


    let stateTerms = this.state.terms;


    
    
   
    data.sort((a, b) => a.id - b.id);



    return(	

        <Fragment>
        <div>
            {data.map( (item) => {

                if(item.Terms && item.Terms.length>0){
                  console.log(item)
                  let curTerms = [];
                
                    let curList = item.Terms && item.Terms.map((term) => {
                  
                        
                        if(stateTerms.indexOf(term.id)>=0){
                          curTerms.push({id: term.id, title: term.title, taxonomy: term.taxonomy_id});
                          //console.log(curTerms)
                        }
                        

                        if(termsList.indexOf(term.id)>=0){

                          return {id: term.id, title: term.title, taxonomy: term.taxonomy_id}

                        }

                        return null;
                        
                    }).filter( el => el!=null);
                    
                   //console.log(item.title)

                      
                   

                    return (
                      //" empty"

                     
                        <div className={"dropdown__wrapper" + (curList.length==0 ? " empty" : "")} key={item.slug}>
                            <label htmlFor={item.slug}>{item.title}</label>                       
                            <Picky
                              value={curTerms}
                              options={curList}
                              onChange={this.termsChange.bind(this, curTerms)}
                              open={false}
                              valueKey="id"
                              labelKey="title"
                              multiple={true}
                              includeSelectAll={curList.length>0}
                              includeFilter={curList.length>0}
                              dropdownHeight={400}
                              placeholder={""}
                              filterPlaceholder={"Filtrar..."}
                              selectAllText={"Seleccionar todos"}
                              manySelectedPlaceholder={"%s seleccionados"}
                              allSelectedPlaceholder={"%s seleccionados"}
                              render={({
                                style,
                                item: el,
                                isSelected,
                                selectValue,
                                labelKey,
                                valueKey,
                              }) => {
                                return (
                                  <li
                                    style={{ ...style }} // required
                                    className={isSelected ? "selected" : ""} // required to indicate is selected
                                    key={el[valueKey]} // required
                                    
                                  >
                                    <div>
                                      <input type="checkbox" value={el[valueKey] || ''} id={item.title+"-"+el[valueKey]} name={item.title+"-"+el[valueKey]} checked={isSelected ? true : false} onChange={() => selectValue(el)}/>
                                      <label htmlFor={item.title+"-"+el[valueKey]}>{el[labelKey]}</label>
                                    </div>
                                  </li>
                                );
                              }}
                              renderSelectAll={({
                                tabIndex,
                                allSelected,
                                toggleSelectAll,
                                multiple,
                              }) => {
                                // Don't show if single select or items have been filtered.
                                if (multiple && curList.length>0) {
                                  return (
                                    <div
                                      tabIndex={tabIndex}
                                      role="option"
                                      className={allSelected ? 'option selected' : 'option'}
                                    >
                                      <div>
                                        <input type="checkbox" id={"filter_all_"+item.slug} name={"filter_all_"+item.slug} checked={allSelected} onChange={toggleSelectAll}/>
                                        <label htmlFor={"filter_all_"+item.slug}>Escolher Todos</label>
                                      </div>
                                    </div>
                                  );
                                }
                              }}
                            />

                        
                        </div>
                        
                    );                    
                }
            })}
              <div className="dropdown__wrapper" bis_skin_checked="1">                
           
              <button style={{marginTop: 32}} className="cta primary" onClick={this.resetFiltersResources}>
                {"Nova Pesquisa"}
                </button></div>

                </div>

        </Fragment>


        
    )
  }

  render() {

    const { taxonomies, open, className } = this.props;
    if (!taxonomies.data){
      return null;
    }
    
    let hasTerms = true;

    taxonomies.data.map(tax => {
      if (hasTerms && (!tax || !tax.Terms || (tax && tax.Terms && tax.Terms.length==0))){
        hasTerms = false;
      }
    })

    return (
      <div className={"resource__filter" + (open ? " opened" : "") + (className ? " "+className : "")} ref={this.resource__filter}>
        <div className="backdrop" ref={this.backdrop} onClick={this.props.toggleFilters} />
        
        <div className="row filters__list" ref={this.filters_list}>
          {/* Close Button */}
          <div className="col-xs-2 filters__list--close">
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={this.props.toggleFilters}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          { !hasTerms &&
            <div className="padding__leftright--15 padding__topbottom--15">Não existem filtros para utilizar...</div>
          }

          { hasTerms && 
            <Fragment>
              <div className="col-xs-12 filters__list--elements">
                <div className="filters__list--wrapper">
                {this.renderTerms()}            
                  
                  
                </div>              
              </div>
              <div className="col-xs-12 filters__list--submit">
                <button className="cta primary" onClick={this.props.toggleFilters}>
                  Fechar
                </button>
              </div>            
            </Fragment>
          }
        </div>
      </div>
    );
  }
}

AdvancedSearch.propTypes = {
  taxonomies: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};