'use strict';

import React from 'react';

// Components
import ScriptsList from '#/containers/dashboard/scripts';
import PendingList from '#/containers/dashboard/scripts/pending';
import DashboardMenuContainer from '#/containers/dashboard/menu';

// Utils
import { isPending } from '#/utils/scripts';

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
						{
							isPending(props.location.pathname) ? 
								<PendingList location={props.location}/>
							: 
								<ScriptsList location={props.location}/>
						}
						
					</div>
				</div>
			</div>
		</div>
	);
}