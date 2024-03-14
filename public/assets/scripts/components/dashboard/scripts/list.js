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
import Order from '#/components/common/genericOrder';

// Bootstrap
import Pagination from 'react-bootstrap/lib/Pagination';

export default class ScriptsItems extends Component {
	constructor(props){
		super(props);
		
		//
		//	Event handlers
		//
		this.onChangePage = this.onChangePage.bind(this);
		this.onListOrder = this.onListOrder.bind(this);

		//
		//	Helpers
		//
		this.requestNewData = this.requestNewData.bind(this);

		//
		//	Set state
		//
		this.state = {
			activePage: 1,
			order: "recent"
		}

		this.firstRender = true;
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

		this.props.fetchResourcesWithMyScripts(initialData)
		.then(() => {
			this.firstRender = false;
			setQueryString(initialData, {history: this.props.history}, this.props.location);
		})
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.resources.fetched;
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
		this.props.resetResources();
	}

	//	Request new resources
	requestNewData(reset){
		const { activePage, order } = this.state;

		//Reset page?
		if (reset){
			this.setState({activePage: 1});
		}
		
		this.props.fetchResourcesWithMyScripts({activePage: reset ? 1 : activePage, order});
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

	render() {
		const { resources } = this.props;

		if (!resources.data)
			return (
				<div className="scripts__page">
					<div className="row">
						<div className="col-xs-12">
							<h2 className="pannel-title">Recursos com as Minhas Contribuições</h2>
						</div>
					</div>
					<div className="row">
						<p className="text-center">Não foram encontrados resultados.</p>
					</div>
				</div>
			);
		
		return (
			<div className="scripts__page">
				<div className="row">
					<div className="col-xs-12">
						<h2 className="pannel-title">Recursos com as minhas contribuições</h2>
					</div>
				</div>
				<div className="row">
				{this.props.resources && this.props.resources.data && this.props.resources.data.length > 0 ?
					<div className="col-xs-12">		
	
						<section className="row">
							<div className="col-xs-12">
								{/* Ordering Options */}
								<Order onChange={this.onListOrder} order={this.state.order}/>
							</div>
						</section>

						{/* Total Results */}
						<h4 className="margin__bottom--15"><strong>{this.props.resources.total}</strong> <span className="de-emphasize">Resultados</span></h4>


						{/* List */}
						<List
							list={this.props.resources}
							viewTarget={'/recursos/detalhes-recurso/'}
							customTargets={[
								{
									link: '/novaproposta/',
									label: 'Adicionar proposta'
								},
								{
									link: '/gerirpropostas/',
									label: 'Gerir propostas'
								}								
							]}
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
						<p>Não foram encontrados resultados.</p>
					</div>
				}
				</div>					
			</div>
		);
	}
}

ScriptsItems.propTypes = {
	resources: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	config: PropTypes.object.isRequired,
	location: PropTypes.object
}