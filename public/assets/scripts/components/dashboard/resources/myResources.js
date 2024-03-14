'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';

// Utils
import _ from 'lodash';

// Utils
import { scrollToTop } from '#/utils';
import { getPage } from '#/utils/resources';
import { setQueryString, parseQS } from '#/utils/history';

// Components
import { ResourcesList } from './common/list';
import ResourcesOrdering from '#/components/resources/common/order';
import DeleteCollective from '#/components/common/deleteCollective';

// Bootstrap
import Pagination from 'react-bootstrap/lib/Pagination';

import SearchContainer from '#/containers/search';
import AdvancedSearch from '#/containers/search/advancedSearch';

// Contexts
import { ResourceFiltersContext } from '#/contexts/resources/filters';

// Portals
import UndoPortal from '#/components/common/portals/undo';

export default class MyResources extends Component {
	_ismounted = false;
	constructor(props){
		super(props);
		
		//
		//	Event handlers
		//
		this.onChangePage = this.onChangePage.bind(this);
		this.onChangeTags = this.onChangeTags.bind(this);
		this.onListOrder = this.onListOrder.bind(this);
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
		this.setHighlight = this.setHighlight.bind(this);
		this.setFavorite = this.setFavorite.bind(this);
		this.undoApproval = this.undoApproval.bind(this);
		this.onTermsSubmit = this.onTermsSubmit.bind(this);
				

		//
		// Resources actions
		// 
		this.checkAllResources = this.checkAllResources.bind(this);
		this.checkEl = this.checkEl.bind(this);
		this.deleteList = this.deleteList.bind(this);
		this.deleteSingle = this.deleteSingle.bind(this);
		this.setApprove = this.setApprove.bind(this);

		//
		//	Helpers
		//
		this.requestMyResources = this.requestMyResources.bind(this);

		//
		//	Renders
		//
		this.renderFilters = this.renderFilters.bind(this);

		//
		//	Set state
		//
		this.resetState = {
			activePage: 1,
			tags: [],
			order: "recent",
			checkedResources: [],
			checkAll: false,
			toApprove: false,
			showUndo: false,
			lastApprovalEl: null,
			filters: {
				terms:[]
			}
		}

		this.state = this.resetState;

		this.firstRender = true;
	}

	async componentDidMount(){
		this._ismounted = true;
		// Set initial data
		let initialData = this.state;

		// Has queryString for filters?
		// 
		//
		// ALSO CHANGE IN searchForm.js TO UPDATE STATE
		// 		
		if(this.props.location.search && !_.isEmpty(this.props.location.search)){
			var query = parseQS(this.props.location.search);

			const { 
				pagina, 
				palavras, 
				ordem, 
				termos,
			} = query;

			initialData = {
				activePage: pagina ? parseInt(pagina) : initialData.activePage,
				order: ordem || initialData.order,
				tags: palavras && palavras.length>0 && (typeof palavras === 'string' ? [palavras] : palavras) || initialData.tags,
				filters:{
					terms: termos || [],
				}
			};
		}


		await this.props.fetchMyResources(this.props.match.params, initialData)

		if(this._ismounted){
			let settingState = {
				activePage: initialData.activePage || 1,
				toApprove: this.props.match.params && this.props.match.params.type && this.props.match.params.type=='pendentes',
				tags: initialData.tags
			}

			if (initialData.filters){
				settingState.filters = initialData.filters;
			}
			this.setState(settingState);

			this.firstRender = false;

			setQueryString(initialData, {history: this.props.history}, this.props.location)
		}

		this.props.fetchConfig();
		if (this.props.auth.data && this.props.auth.data.user && this.props.auth.data.user.role=='admin'){
			this.props.fetchMessages(null, 'disapprove');
		}		

		// Make filters open if there are any terms
		if(initialData.filters && initialData.filters.terms && initialData.filters.terms.length>0){
			this.props.toggleFilters();
		}
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.resources.fetched;
	}

	componentDidUpdate(prevProps, prevState) {

		const { activePage, tags, order } = this.state;		

		// Request new resources if there is any change
		if ((prevState.activePage !== activePage ||
			prevState.order !== order || 
			prevState.tags!=tags || 
			JSON.stringify(prevState.filters.terms)!=JSON.stringify(this.state.filters.terms) ||
			JSON.stringify(prevProps.resources)!=JSON.stringify(this.props.resources) ||
			(this.props.param && this.props.match.params.type && prevProps.match.params && this.props.match.params.type==prevProps.match.params.type)) &&
			!this.firstRender){

			this.requestMyResources();
			scrollToTop();

			// Update querystring only if routing key is the same
			if (this.props.location.key == prevProps.location.key){	 			
				setQueryString(this.state, {history: this.props.history}, this.props.location);
			}

		// Reset if page type changes
		}else if(this.props.param && this.props.match.params.type && prevProps.match.params && prevProps.match.params.type != this.props.match.params.type && !this.firstRender){
			this.firstRender = true;
			this.requestMyResources(true);
			scrollToTop();
		}
	}

	componentWillUnmount() {
		this._ismounted = false;
		this.props.resetFilters();
		this.props.resetResources();
	}

	//	Request new resources
	requestMyResources(reset, state = null){
		let initialData = state || this.state;

		//Reset page?
		if (reset){
			initialData = this.resetState;
		}

		this.props.fetchMyResources(this.props.match.params, initialData);

		// If first render, set default
		if (this.firstRender && reset){
			this.firstRender = false;
			setQueryString(initialData, {history: this.props.history}, this.props.location);
		}
	}

	// Handle pagination
	onChangePage(page) {
		if (page){
			this.setState({
				activePage: page
			});
		}		
	}

	// Handle list ordering
	onListOrder(order){
		this.setState({
		order,
		activePage: 1
	});
	}

	// Search resources by keyword
	onSearchSubmit(){
		this.requestMyResources();
	}

	onTermsSubmit(filters){
		this.setState({
			filters:{
				terms: filters.terms
			},
			activePage: 1
		});
	}

	// Handle tags change to search by tag
	onChangeTags(filters){
		this.setState({
			tags: filters.tags,
			activePage: 1
		});
	}

	// Set as highlighted
	setHighlight(resourceId){
		this.props.setHighlights(resourceId);
	}

	// Set as favorite
	setFavorite(resourceId){
		this.props.setFavorites(resourceId);
	}

	// Check elements
	checkAllResources(){
		if (!this.state.checkAll){
			let totalIds = [];
			for (let item of this.props.resources.data){
				totalIds.push(item.id);
			} 
			
			this.setState({
				checkedResources: totalIds,
				checkAll: !this.state.checkAll
			});

		}else{
			this.setState({
				checkedResources: [],
				checkAll: !this.state.checkAll
			});
		}
	}

	// Add or remove element from checked array
	checkEl(id){
		let {checkedResources} = this.state;
		let index = checkedResources.indexOf(id);
		let allChecked = false;

		// If exists, remove item and set as 
		if (index>=0){
			checkedResources.splice(index,1);

		}else{
			checkedResources.push(id);
			allChecked = this.state.checkAll;
		}

		this.setState({
			checkedResources: checkedResources,
			checkAll: allChecked
		})
	}

    //	Delete list
	deleteList(list){
		this.setState({
			checkedResources: [],
			checkAll: false
		});
		this.props.deleteResources(list)
		.then(() => this.requestMyResources(true));
	}

	//	Delete single
	deleteSingle(el){
		this.setState({
			checkedResources: [],
			checkAll: false
		});
		this.props.deleteResource(el)
		.then(() => this.requestMyResources(true));
	}

	// Approve or not
	setApprove(status, el, message, messagesList){
		this.props.setApproved({status, message, messagesList}, el.id)
		.then(() => this.requestMyResources(true));

		this.setState({
			lastApprovalEl: el,
			showUndo: true
		})
	}

	undoApproval(){
		if (this.state.lastApprovalEl && this.state.showUndo){
			this.props.setApprovedUndo({
				approvedScientific: this.state.lastApprovalEl.approvedScientific,
				approvedLinguistic: this.state.lastApprovalEl.approvedLinguistic,
				approved: this.state.lastApprovalEl.approved,
				status: this.state.lastApprovalEl.status
			},
			this.state.lastApprovalEl.id)
			.then(() => this.requestMyResources(true));
	
			this.setState({
				lastApprovalEl:null,
				showUndo: false
			})
		}
		
	}

	renderFilters(){
		return(
			<div className="margin__bottom--30">
				{ /* Search container */}								
				<SearchContainer key="search-container"
					submitOnUpdate={true}
					shouldInit={true}
					location={this.props.location}
					placeholder="Procurar recursos..."
					onSubmit={this.onChangeTags}
					/>

				<ResourceFiltersContext.Consumer>
					{({open, toggleFilters}) => (
						<div className={"advanced-search__open text-right" + (open ? " open" : "")}>
							
								<button 
									type="button" 
									className="cta no-border no-bg" 
									onClick={toggleFilters}
								>																
									Pesquisa avançada 
									{ open ? <i className="fa fa-chevron-up margin__left--15"></i> : <i className="fa fa-chevron-down margin__left--15"></i>}
								</button>

							
						</div>
					)}
				</ResourceFiltersContext.Consumer>

				<ResourceFiltersContext.Consumer>
					{({open, toggleFilters}) => (
						<AdvancedSearch location={this.props.location} open={open} toggleFilters={toggleFilters} onSubmit={this.onTermsSubmit}/>
					)}
					
				</ResourceFiltersContext.Consumer>
			</div>
		)
	}

	render() {
		const { resources } = this.props;

		let title = this.props.match.params && this.props.match.params.type ? getPage(this.props.match.params.type) : "Os meus recursos";

		if (!resources || !resources.data)
			return (
				<div className="resources__page my-resources">
					<div className="row">
						<div className="col-xs-12">
							<h2 className="pannel-title">{title}</h2>
						</div>
					</div>					
					<div className="row">
						<div className="col-xs-12">
							<section className="row resources-search">
								<div className="col-xs-12 text-center">
									{this.renderFilters()}
								</div>
							</section>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<p className="text-center">Não foram encontrados resultados.</p>
						</div>
					</div>
				</div>
			
			);

		return (
			<div className="resources__page my-resources dashboard">
				<UndoPortal 
					open={this.state.showUndo}
					onUndo={this.undoApproval}
				/>
				<div className="row">
					<div className="col-xs-12">
						<h2 className="pannel-title">{title}</h2>
					</div>
				</div>
				<div className="row">
				{this.props.resources && this.props.resources.data && this.props.resources.data.length >= 0 ?
					<div className="col-xs-12">		
						{this.props.match.params && this.props.match.params.type && this.props.match.params.type=='pendentes' &&
							<section className="row resources__page--filter">
								<div className="col-xs-12 filter-container">
									{this.renderFilters()}
								</div>
							</section>	
						}			

						
						{this.props.resources.data && this.props.resources.data.length>0 &&
							<section className="row resources-actions">
								{!this.state.toApprove && !this.props.match.params.type && this.props.resources && this.props.resources.data && this.props.resources.data.length>0 && <div className="col-xs-6">
									<input type="checkbox" name="selected-resources" id="selected-resources" checked={this.state.checkAll}/>
									<label htmlFor="selected-resources" onClick={this.checkAllResources}></label>
									<DeleteCollective className="btn btn-danger" deleteList={this.deleteList} items={this.state.checkedResources}><i className="fa fa-trash"></i></DeleteCollective>
								</div>}
								
								<div className={!this.state.toApprove && !this.props.match.params.type ? "col-xs-6" : "col-xs-12"}>
									{/* Ordering Options */}
									<ResourcesOrdering onChange={this.onListOrder} order={this.state.order}/>
								</div>
							</section>
						}

						{/* Total Results */}
						<h4 className="margin__bottom--15"><strong>{this.props.resources.total}</strong> <span className="de-emphasize">Resultados</span></h4>


						{/* Resources List */}
						<ResourcesList 
							toApprove={this.state.toApprove}
							actions={(!this.props.match.params.type || this.props.match.params.type=='pendentes')}
							config={this.props.config.data}
							list={this.props.resources} 
							user={this.props.auth.data} 
							setHighlight={this.setHighlight} 
							setFavorite={this.setFavorite}
							checkedList={this.state.checkedResources} 
							checkEl={this.checkEl} 
							allChecked={this.state.checkAll}
							deleteSingle={this.deleteSingle}
							setApprove={this.setApprove}
							disapproveMessages={this.props.messages}
						/>

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
					</div>
					:
					<div className="col-xs-12 text-center">
						<p>Não existem resultados a disponibilizar.</p>
					</div>
				}
				</div>					
			</div>
		);
	}
}

MyResources.propTypes = {
	resources: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	config: PropTypes.object.isRequired,
	location: PropTypes.object
}
