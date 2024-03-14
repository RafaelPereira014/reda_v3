'use strict';

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import _ from 'lodash';
import { parse } from 'qs';

// Utils
import { toggleClass, removeClass, isNode } from '#/utils';
import { setScrollClass } from '#/utils/filters';

// Components
import Picky from "react-picky";
import SearchBar from '#/components/search/searchBar';

export default class AppsFilters extends Component {
	constructor(props){
		super(props);

		this.state = {
			terms: [],
			tags: [],
			update: false,
			opened: false
		};

		this.topPos = null;
		this.levels = 1;

		//
		//	Set refs
		//
		this.gen_filter = React.createRef();
		this.filters_list = React.createRef();
		this.backdrop = React.createRef();

		//
		//	Submition
		//
		this.submitFilters = this.submitFilters.bind(this);

		//
		//	Change events
		//
		this.toggleList = this.toggleList.bind(this);
		this.clearAll = this.clearAll.bind(this);
		this.setInitialState = this.setInitialState.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.onChangeTags = this.onChangeTags.bind(this);
		this.onSearchbarSubmit = this.onSearchbarSubmit.bind(this);
		this.toggleTermsFilter = this.toggleTermsFilter.bind(this);

		//
		//	Renders
		//
		this.renderTerms = this.renderTerms.bind(this);

		//
		//  Helpers
		//
		this.reorderTerms = this.reorderTerms.bind(this);
		this.getChildren = this.getChildren.bind(this);
		this.getInitialTerms = this.getInitialTerms.bind(this);
	}

	componentDidMount(){	
		

		if (!isNode){
			window.addEventListener('scroll', _.debounce(this.handleScroll, 100));
		}

		this.setInitialState(this.getInitialTerms());
	}

	// Reset filters on unmount
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);


		//	Remove open class from body on unmount
		removeClass('open',document.getElementsByTagName("BODY")[0]);
		removeClass('filter-menu',document.getElementsByTagName("BODY")[0]);
	}

	getInitialTerms(){
		let initialTerms = {};
		// Are there any filters from localStorage or state?
		var localFilters = !isNode && localStorage && JSON.parse(localStorage.getItem(this.props.type ? 'filters_'+this.props.type : 'filters'));

		// Has queryString?
		if (this.props.location.search!=null && !_.isEmpty(this.props.location.search)){
			var query = this.props.location.search.substring( this.props.location.search.indexOf('?') + 1 );
			query = parse(query);			
			initialTerms = {
				terms: (query.termos &&
					query.termos.length > 0 &&
					(typeof query.termos === 'string'
						? [parseInt(query.termos)]
						: query.termos.map(term => parseInt(term)))) ||
					[],
				tags: query.palavras && query.palavras.length>0 && (typeof query.palavras === 'string' ? [query.palavras] : query.palavras) || []
			};

			// Has filters on state?
		}else if (this.props.filters.data!=null){
			initialTerms = this.props.filters.data.filters || this.props.filters.data;
			
		// If anything else fails, has filters on localstorage?
		}else if (localFilters && localFilters.filters){
			
			initialTerms = localFilters.filters;
		}	

		return initialTerms;
	}

	componentDidUpdate(prevProps) {
		//If previous state is different, then warn container
		if (this.state.update){
			this.submitFilters();
		}
		
		//	If previous taxonomies are different from current
		if (JSON.stringify(prevProps.taxonomies.data) !== JSON.stringify(this.props.taxonomies.data)){
			this.setInitialState(this.getInitialTerms());
		}
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.taxonomies.fetched;     
	}

	// Set filters class based on scroll
	handleScroll(){
		if (this.gen_filter && this.gen_filter.current){
			let el = this.gen_filter.current;
			let elTop = el.getBoundingClientRect().top;
			
			if (!this.topPos && elTop){
				this.topPos = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0);
			}

			if (this.topPos){
				setScrollClass(el, 'filters--fixed', this.topPos);
			}			
		}		
	}

	// Set initial state on mount
	setInitialState(state){
		const { terms, tags } = state;

		let finalTerms = [];
		if(this.props.taxonomies.data && terms){
			this.props.taxonomies.data.map(tax => {
				const taxTerms = this.reorderTerms(tax.Terms);
				
				if(taxTerms && taxTerms.data.length>0){
					
						taxTerms.data.map(term => {
						if (terms.indexOf(term.id)>=0){
							
							finalTerms.push({
								id: term.id,
								title: term.title,
								level: term.level,
								parent_id: term.parent_id
							})
						}
					})
				}
			})
		}
		
		// Parse values from querystring to int
		let finalData = {
			terms: finalTerms,
			tags: tags && tags.length>0 ? tags : [],
			opened: finalTerms.length>0
		}

		// Set state based on the built data
		this.setState(finalData);
		this.submitFilters(finalData);
	}

	//	Toggle terms list
	toggleTermsFilter(){
		this.setState((state) => ({
			opened: !state.opened
		}))
	}

	// Change list statue
	toggleList(){
		let list = this.filters_list.current;
		let backdrop = this.backdrop.current;
		let body = document.getElementsByTagName("BODY")[0];

		toggleClass('open', list);
		toggleClass('open', backdrop);
		toggleClass('open', body);
		toggleClass('filter-menu', body);
	}

	//
	//	On submit
	//
	submitFilters(state = null){
		let tempState = state!==null ? state : this.state;
		const { terms, tags } = tempState;
		this.props.onFilterChange({
			terms: terms && terms.reduce( (acc, cur) => [cur.id, ...acc], []),
			tags
		});
		this.setState({update: false});
	}

	//
	//	Submit filters on tags change
	//
	onSearchbarSubmit(){
		this.submitFilters();
	}

	//
	//	Clear all filters
	//
	clearAll(){
		this.setState({
			terms: [],
			tags: [],
			update: true
		});

		!isNode && localStorage.setItem(this.props.type ? 'filters_'+this.props.type : 'filters_apps', null);
	}

	//
	//	Handle Changes
	//
	//	MUST HAVE "prev" ARGUMENT BECAUSE THIS IS HANDLED BY MULTIPLE DROPDOWNDS THAT CAN BE FROM DIFFERENT TAXONOMIES, NON RELATED BETWEEN THEM
	termsChange(prev, level, cur){

		let multipleBox = this.props.multipleBox;

		// Return previous terms as IDs
		let prevTerms = prev.reduce( (acc, cur) => [cur.id, ...acc], [])
		
		// Get all terms and remove the previous one if already exists in previous and is the same level as clicked
		let finalTerms = this.state.terms.filter(function(value){
			
			if(multipleBox){
				if(value.level === level){
					if(cur.length==0){
						return false;
					}
	
					//	Remove element from array if already exists in previous in order to be added again later
					return prevTerms.indexOf(value.id)<0;
				}
	
				if(value.level>level){
					//	If current is empty
					//	OR
					//	If parent is not selected in future terms AND parent doesn't exist in previous selection
					if(cur.length==0 || (!cur.some(curTerm => curTerm.id == value.parent_id))){
						return false;
					}
				}

				return true;
			}else{
				return prevTerms.indexOf(value.id)<0;
			}
			
		});
	
		// Join current terms
		finalTerms = finalTerms.concat(cur);
		
		this.setState({
			terms: finalTerms,
			update: true
		});
	}

	// Handle tags change to search by tag
	onChangeTags(tags){
		this.setState({
			tags,
			update: true
		});
	}

	//
	//	RENDER DATA
	//

	// Set terms structure based on having or not children
	reorderTerms(terms){
		let finalStructure = [];
		let withChild = false;

		if(terms && terms.length>0){

			terms.map(term => {
				let curTerm = Object.assign({}, term);
				//	If is parent
				if(!term.parent_id){
					//	Get children
					const children = this.getChildren(terms, term, 1);

					//	If has children
					if(children.children && children.children.length>0){

						//	Set first level
						curTerm.level = 1;

						//	Set if these terms have children
						withChild = true;
					}						

					//	Add current term to final structure and append the children right after it
					finalStructure.push(curTerm)
					finalStructure = finalStructure.concat(children.children);
				}
			})
		}
		return {
			data: finalStructure,
			withChild
		};
	}

	// Get children if any
	getChildren(terms, term, level = null){
		let children = [];

		//	Set level
		const thisLevel = level!==null ? level+1 : null;

		terms.map( curTerm => {
				let thisTerm = Object.assign({}, curTerm);
				thisTerm.children = thisTerm.children || [];

				//	If has parent and the id is the same as given
				if(curTerm.parent_id && curTerm.parent_id == term.id){

					//	Get children
					const thisTermChildren = this.getChildren(terms, curTerm, thisLevel);

					//	Set level
					thisTerm.level = thisLevel;

					//	Add current term to final structure and append the children right after it
					children.push(thisTerm)
					children = children.concat(thisTermChildren.children);
				}
		})

		this.levels = thisLevel>this.levels ? thisLevel : this.levels;

		return {children, level: thisLevel};
	}

	// Render list
	renderTerms(){
		const { data } = this.props.taxonomies;

		if (!data || data.length==0){
			return null;
		}

		let stateTerms = this.state.terms.reduce( (acc, cur) => [cur.id, ...acc], []);
		
		return(			
			<Fragment>
				{data.map( (item) => {

					if(item.Terms && item.Terms.length>0){
						//	Get terms with children right after
						const taxTerms = this.reorderTerms(item.Terms);

						let curTerms = [];
						taxTerms.data.map( term => {
							//	If current term is selected, add to curTerms array
							if(stateTerms.indexOf(term.id)>=0){
								curTerms.push({id: term.id, title: term.title, level: term.level, parent_id: term.parent_id});
							}
						});

						let els = [];

						let levelsStructure = [];

						if(this.props.multipleBox){
							for(let count = 1; count<=this.levels; count++){

								//
								//	SET DATA FOR DROPDOWN
								//

								let prevData = null;

								if(count>1){
									//	Get data from previous level
									prevData = taxTerms.data.filter(term => term.level===count-1).reduce((acc, cur) => [...acc, cur.id], []);
									
									//	Now, get only selected values
									let curTermsIds = curTerms.reduce((acc, cur) => [...acc, cur.id], []);
									prevData = prevData.filter(curData => curTermsIds.indexOf(curData)>=0);
								}
								
								let filteredData = taxTerms.data.filter(term => {
									if(count==1){
										return term.level===count
									}

									if(count>1){
										return term.level===count && prevData.indexOf(term.parent_id)>=0
									}
								});
								let tempFilteredData = filteredData.reduce((acc, cur) => [...acc, cur.id], []);

								let tempCurTerms = curTerms.filter(cur => tempFilteredData.indexOf(cur.id)>=0);

								levelsStructure.push({
									filteredData,
									tempCurTerms,
								});
							}
						}else{
							levelsStructure.push({
								filteredData: taxTerms.data,
								tempCurTerms: curTerms
							});
						}

						levelsStructure.map( (structure, idx) => {

							if(structure.filteredData.length>0){
								els.push(
									<div
										className={"dropdown__wrapper" + (structure.filteredData.length==0 ? " empty" : "") + (taxTerms.withChild ? " withChild" : "")}
										key={item.id+'_'+(idx+1)}>

										<label htmlFor={item.slug}>{(idx+1)>1 ? 'Sub-' : ''}{item.title}{(idx+1)>2 ? ' '+(idx) : ''}</label>
										<Picky
										value={structure.tempCurTerms}
										options={structure.filteredData}
										onChange={this.termsChange.bind(this, curTerms, idx+1)}
										open={false}
										valueKey="id"
										labelKey="title"
										multiple={true}
										includeSelectAll={structure.filteredData.length>0}
										includeFilter={structure.filteredData.length>0}
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
												className={isSelected ? "selected" : ""} // required to indicate is selected
												key={el[valueKey]} // required
												style={{...style, marginLeft: (el.level && !this.props.multipleBox ? 30*(parseInt(el.level)-1) : 0)}}
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
											multiple
										}) => {
											// Don't show if single select or items have been filtered.
											if (multiple && item.Terms.length>0) {
											return (
												<div
												tabIndex={tabIndex}
												role="option"
												className={allSelected ? 'option selected' : 'option'}
												>
													<div>
														<input type="checkbox" id={"filter_all_"+item.slug+"_"+(idx+1)} name={"filter_all_"+item.slug+"_"+(idx+1)} checked={allSelected} onChange={toggleSelectAll}/>
														<label htmlFor={"filter_all_"+item.slug+"_"+(idx+1)}>Escolher Todos</label>
													</div>
												</div>
											);
											}
										}}
										/>
									</div>
								);
							}
						});

						return els;
					}
				})}
			</Fragment>
		)
	}


	render() {
		const { taxonomies, className } = this.props;
		if (!taxonomies.data || !Array.isArray(this.state.tags))
			return null;

		return (
			<div className="margin__bottom--30 gen_filter" ref={this.gen_filter}>
				<div className="backdrop" ref={this.backdrop} onClick={this.toggleList}></div>
				<div className="row filters-button">
					<div className="col-xs-12">
						<button className="cta primary outline" onClick={this.toggleList}><i className="fa fa-filter"></i>Filtrar por...</button>	
					</div>					
				</div>
				<div className="filters__list" ref={this.filters_list}>
					<div className="row">
						{/* Title */}
						<div className="col-xs-10 filters__list--title">
							<h6>Filtrar por...</h6>
						</div>
						{/* Close Button */}
						<div className="col-xs-2 filters__list--close">
							<button type="button" className="close" aria-label="Close" onClick={this.toggleList}><span aria-hidden="true">&times;</span></button>
						</div>
					</div>

					<div className={"filters__list--elements" + (className ? " "+ className : "")}>
						{
							(this.props.searchTags==null || this.props.searchTags===true) && 						
								<Fragment>
									{/* Search by tags */}
									<SearchBar
									onSubmit={this.onSearchbarSubmit}
									onChangeTags={this.onChangeTags}
									tags={this.state.tags}
									showButton={true}
									className="margin__bottom--15"
									searchText={this.props.searchText || null}/>
													
					
						
						{ this.props.advanceSearch &&

					<div className={"advanced-search__open" + (this.state.opened ? " open" : "")}>		
																	<button 
											type="button" 
											className="cta no-border no-bg"
											onClick={this.toggleTermsFilter}
										>																
											Pesquisa avançada 
											{ this.state.opened ? <i className="fa fa-chevron-up margin__left--15"></i> : <i className="fa fa-chevron-down margin__left--15"></i>}
										</button>
								</div>
						}
						
				
									
							
									</Fragment>
						}
									
							
				
						{/* Terms filter */}
						{
							((this.props.searchTags==null || this.props.searchTags===true) && this.state.opened) || this.props.searchTags==false ? 
								<div className="dropdowns__list terms__filter">
									{this.renderTerms()}
								</div>
								: null
						}
						
						
					</div>


					<div className="row">
						<div className="col-xs-12 filters__list--submit">
							<button className="cta primary" onClick={this.toggleList}>Fechar</button>	
						</div>	
						<div className="col-xs-12 filters__list--clear">
							<button className="cta primary outline " onClick={this.clearAll}>Limpar Filtros</button>	
						</div>	
					</div>
				</div>
			</div>
		);
	}
}

AppsFilters.propTypes = {
	taxonomies: PropTypes.object.isRequired,
	onFilterChange: PropTypes.func.isRequired,
	location: PropTypes.object
}