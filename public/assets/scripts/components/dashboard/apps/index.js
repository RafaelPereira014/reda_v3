'use strict';

import React from 'react';

// Components
import AppsList from '#/containers/dashboard/apps';
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
						{/* Apps List */}
						<AppsList location={props.location} />
					</div>
				</div>
			</div>
		</div>
	);
}