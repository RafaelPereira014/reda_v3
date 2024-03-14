'use strict';

import React, { Component } from 'react';
import Comments from './comments';
import Media from 'react-bootstrap/lib/Media';
import { setDateFormat } from '#/utils';
import ConfirmBox from '#/components/common/confirmBox';

import CommentForm from '#/containers/comments/commentForm';
import IsInteractor from '#/containers/auth/isInteractor';

export default class SingleComment extends Component{
	constructor(props){
		super(props);

		this.state = {
			showForm: false
		}

		this.renderReply = this.renderReply.bind(this);
	}

	renderDelete(deleteOpt, obj){
		return(
			<ConfirmBox continueAction={()=> deleteOpt(obj.id)} className="cta secundary no-bg delete-action">
				Eliminar
			</ConfirmBox>
		);
	}

	renderReply(){
		return(
			<div className="cta secundary no-bg margin__right--15" onClick={() => this.setState({
				showForm: !this.state.showForm
			}) }>
					{this.state.showForm ? 'Fechar' : 'Responder'}
			</div>
		);
	}

	render(){
		var { comment, editable, deleteComment, config, curUser, resource } = this.props;

		const image = comment.User && comment.User.Image ? comment.User.Image.src : config.icons+"/user.png";

		const canEdit = editable && curUser && (curUser==comment.user_id || curUser.role=="admin");

		const userName = comment.User.name || (comment.User.Registration && comment.User.Registration.name) || (comment.User.organization || (comment.User.Registration && comment.User.Registration.department)) || "Anónimo";

		// Can reply if is a active user, can be editable and is only a parent comment
		const canReply = editable && curUser && comment.parentComment;

		return (
			<div className="comments__parent">
				<Media>
					<Media.Left>
						<div className="user-image" style={{"backgroundImage": `url(${image})`}}></div>					
					</Media.Left>

					<Media.Body style={{width:'100%'}}>
						{curUser && curUser.role && curUser.role=="admin" && 
							<i 
								className={"fa fa-circle is-approved" + (comment.status && comment.approved ? " approved" : (!comment.approved ? " pending" : ""))} 
								aria-hidden="true" 
								title={(comment.status && comment.approved ? " Aprovado" : (!comment.status ? "Reprovado" : (!comment.approved ? "Aguarda Aprovação" : "")))}>
							</i>
						}
						<span className="meta-info"><strong>{userName}</strong> a {setDateFormat(comment.created_at, "LLL")}</span>
						<p>{comment.text}</p>
						{ canReply ? this.renderReply(resource, comment.parentComment || null) : ""}
						{ canEdit ? this.renderDelete(deleteComment, comment) : ""}

						{this.state.showForm ?
							<IsInteractor>
								<section className="comments__parent--form">
									<CommentForm form={'ResourceCommentForm_'+comment.id} resource={resource} parent={comment.id}/>
								</section>
							</IsInteractor>              	
							: ""
						}

						{ comment.parentComment && comment.parentComment.length>0 && comment.level == 0 ? 
							comment.parentComment.map(child => {

								if (child.childComment && child.childComment.id){
									return <Comments 
										key={child.childComment.id}
										comments={[child.childComment]} 
										editable={editable} 
										deleteComment={deleteComment} 
										config={config}
										curUser={curUser}/> 
								}
							})						
							: ""}					
					</Media.Body>
				</Media>
				
			</div>
		)
	}
}