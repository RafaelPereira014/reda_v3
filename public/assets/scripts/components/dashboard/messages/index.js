'use strict';

import React from 'react';
import DashboardMenuContainer from '#/containers/dashboard/menu';
import MessagesList from '#/containers/dashboard/messages';

export default (props) => {
	return (
		<div className="light__page">
			<div className="container">
				<div className="row">
					<div className="col-xs-12 col-md-3">
						<DashboardMenuContainer location={props.location}/>
					</div>
					<div className="col-xs-12 col-md-9">
						{/* Messages List */}
						<MessagesList {...props} />
					</div>
				</div>
			</div>
		</div>
	);	
}