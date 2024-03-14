'use strict';

import React from 'react';

// Components
import {Link} from 'react-router-dom';

// Scroll
import Scroll from 'react-scroll';
var LinkScroll = Scroll.Link;

export default () => {
	return (
		<div className="row">
			<div className="col-xs-12 about__buttons">
				<LinkScroll 
					className="cta white outline"  
					to="about-start"
					smooth={true} 
					duration={500} >
						Como utilizar a REDA?
					</LinkScroll>
				<Link to="/termosecondicoes" className="cta white outline" title="Termos e condições">Leia os "Termos e condições"</Link>
				<LinkScroll 
					className="cta white outline"
					to="about-identity"
					smooth={true} 
					duration={500} >
						Manual de identidade visual
					</LinkScroll>
			</div>
		</div>
	);	
}