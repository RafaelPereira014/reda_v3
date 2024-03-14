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

// Bootstrap
import Pagination from 'react-bootstrap/lib/Pagination';

export default class PendingCommentsList extends Component {
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
		this.setApprove = this.setApprove.bind(this);

		//
		//	Helpers
		//
		this.requestComments = this.requestComments.bind(this);

		//
		//	Set state
		//
		this.state = {
			activePage: 1
		}

		this.firstRender = true;
	}

	componentDidMount(){
		// Set initial data
		let initialData = {
			activePage: this.state.activePage
		};

		// Has queryString?
		if(this.props.location.search && !_.isEmpty(this.props.location.search)){
			var query = parseQS(this.props.location.search);
			const { pagina } = query;

			initialData.activePage = parseInt(pagina) || initialData.activePage;

			// COMMENT FOR NOW, THERE IS NO ORDER FUNC AVAILABLE IN THE HTML
			//initialData.order = ordem || "recent";
		}

		this.props.fetchPending(initialData)
		.then(() => {
			this.setState({
				activePage: this.props.comments.curPage || initialData.activePage
			});

			this.firstRender = false;

			setQueryString(initialData, {history: this.props.history}, this.props.location);
		});
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.comments.fetched;
	}

	componentDidUpdate(prevProps, prevState) {

		const { activePage, order } = this.state;

		// Request new comments if there is any change
		if (((JSON.stringify(prevProps.comments.data)!=JSON.stringify(this.props.comments.data)) ||
			prevState.activePage !== activePage ||
			prevState.order !== order) && !this.firstRender){
			this.requestComments();
			scrollToTop();

			if (this.props.location.key == prevProps.location.key){	 			
				setQueryString(this.state, {history: this.props.history}, this.props.location);
			}
		}
	}

	componentWillUnmount() {
		this.props.resetComments();
	}

	//	Request new comments
	requestComments(reset){
		const { activePage } = this.state;

		//Reset page?
		if (reset){
			this.setState({
				activePage: 1
			});
		}
		
		this.props.fetchPending({
			activePage: reset ? 1 : activePage
		});
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
	setApprove(status, elId, message){
		this.props.setApproved({status, message}, elId)
		.then(() => this.requestComments(true));
	}

	render() {
		const { comments } = this.props;		

		if (!comments || !comments.data)
			return (
				<div className="comments__page my-comments">
					<div className="row">
						<div className="col-xs-12">
							<h2 className="pannel-title">Comentários pendentes</h2>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<p className="text-center">Não foram encontrados resultados.</p>
						</div>
					</div>
				</div>
			)

		return (
			<div className="comments__page my-comments">
				<div className="row">
					<div className="col-xs-12">
						<h2 className="pannel-title">Comentários pendentes</h2>
					</div>
				</div>
				<div className="row">
				{this.props.comments && this.props.comments.data && this.props.comments.data.length > 0 ?
					<div className="col-xs-12">					
						{/* Comments List */}
						<List 
							toApprove={true}
							list={this.props.comments} 
							user={this.props.auth.data} 
							setApprove={this.setApprove}
							descriptionKey={"text"}
							titleKey={"Resource.title"}
							titleSuf={"Recurso: "}
							slugKey={"Resource.slug"}
							viewTarget={"/recursos/detalhes-recurso/"}
						/>

						{/* Pagination */}
						{(() => {
							if (comments.data && comments.data.length>0 && comments.totalPages>1){
								return <Pagination
									prev
									next
									first
									last
									ellipsis
									boundaryLinks
									items={comments.totalPages}
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

PendingCommentsList.propTypes = {
	comments: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	location: PropTypes.object
}