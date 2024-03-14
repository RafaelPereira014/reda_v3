'use strict';

import React from 'react';
import DashboardMenuContainer from '#/containers/dashboard/menu';
import MessagesList from '#/containers/dashboard/messages/details';

import {Link} from 'react-router-dom';

export default (props) => {
	return (
		<div className="light__page">
			<div className="container">
				<div className="row">
					<div className="col-xs-12 col-md-3">
						<DashboardMenuContainer location={props.location} {...props}/>
					</div>
					<div className="col-xs-12 col-md-9">
						<div className="container padding--0 margin__top--30">
							<Link to={'/painel/mensagens'} className="cta primary no-bg padding--0"><i className="fa fa-chevron-left"></i>Voltar</Link>
						</div> 
						{/* Messages List */}
						<MessagesList {...props} />
					</div>
				</div>
			</div>
		</div>
	);	
}