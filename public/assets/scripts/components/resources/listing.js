'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash';

// Utils
import { scrollToTop, isNode } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';

// Components
import { ResourcesList } from './common/list';
import ResourcesOrdering from './common/order';
import SearchBar from '#/components/search/searchBar';
import IsInteractor from '#/containers/auth/isInteractor';
import ProtectedButton from '#/components/auth/protectedButton';
import AlertLogin from './common/alertLogin';
import Pagination from 'react-bootstrap/lib/Pagination';

// Error handlers
import ErrorBoundary from '#/components/error/boundary';

// Contexts
import { ResourceFiltersContext } from '#/contexts/resources/filters';


export default class ResourcesListing extends Component {
	_isMounted = false;
	constructor(props){
		super(props);

		this.resetState = {
			activePage: 1,
			limit: 12,
			tags: [],
			order: "recent",
			filters: {}
		}
		
		this.state = this.resetState

		this.firstRender = true;

		//
		//	Event Handlers
		//
		this.onChangePage = this.onChangePage.bind(this);
		this.onChangeTags = this.onChangeTags.bind(this);
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
		this.onListOrder = this.onListOrder.bind(this);
		this.onFilterChange = this.onFilterChange.bind(this);
		this.setHighlight = this.setHighlight.bind(this);
		this.setFavorite = this.setFavorite.bind(this);

		//
		//	Handle all changes
		//
		this.requestNewResources = this.requestNewResources.bind(this);
		this.resetComponent = this.resetComponent.bind(this);
	}

	componentDidMount(){
		this._isMounted = true;
		let initialData = null;
		let storageFilters = null;

		let query = null;

		// Has queryString?
		if (this.props.location.search && !_.isEmpty(this.props.location.search)){
			query = parseQS(this.props.location.search);

			initialData = {
				filters: {
					terms: query.termos || [],
				},
				tags: query.palavras && query.palavras.length>0 && (typeof query.palavras === 'string' ? [query.palavras] : query.palavras) || []	
			};

		// If not, is from node and has any filters in localStorage?
		}else if(!isNode && localStorage && localStorage.getItem('filters_resources')!=null){
			
			storageFilters = JSON.parse(localStorage.getItem('filters_resources'));
			initialData = storageFilters;

		// If not, has any filters in state?
		}else if (this.props.filtersResources.data!=null){
			storageFilters = this.props.filtersResources.data;
			initialData = storageFilters;
		}

		// Set full initialData
		initialData = {
			activePage: (query && query.pagina && parseInt(query.pagina)) || (initialData && initialData.activePage) || this.state.activePage,
			filters: {
				terms: initialData && initialData.filters && initialData.filters.terms ? initialData.filters.terms : (this.state.filters.terms || [])
			},
			tags: initialData && initialData.tags ? initialData.tags : (this.state.tags || []),
			order: query && query.ordem || (initialData && initialData.order) || this.state.order,
			limit: (query && query.limite && parseInt(query.limite)) || (initialData && initialData.limit) || this.state.limit,
		};

		// If there is any search, don't search again.
		// Else, do!
		if (this.firstRender){
	
			
			this.props.searchResources(initialData)
			.then(() => {
				if(this._isMounted){
					this.setState(initialData);
					this.firstRender=false;
				}	
			});


		}else{
			
			this.setState(initialData);
		}

		// Set initial queryString and set filters based on that
		setQueryString(initialData, {history: this.props.history}, this.props.location);
		this.props.setFiltersResources(initialData); 

		// Make filters open if there are any terms
		if(initialData.filters && initialData.filters.terms && initialData.filters.terms.length>0){
			this.props.toggleFilters();
		}
		

		// Get configurations
		this.props.fetchConfig();
	
	}

	// Clear resources on unmount
	componentWillUnmount() {
		this.props.setFiltersResources(this.state);
		this._isMounted = false;
	}

	componentDidUpdate(prevProps, prevState) {
		const { activePage } = this.state;

		// Update state if filters of resources also changed
		if (JSON.stringify(prevProps.filtersResources.data) !== JSON.stringify(this.props.filtersResources.data) && this._isMounted){
			this.setState(this.props.filtersResources.data || this.initialData);
		}
		
		// Request new resources if there is any change in state
		if (JSON.stringify(prevState) !== JSON.stringify(this.state) && !this.firstRender && this._isMounted){

			this.requestNewResources();

			// Scroll to top only on page change
			if (activePage != prevState.activePage){
				scrollToTop();
			}

			if (this.props.location.key == prevProps.location.key){	 			
				setQueryString(this.state, {history: this.props.history}, this.props.location);
			}
		}
	}

	shouldComponentUpdate(nextProps,) {
		return nextProps.resources.fetched || JSON.stringify(nextProps.filtersResources)!==JSON.stringify(this.props.filtersResources);
	}

	//
	//	REQUEST NEW RESOURCES
	//
	requestNewResources(){
		this.props.setFiltersResources(this.state);
		this.props.searchResources(this.state);	

	}

	//
	//	RESET
	//
	resetComponent(){
		if(this._isMounted){
			this.setState(this.resetState);
		}
		this.props.resetFiltersResources();

		if(!this.props.filtersDidReset){
			this.props.toggleFiltersReset();
		}
		
	}

	// When filters change
	onFilterChange(){
		if(this._isMounted)
			this.setState({activePage: 1});
	}

	// Handle pagination
	onChangePage(page) {
		if (page && this._isMounted){
			this.setState({
				activePage: page
			});
		}		
	}

    // Handle list ordering
	onListOrder(order){
		if(this._isMounted){
			this.setState({
				order,
				activePage: 1
			});
		}	
	}

	// Search resources by keyword
	onSearchSubmit(){
		if(this._isMounted)
			this.requestNewResources();
	}

    // Handle tags change to search by tag
	onChangeTags(tags){
		if(this._isMounted){
			this.setState({
				tags,
				activePage: 1
			});
		}	
	}

	// Set as highlighted
	setHighlight(resourceId){
		if(this._isMounted)
			this.props.setHighlights(resourceId);
	}

	// Set as favorite
	setFavorite(resourceId){
		if(this._isMounted)
			this.props.setFavorites(resourceId);
	}

	// Alert that user is not authenticated
	renderAlert(){
		return <AlertLogin location={this.props.location}></AlertLogin>
	}

	// Render new resource button according to auth
	renderNewResourceBtn(obj, target, className){
		if (this.props.auth.isAuthenticated){
			return (
				
				<Link to={target} className={className || "cta primary"}>
					<i className="fa  fa-plus-square" aria-hidden="true"></i>
					{obj}
				</Link>
			)
		}

		return(
		<ProtectedButton target={target} className={className || "cta primary"}>
					{obj}
				</ProtectedButton>
		);
	}

	render() {
		const { resources, config } = this.props;

		/* if (!config.data || !this.state.tags)
			return null;
 */
		if (resources && resources.fetching){
			return (
				<div className="resources__page list">
					<div className="container">
						<p className="margin__top--30 margin__bottom--60">A carregar...</p>
					</div>
				</div>
			);
		}
	
		if(!config.data || !resources || !resources.data){
			return (
				<div className="resources__page list">
					<div className="container">
					<p className="text-center margin__top--30 margin__bottom--60">Não foram encontrados resultados.</p>
					</div>
				</div>
			);
		}
		
		const { isAuthenticated } = this.props.auth;

		return (
			<div className="resources__page list">
				<div className="container">
					<div className="row">
						<div className="col-xs-12">
							<ErrorBoundary>					
								<SearchBar onSubmit={this.onSearchSubmit} onChangeTags={this.onChangeTags} tags={this.state.tags} className="resources-search" showButton={true} />
								{ /* Advanced Search */}
								<ResourceFiltersContext.Consumer>
									{({toggleFilters}) => (
										<div className="row filters-button">
											<div className="col-xs-12">
												<button className="cta primary outline" onClick={toggleFilters}>
													<i className="fa fa-filter" />Filtrar por...
												</button>
											</div>
										</div>
									)}
								</ResourceFiltersContext.Consumer>	
							</ErrorBoundary>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<section className="row">
								<div className="col-xs-6">
									{/* Total Results */}
									<h4><strong>{resources.total}</strong> <span className="de-emphasize">Resultados</span></h4>									 
								</div>
								<div className="col-xs-6">
									{/* Ordering Options */}
									<ResourcesOrdering onChange={this.onListOrder} order={this.state.order}/>
								</div>
								<div className="col-xs-12 pre-list-actions">
									{/*<button className="cta primary no-bg clear-list" onClick={this.resetComponent}><i className="fa fa-repeat" aria-hidden="true"></i>Nova pesquisa</button>*/}
									<IsInteractor>
										{this.renderNewResourceBtn("Introduzir recurso","novorecurso","cta primary no-bg")}
									</IsInteractor>
								</div>
							</section>

							{/* Warnings */}
							{/* <IsNotAuthenticated>
								{this.renderAlert()}
							</IsNotAuthenticated> */}

							{/* Resources List */}
							<ErrorBoundary>
								<ResourcesList 
									list={resources} 
									config={this.props.config.data} 
									addscript 
									isAuthenticated={isAuthenticated}
									auth={this.props.auth} 
									setHighlight={this.setHighlight} 
									setFavorite={this.setFavorite}
									cols={{
										lg:3,
										md:4,
										sm:6
									}}
									/>
							</ErrorBoundary>
							{/* Pagination */}
							{(() => {
								if (resources.data && resources.data.length>0 && resources.totalPages>1){
									return <Pagination
										prev
										next
										first
										last
										ellipsis
										boundaryLinks
										items={resources.totalPages}
										maxButtons={5}
										activePage={this.state.activePage}
										onSelect={this.onChangePage} />
								}
							})()}
							{/* Contribute */}
							<section className="contribute-button visible-xs visible-sm">
								<h6 className="text-center">Contribua</h6>
								{this.renderNewResourceBtn("Introduzir recursos","novorecurso")}
							</section>
							
						</div>
					</div>
					
				</div>
			</div>
		);
	}
}

ResourcesListing.propTypes = {
	resources: PropTypes.object.isRequired,
	config: PropTypes.object.isRequired
}