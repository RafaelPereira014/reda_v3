'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';

// Utils
import { scrollToTop } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import _ from 'lodash';

// Components
import { List } from '#/components/dashboard/common/list';
import DeleteCollective from '#/components/common/deleteCollective';
import Order from '#/components/common/genericOrder';

// Bootstrap
import Pagination from 'react-bootstrap/lib/Pagination';
export default class AppApps extends Component {
	_isMounted = false;

	constructor(props){
		super(props);
		
		//
		//	Event handlers
		//
		this.onChangePage = this.onChangePage.bind(this);
		this.onListOrder = this.onListOrder.bind(this);

		//
		// Resources actions
		// 
		this.checkAll = this.checkAll.bind(this);
		this.checkEl = this.checkEl.bind(this);
		this.deleteList = this.deleteList.bind(this);
		this.deleteSingle = this.deleteSingle.bind(this);

		//
		//	Helpers
		//
		this.requestNewData = this.requestNewData.bind(this);

		//
		//	Set state
		//
		this.resetState = {
			activePage: 1,
			order: "recent",
			checked: [],
			checkAll: false,
			systems: []
		}

		this.state = this.resetState;

		this.firstRender = true;
	}

	componentDidMount(){
		this._isMounted = true;

		// Set initial data
		let initialData = this.resetState;

		// Has queryString?
		if(this.props.location.search && !_.isEmpty(this.props.location.search)){
			var query = parseQS(this.props.location.search);
			const { pagina, ordem } = query;

			initialData.activePage = parseInt(pagina) || initialData.activePage;
			initialData.order = ordem || initialData.order;
		}

		if(this._isMounted){
			this.setState(initialData);
		}
		
		this.props.fetchMyApps(initialData)

		if(this._isMounted){
			setQueryString(initialData, {history: this.props.history}, this.props.location);		

			this.firstRender = false;
		}

	}

	shouldComponentUpdate(nextProps) {
		return nextProps.apps.fetched;
	}

	componentDidUpdate(prevProps, prevState) {
		const { activePage, order } = this.state;

		// Request new resources if there is any change AND tags didn't change.
		// This avoids request new resources each time adding a new tag in the input. It is required to press the button
		if ((prevState.activePage !== activePage ||
			prevState.order !== order) && 
			!this.firstRender){
			this.requestNewData();
			scrollToTop();

			if (this.props.location.key == prevProps.location.key){	 			
				setQueryString(this.state, {history: this.props.history}, this.props.location);
			}
		}
	}

	componentWillUnmount() {
			this.props.resetApps();
			this._isMounted = false;
	}

	//	Request new resources
	requestNewData(reset){
		const { activePage, system, order } = this.state;

		//Reset page?
		if (reset){
			this.setState({activePage: 1});
		}
		
		this.props.fetchMyApps({activePage: reset ? 1 : activePage, system, order});
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

    //	Delete list
	deleteList(list){
		this.setState({
			checked: [],
			checkAll: false
		});
		this.props.deleteApps(list)
		.then(() => this.requestNewData(true));
	}

	//	Delete single
	deleteSingle(el){
		this.setState({
			checked: [],
			checkAll: false
		});
		this.props.deleteApp(el)
		.then(() => this.requestNewData(true));
	}

	// Check elements
	checkAll(){
		if (!this.state.checkAll){
			let totalIds = [];
			for (let item of this.props.apps.data){
				totalIds.push(item.id);
			} 
			
			this.setState({
				checked: totalIds,
				checkAll: !this.state.checkAll
			});

		}else{
			this.setState({
				checked: [],
				checkAll: !this.state.checkAll
			});
		}
	}

	// Add or remove element from checked array
	checkEl(id){
		let {checked} = this.state;
		let index = checked.indexOf(id);
		let allChecked = false;

		// If exists, remove item and set as 
		if (index>=0){
			checked.splice(index,1);

		}else{
			checked.push(id);
			allChecked = this.state.checkAll;
		}

		this.setState({
			checked: checked,
			checkAll: allChecked
		})
	}

	render() {
		const { apps } = this.props;

		if (!apps.data)
			return (
				<div className="apps__page">
					<div className="row">
						<div className="col-xs-12">
							<h2 className="pannel-title">Aplicações</h2>
						</div>
					</div>
					<div className="row">
						<p className="text-center">Não foram encontrados resultados.</p>
					</div>
				</div>
			);
		
		return (
			<div className="apps__page">
				<div className="row">
					<div className="col-xs-12">
						<h2 className="pannel-title">Aplicações</h2>
					</div>
				</div>
				<div className="row">
				{this.props.apps && this.props.apps.data && this.props.apps.data.length > 0 ?
					<div className="col-xs-12">		
	
						<section className="row">
							<div className="col-xs-6">
								<input type="checkbox" name="selected-apps" id="selected-apps" checked={this.state.checkAll}/>
								<label htmlFor="selected-apps" onClick={this.checkAll}></label>
								<DeleteCollective className="btn btn-danger" deleteList={this.deleteList} items={this.state.checked}><i className="fa fa-trash"></i></DeleteCollective>
							</div>
							
							<div className="col-xs-6">
								{/* Ordering Options */}
								<Order onChange={this.onListOrder} order={this.state.order}/>
							</div>
						</section>

						{/* Total Results */}
						<h4 className="margin__bottom--15"><strong>{this.props.apps.total}</strong> <span className="de-emphasize">Resultados</span></h4>


						{/* List */}
						<List
							editTarget={'/editarapp/'}
							list={this.props.apps} 
							checkedList={this.state.checked} 
							checkEl={this.checkEl} 
							allChecked={this.state.checkAll}
							deleteSingle={this.deleteSingle}
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
					:
					<div className="col-xs-12 text-center">
						<p>Parece que ainda não adicionou recursos na REDA.</p>
					</div>
				}
				</div>					
			</div>
		);
	}
}

AppApps.propTypes = {
	apps: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	config: PropTypes.object.isRequired,
	systems: PropTypes.object.isRequired
}