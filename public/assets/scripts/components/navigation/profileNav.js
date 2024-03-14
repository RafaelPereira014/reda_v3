'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import {Link} from 'react-router-dom';

export default class ProfileNav extends Component {
	constructor(props){
		super(props);
	}

	isActive(location, target){
		location = location.length > 1 ? location.replace(/^\//, '') : location;
		return location.indexOf(target)>=0 ? 'active' : '';
	}

	render() {
		const { auth } = this.props;

		return ( 
			<nav className="profile-nav"> 
				<ul>
					<li>
						<Link to={auth.data.user.role=="user" || auth.data.user.role=="student" ? "/painel/meusrecursos/favoritos" : "/painel/meusrecursos"} className={"cta gray outline " + this.isActive(this.props.location.pathname, 'painel')}>Painel</Link>
					</li>
					<li>
						<Link to="/perfil" className={"cta gray outline " + this.isActive(this.props.location.pathname, 'perfil')}>Meu perfil</Link>
					</li>
				</ul>		
			</nav>
		);
	}
}

ProfileNav.propTypes = {
	location: PropTypes.object.isRequired
}