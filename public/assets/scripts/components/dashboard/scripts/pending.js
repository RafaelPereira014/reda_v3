'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';

// Utils
import { scrollToTop } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import _ from 'lodash';

// Components
import { ScriptsList } from '#/components/dashboard/scripts/pendingList';
import DeleteCollective from '#/components/common/deleteCollective';
import Order from '#/components/common/genericOrder';

// Bootstrap
import Pagination from 'react-bootstrap/lib/Pagination';

export default class PendingScripts extends Component {
	constructor(props){
		super(props);
		
		//
		//	Event handlers
		//
		this.onChangePage = this.onChangePage.bind(this);
		this.onListOrder = this.onListOrder.bind(this);
		this.checkAllResources = this.checkAllResources.bind(this);
		this.checkEl = this.checkEl.bind(this);
		this.deleteList = this.deleteList.bind(this);
		this.deleteSingle = this.deleteSingle.bind(this);
		this.setApprove = this.setApprove.bind(this);

		//
		//	Helpers
		//
		this.requestNewData = this.requestNewData.bind(this);

		//
		//	Set state
		//
		this.state = {
			activePage: 1,
			order: "recent",
			checkedScripts: [],
			checkAll: false,
			toApprove: false
		}

		this.firstRender = true;
	}

	UNSAFE_componentWillMount(){
		this.props.resetScripts();
	}

	componentDidMount(){
		let initialData = this.state;

		// Has queryString?
		if(this.props.location.search && !_.isEmpty(this.props.location.search)){
			var query = parseQS(this.props.location.search);
			const { pagina } = query;

			initialData.activePage = parseInt(pagina) || initialData.activePage;

			// COMMENT FOR NOW, THERE IS NO ORDER FUNC AVAILABLE IN THE HTML
			//initialData.order = ordem || "recent";
		}

		this.setState(initialData);

		this.props.fetchConfig();
		
		this.props.fetchPending(initialData)
		.then(() => {
			this.firstRender = false;
			setQueryString(initialData, {history: this.props.history}, this.props.location);
		})

		if (this.props.auth.data && this.props.auth.data.user && this.props.auth.data.user.role=='admin'){
			this.props.fetchMessages(null, 'disapprove', 'scripts');
		}
		
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.scripts.fetched
	}

	componentDidUpdate(prevProps, prevState) {
		const { activePage, order } = this.state;

		// Request new scripts if there is any change AND tags didn't change.
		// This avoids request new scripts each time adding a new tag in the input. It is required to press the button
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
		this.props.resetScripts();
	}

	//	Request new scripts
	requestNewData(reset){
		const { activePage, order } = this.state;

		//Reset page?
		if (reset){
			this.setState({activePage: 1});
		}
		
		this.props.fetchPending({activePage: reset ? 1 : activePage, order});
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

    // Approve or not
	setApprove(status, elId, message, messagesList){
		this.props.setApproved({status, message, messagesList}, elId)
		.then(() => this.requestNewData(true));
	}

	// Check elements
    checkAllResources(){
			if (!this.state.checkAll){
				let totalIds = [];
				for (let item of this.props.scripts.data){
					totalIds.push(item.id);
				} 
				
				this.setState({
					checkedScripts: totalIds,
					checkAll: !this.state.checkAll
				});

			}else{
				this.setState({
					checkedScripts: [],
					checkAll: !this.state.checkAll
				});
			}
    }

    // Add or remove element from checked array
    checkEl(id){
			let {checkedScripts} = this.state;
			let index = checkedScripts.indexOf(id);
			let allChecked = false;

			// If exists, remove item and set as 
			if (index>=0){
				checkedScripts.splice(index,1);

			}else{
				checkedScripts.push(id);
				allChecked = this.state.checkAll;
			}

			this.setState({
				checkedScripts: checkedScripts,
				checkAll: allChecked
			})
    }

    //	Delete list
	deleteList(list){
		this.setState({
			checkedScripts: [],
			checkAll: false
		});
		this.props.deleteScripts(list)
		.then(() => this.requestNewData(true));
	}

	//	Delete single
	deleteSingle(el){
		this.setState({
			checkedScripts: [],
			checkAll: false
		});
		this.props.deleteScript(el)
		.then(() => this.requestNewData(true));
	}

	render() {
		const { scripts, config } = this.props;

		if(!config.data || config.data.length==0){
			return null;
		}

		if (!scripts.fetched || !scripts.data || (this.props.scripts.data && this.props.scripts.data.length == 0)){
			return (
				<div className="scripts__page">
					<div className="row">
						<div className="col-xs-12">
							<h2 className="pannel-title">Propostas de operacionalização pendentes</h2>
						</div>
					</div>
					<div className="row">
						<p className="text-center">Não foram encontrados resultados.</p>
					</div>
				</div>
			);
		}

		return (
			<div className="scripts__page">
				<div className="row">
					<div className="col-xs-12">
						<h2 className="pannel-title">Propostas de operacionalização pendentes</h2>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12">		
						<section className="row scripts-actions">
							<div className="col-xs-6">
								<input type="checkbox" name="selected-scripts" id="selected-scripts" checked={this.state.checkAll}/>
								<label htmlFor="selected-scripts" onClick={this.checkAllResources}></label>
								<DeleteCollective className="btn btn-danger" deleteList={this.deleteList} items={this.state.checkedScripts}><i className="fa fa-trash"></i></DeleteCollective>
							</div>
							
							<div className="col-xs-12">
								{/* Ordering Options */}
								<Order onChange={this.onListOrder} order={this.state.order}/>
							</div>
						</section>

						{/* Total Results */}
						<h4 className="margin__bottom--15"><strong>{this.props.scripts.total}</strong> <span className="de-emphasize">Resultados</span></h4>
						

						{/* List */}
						<ScriptsList
							list={this.props.scripts}
							viewTarget={'/recursos/detalhes-recurso/'}
							disapproveMessages={this.props.messages}
							toApprove={true}
							actions={true}
							checkedList={this.state.checkedScripts} 
							checkEl={this.checkEl} 
							allChecked={this.state.checkAll}
							deleteSingle={this.deleteSingle}
							user={this.props.auth.data} 
							setApprove={this.setApprove}
							config={this.props.config.data}
							/>

						{/* Pagination */}
						{(() => {
							if (scripts.data && scripts.data.length>0 && scripts.totalPages>1){
								return <Pagination
									prev
									next
									first
									last
									ellipsis
									boundaryLinks
									items={scripts.totalPages}
									maxButtons={5}
									activePage={this.state.activePage}
									onSelect={this.onChangePage} />
							}
						})()}
					</div>				
				</div>					
			</div>
		);
	}
}

PendingScripts.propTypes = {
	scripts: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	config: PropTypes.object.isRequired,
	location: PropTypes.object
}