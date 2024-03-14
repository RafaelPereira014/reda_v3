'use strict';

import React from 'react';
import Comment from './comment';

export default (props) => {
	var { comments, editable, deleteComment, config, curUser, resource } = props;

	if (!comments || comments.length==0){
		return null;
	}

	return(
		<div className="comments__children">
			{
				comments.map((comment, index) => {
					return <Comment 
					key={comment.id || index} 
					comment={comment} 
					editable={editable} 
					deleteComment={deleteComment} 
					config={config}
					curUser={curUser}
					resource={resource}/>
				})
			}
		</div>
	);
}