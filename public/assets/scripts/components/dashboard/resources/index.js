'use strict';

import React from 'react';
import MyResourcesContainer from '#/containers/dashboard/resources/myResources';
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
						<MyResourcesContainer params={props.match.params} location={props.location} {...props}/>
					</div>
				</div>
			</div>
		</div>
	);	
}