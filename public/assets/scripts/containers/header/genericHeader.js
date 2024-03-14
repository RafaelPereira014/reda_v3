'use strict';

import React from 'react';
// Components
import {Link} from 'react-router-dom';
import IsAdmin from '#/containers/auth/isAdmin';
import IsInteractor from '#/containers/auth/isInteractor';

export default (props) => {
	const { header, auth } = props;

	if (!header){
		return <div></div>
	}

	const withButton = header.link && header.link.conditions && ((header.link.conditions.admin && header.link.conditions.admin === true) || (header.link.conditions.interactors && header.link.conditions.interactors === true)) && auth.isAuthenticated;
	return(
		<div className="container text-center white-text">
			<div className="row">
				<div className="col-xs-12 col-sm-8 col-sm-offset-2">
					<h1>{header.title}</h1>				
					<p className={(withButton ? 'margin__bottom--30' : 'margin__bottom--60')}>{header.description}</p>
				</div>
				{
					// Has link and requires AUTH
					header.link && header.link.conditions && header.link.conditions.admin && header.link.conditions.admin === true
					? 
						<IsAdmin>
							<div className="col-xs-12 text-center margin__bottom--60">
								<Link to={header.link.url} className="cta primary">{header.link.title}</Link>
							</div>
						</IsAdmin>
					:
					(header.link && header.link.conditions && header.link.conditions.interactors && header.link.conditions.interactors === true
					? 
						<IsInteractor>
							<div className="col-xs-12 text-center margin__bottom--60">
								<Link to={header.link.url} className="cta primary">{header.link.title}</Link>
							</div>
						</IsInteractor>
					: 
					// Has link but doesn't have conditions
					(header.link && (!header.link.conditions || !header.link.conditions.auth)) ? 
						<div className="col-xs-12 text-center margin__bottom--60">
							<Link to={header.link.url} className="cta primary">{header.link.title}</Link>
						</div>
					:
						null)
				}
				
			</div>
			{props.children}
		</div>
	)
}