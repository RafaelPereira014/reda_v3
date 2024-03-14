'use strict';

import React from 'react';

// Components
import {Link} from 'react-router-dom';

// Scroll
import Scroll from 'react-scroll';
var LinkScroll = Scroll.Link;

export default () => {
	return (
		<section className="container about__options" id="about-start">
			<div className="row">
				<h1 className="text-center">Aceda a uma ampla biblioteca de recursos</h1>
			</div>
			<div className="row text-center">
				<article className="col-xs-6 col-sm-3">
					<i className="fa fa-search"></i>
					<p>Pesquise de forma aprofundada pelo recurso pretendido</p>
					<LinkScroll 
						className="cta primary"  
						to="about-search"
						smooth={true} 
						duration={500} >
							Pesquisar
						</LinkScroll>
				</article>
				<article className="col-xs-6 col-sm-3">
					<i className="fa fa-wrench"></i>
					<p>Recorra às nossas ferramentas e dicas para auxílio na utilização da REDA</p>
					<Link to="/ferramentas" className="cta primary">Ferramentas</Link>
				</article>
				<article className="col-xs-6 col-sm-3">
					<i className="fa fa-mobile"></i>
					<p>Temos uma variedade de aplicações para a educação ao seu dispor</p>
					<Link to="/aplicacoes" className="cta primary">Aplicações</Link>
				</article>
				<article className="col-xs-6 col-sm-3">
					<i className="fa fa-newspaper-o"></i>
					<p>Mantenha-se informado sobre os últimos acontecimentos da REDA</p>
					<Link to="/noticias" className="cta primary">Notícias</Link>
				</article>
			</div>
		</section>
	);	
}
