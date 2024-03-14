'use strict';

import React from 'react';
import PendingCommentsContainer from '#/containers/dashboard/comments/pending';
import DashboardMenuContainer from '#/containers/dashboard/menu';

export default (props) => {
	return (
		<div className="light__page">
			<div className="container">
				<div className="row">
					<div className="col-xs-12 col-md-3">
						<DashboardMenuContainer location={props.location} {...props}/>
					</div>
					<div className="col-xs-12 col-md-9">
						{/* Resources List */}
						<PendingCommentsContainer params={props.match.params} location={props.location}/>
					</div>
				</div>
			</div>
		</div>
	);	
}