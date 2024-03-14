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
import { ToolsList } from '#/components/tools/toolsList/list';
import Filters from '#/containers/filters/filtersGeneric';

export default class ToolsListing extends Component {
	_isMounted = false;
	constructor(props){
		super(props);

		this.resetState = {
			activePage: 1,
			limit: 12,
			filters: {
				terms: [],
			},
			tags: []
		}
		
		this.state = this.resetState;

		this.firstRender = true;

		//
		//	Event Handlers
		//
		this.onChangePage = this.onChangePage.bind(this);
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
		this.onFilterChange = this.onFilterChange.bind(this);

		//
		//	Handle all changes
		//
		this.requestNew = this.requestNew.bind(this);
		this.startComponent = this.startComponent.bind(this);
	}

	componentDidMount(){
		this._isMounted = true;
		this.startComponent();	
	}

	// Clear tools on unmount
	componentWillUnmount() {
		this._isMounted = false;
		this.props.resetFilters();
		this.props.resetTaxonomies();
		!isNode && localStorage.setItem('filters_tools', null);

		this.props.resetTools();	 
	}

	componentDidUpdate(prevProps, prevState) {
		// Update page on param change
			const { activePage } = this.state;

		if (JSON.stringify(prevState) !== JSON.stringify(this.state) && !this.firstRender && this._isMounted){
			this.requestNew();
			
			if (activePage != prevState.activePage){
				scrollToTop();
			}

			if (this.props.location.key == prevProps.location.key){	 			
				setQueryString(this.state, {history: this.props.history}, this.props.location);
			}
		}
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.tools.fetched;   
	}

	//
	//	START COMPONENT FROM SCRATCH
	//
	startComponent(){
		const { config } = this.props;		
		
		this.props.resetFilters();
		this.props.resetTools();

	
		// Set initial data
		let initialData = this.resetState;

		// Has queryString?
		if(this.props.location.search && !_.isEmpty(this.props.location.search)){
			var query = parseQS(this.props.location.search);
			const { pagina, limite, palavras, termos } = query;

			initialData = {
				activePage: parseInt(pagina) || initialData.activePage,
				filters: {
					terms: termos || [],
				},
				limit: parseInt(limite) || initialData.limit,
				tags: palavras && palavras.length>0 && (typeof palavras === 'string' ? [palavras] : palavras) || initialData.tags
			};
		}

		if(this._isMounted){
			this.setState(initialData);
		}
		
		this.props.searchTools(initialData)
		.then(() => {
			if(this._isMounted){				
				this.setState({
					activePage: this.props.tools.curPage || initialData.activePage,
				});
			}
			setQueryString(initialData, {history: this.props.history}, this.props.location);		

			this.firstRender = false;
		})

		this.props.fetchTaxonomies([
			{
				key: "type",
				value: "tools"
			},
			{
				key: "terms",
				value: true
			},
			{
				key: "include",
				value: [
					'categorias_tools'
				]
			}
		], false)

		// Get configurations
		!config.fetched && this.props.fetchConfig();
		
	}

	//
	//	REQUEST NEW TOOLS
	//
	requestNew(){
		/* this.props.setFilters(this.state,'tools'); */
		this.props.searchTools(this.state);
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

	// Search tools by keyword
	onSearchSubmit(){
		if(this._isMounted)
			this.requestNew();
	}

	render() {
		const { tools, taxonomies } = this.props;

		if(!taxonomies.data || !taxonomies.fetched){
			return null;
		}

		return (
			<div className="tools__page light-background">
				<div className="container">
					<div className="row">
						<div className="col-xs-12">
							{/* REMOVED ADVANCED SEARCH */}	
							<Filters
								location={this.props.location}
								onFilterChange={this.onFilterChange}
								type="apps"
								taxonomies={this.props.taxonomies}
								className="margin__top--15"
								searchText={"Filtrar palavras"}
								multipleBox={true}
								advanceSearch={false}
							/>

							<section className="row">
								<div className="col-xs-6">
									{/* Total Results */}
									<h4><strong>{tools.total}</strong> <span className="de-emphasize">Resultados</span></h4>									 
								</div>
							</section>						

							{/* Tools List */}
							<ToolsList 
								list={tools} 
								config={this.props.config.data} 
								cols={{
									lg:4,
									md:4,
									sm:4
								}}
								/>								

							{/* Pagination */}
							{(() => {
								if (tools.data && tools.data.length>0 && tools.totalPages>1){
									return <Pagination
										prev
										next
										first
										last
										ellipsis
										boundaryLinks
										items={tools.totalPages}
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

ToolsListing.propTypes = {
	tools: PropTypes.object.isRequired,
	config: PropTypes.object.isRequired
}