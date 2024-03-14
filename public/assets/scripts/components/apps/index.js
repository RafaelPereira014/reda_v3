'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import _ from 'lodash';

// Utils
import { scrollToTop, isNode } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';

// Components
import Pagination from 'react-bootstrap/lib/Pagination';

import { AppsList } from './common/list';
import Tabs from '#/components/common/tabs';
import Filters from '#/containers/filters/filtersGeneric';

export default class AppsListing extends Component {
	_isMounted = false;
	constructor(props){
		super(props);

		this.resetState = {
			activePage: 1,
			filters: {
				terms: [],
			},
			system: null,
			tags: [],
			limit: 12
		}
		
		this.state = this.resetState;

		this.firstRender = true;

		//
		//	Event Handlers
		//
		this.onChangePage = this.onChangePage.bind(this);
		
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
		this.onFilterChange = this.onFilterChange.bind(this);
		this.onSystemChange = this.onSystemChange.bind(this);

		//
		//	Handle all changes
		//
		this.requestNewApps = this.requestNewApps.bind(this);
	}

	componentDidMount(){

		let initialData = this.resetState;

		let query = null;
		this._isMounted = true;
	
		this.props.fetchTaxonomies([
			{
				key: "type",
				value: this.props.type || "apps"
			},
			{
				key: "terms",
				value: true
			},
			{
				key: "exclude",
				value: [
					'sistemas_apps',
					'tags_apps'
				]
			}
		], false);

		// Has queryString?
		if (this.props.location && this.props.location.search && !_.isEmpty(this.props.location.search)){
			query = parseQS(this.props.location.search);

			if(query.sistema){

				const { sistema, pagina, termos, palavras } = query;

				initialData = {
					system: (query.sistema && [parseInt(sistema)]) || initialData.system,
					activePage: parseInt(pagina) || initialData.activePage,
					filters: {
						terms: termos || [],
					},
					tags: palavras && palavras.length>0 && (typeof palavras === 'string' ? [palavras] : palavras) || initialData.tags,
					limit: (query && query.limite && parseInt(query.limite)) || initialData.limit,
				};
			}
		}

		this.props.resetFilters();
		this.props.fetchSystems()
		.then(() => {

			if(this._isMounted){			
				initialData.system = (query && query.sistema && [parseInt(query.sistema)]) || (this.props.systems.data[0] && [this.props.systems.data[0].id]) || null;
				this.setState(initialData);		

				return this.props.searchApps(initialData);
			}
			
		})
		.then(() => {

			if(this._isMounted){
				this.setState(initialData);

				setQueryString(initialData, {history: this.props.history}, this.props.location);		

				this.firstRender = false;
			}
		})

		// Get configurations
		this.props.fetchConfig();		
	}

	// Clear apps on unmount
	componentWillUnmount() {
		this._isMounted = false;
		this.props.resetFilters();
		this.props.resetTaxonomies();

		!isNode && localStorage.setItem('filters_apps', null);

		this.props.resetApps();     
	}

	componentDidUpdate(prevProps, prevState) {
		const { activePage } = this.state;

		// Request new apps if there is any change AND tags didn't change.
		// This avoids request new apps each time adding a new tag in the input. It is required to press the button
		if (JSON.stringify(prevState) !== JSON.stringify(this.state) && !this.firstRender && this._isMounted){
			this.requestNewApps();

			if (activePage != prevState.activePage){
				scrollToTop();
			}

			if (this.props.location.key == prevProps.location.key){	 
				setQueryString(this.state, {history: this.props.history}, this.props.location);
			}
		}
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.apps.fetched;   
	}

	//
	//	REQUEST NEW APPS
	//
	requestNewApps(){
		/* this.props.setFilters(this.state,'apps'); */
		this.props.searchApps(this.state);
	}

	// When system change
	onSystemChange(system){
		if(this._isMounted)
			this.setState({system: [system], activePage: 1});
	}

	// When filters change
	onFilterChange(filters){
		if(this._isMounted){
			this.setState({
				filters: {
					terms: filters.terms
				},
				tags: filters.tags,
				activePage: 1
			});
		}
		
	}

	// Handle pagination
	onChangePage(page) {
		if (page && this._isMounted){
			this.setState({
				activePage: page
			});
		}		
	}

	// Search apps by keyword
	onSearchSubmit(){
		if(this._isMounted)
			this.requestNewApps();
	}

	render() {
		const { apps } = this.props;

		if (!this.props.config || !this.props.config.data || !this.props.taxonomies.data){
			return null;
		}

		return (
			<div className="apps__page light-background">
				<div className="container">
					<div className="row">					

						<div className="col-xs-12">
							<Tabs setTab={this.onSystemChange} tabs={this.props.systems.data} curTab={this.state.system} className="system__tabs"/>
									{/* REMOVED ADVANCED SEARCH */}					
							<Filters
							location={this.props.location}
							onFilterChange={this.onFilterChange}
							type="apps"
							taxonomies={this.props.taxonomies}
							className="margin__top--15"
							searchText={"Filtrar palavras"}
							advanceSearch={false}
		/>
							
							<section className="row">
								<div className="col-xs-6">
									{/* Total Results */}
									<h4><strong>{apps.total}</strong> <span className="de-emphasize">Resultados</span></h4>
								</div>
							</section>	

							{/* Apps List */}
							<AppsList 
								list={apps} 
								config={this.props.config.data} 
								cols={{
									lg:3,
									md:4,
									sm:4
								}}
								/>								

							{/* Pagination */}
							{(() => {
								if (apps.data && apps.data.length>0 && apps.totalPages>1){
									return <Pagination
										prev
										next
										first
										last
										ellipsis
										boundaryLinks
										items={apps.totalPages}
										maxButtons={5}
										activePage={this.state.activePage}
										onSelect={this.onChangePage} />
								}
							})()}
							
						</div>
					</div>
					
				</div>
			</div>
		);
	}
}

AppsListing.propTypes = {
	apps: PropTypes.object.isRequired,
	config: PropTypes.object.isRequired
}