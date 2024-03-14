'use strict';

import React from 'react';
import UsersList from '#/containers/dashboard/user/manage';
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
						<UsersList params={props.match.params} location={props.location}/>
					</div>
				</div>
			</div>
		</div>
	);	
}