'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import Comments from './comments';

// Actions
import * as alertMessages from '#/actions/message-types';

export default class CommentsListing extends Component {
	constructor(props){
		super(props);

		//
		//	Event Handlers
		//
		this.deleteComment = this.deleteComment.bind(this);
		this.getComments = this.getComments.bind(this);
		this.moreComments = this.moreComments.bind(this);

		//
		//	Set state
		//
		this.state = {
			activePage: 1,
			limit: 5
		}
	}

	componentDidMount(){
		this.getComments();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.activePage!=this.state.activePage || prevProps.auth.data!=this.props.auth.data){
			this.getComments();
		}     
	}

	// Get new comments
	getComments(){
		this.props.fetchComments(this.props.match.params, this.state);
	}

	// More comments
	moreComments(){
		this.setState({
			activePage: this.state.activePage+1
		});
	}

	// Delete comment
	deleteComment(comment){
		this.props.deleteComment(comment)
		.then(() => {
			const { comments } = this.props;
			if (comments.errorMessage){
				this.props.addAlert(alertMessages.ALERT_COMMENT_DEL_ERROR, alertMessages.ERROR)
			}else{
				this.getComments();	
			}
			
		})
	}

	renderComments(comments){
		var { isAuthenticated } = this.props.auth;

		return(
			<div className="row">
				<div className="col-xs-12">
					<Comments 
						comments={comments} 
						deleteComment={this.deleteComment} 
						editable={isAuthenticated} 
						config={this.props.config}
						curUser={this.props.auth.data && this.props.auth.data.user}
						resource={this.props.resource}/>							
				</div>						
			</div>
		);
	}

	render() {
		var comments = [];
		if (this.props.comments && this.props.comments.data){
			comments = this.props.comments.data;
		}

		if (!comments || comments.length==0 || !(comments.constructor === Array)){
			return (
				<div className="comments__container">
					<div className="row">
						<div className="col-xs-12 text-center">							
							<p className="no-comments">Ainda não foram adicionados comentários</p>
						</div>						
					</div>	
				</div>
			);
		}
		
		return (
			<div className="comments__container">
				<div className="row">
					<div className="col-xs-12">
						<h6>{comments.length}{comments.length>1 || comments.length==0 ? ' Comentários' : ' Comentário'}</h6>
					</div>						
				</div>	
				{comments && this.renderComments(comments)}		

				{this.props.comments && this.props.comments.data && this.props.comments.total>this.props.comments.data.length && <div className="row">
					<div className="col-xs-12">
						<button className="cta" title="Carregar mais comentários" onClick={this.moreComments}>Mais comentários...</button>
					</div>
				</div>}
			</div>
		);
	}
}

CommentsListing.propTypes = {
	comments: PropTypes.object.isRequired
}