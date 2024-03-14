'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';

// Utils
import { scrollToTop } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import _ from 'lodash';

// Components
import List from '%/components/comments/pending/list';

export default class PendingCommentsList extends Component {
	_isMounted = false;
	constructor(props){
		super(props);
		
		//
		//	Event handlers
		//
		this.onChangePage = this.onChangePage.bind(this);

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

	async componentDidMount(){

		scrollToTop();

		this._isMounted = true;

		// Set initial data
		let initialData = {
			activePage: this.state.activePage
		};

		// Has queryString?
		if (this.props.location && this.props.location.search && !_.isEmpty(this.props.location.search)){
			const query = parseQS(this.props.location.search);
			const { pagina } = query;
			
			initialData = {
					...initialData,
					activePage: parseInt(pagina) || initialData.activePage,
			};
		}

		if(this._isMounted){
			await this.props.fetchPending(initialData)
			this.setState(initialData);

			this.firstRender = false;

			setQueryString(initialData, {history: this.props.history}, this.props.location);
		}
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.comments.fetched && this._isMounted;
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
		this._isMounted = false;
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
		
		if(this._isMounted){
			this.props.fetchPending({
				activePage: reset ? 1 : activePage
			});
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

	// Approve or not
	setApprove(status, el, message){
		this.props.setApproved({status, message}, el.id)
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
					<div className="col-xs-12 margin__bottom--30">
						<h2 className="pannel-title">Comentários pendentes</h2>
					</div>
				</div>
				<div className="row">
				{this.props.comments && this.props.comments.data && this.props.comments.data.length > 0 ?
					<div className="col-xs-12">					
						{/* Comments List */}
						<List 
							list={this.props.comments}
							onPageChange={this.onPageChange}
							activePage={this.state.activePage}
							setApprove={this.setApprove}
							disapproveMessages={this.props.messages}
						/>
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