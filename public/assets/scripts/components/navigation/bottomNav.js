'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import {Link} from 'react-router-dom';

export default class BottomNav extends Component {
	isActive(location, target){
		location = location.length > 1 ? location.replace(/^\//, '') : location;
		return location === target ? 'active' : '';
	}

	render() {
		return ( 
			<footer className="bottom-footer"> 
				<div className="bottom-nav">
					<div className="container">
						<div className="row">
							<ul className="col-xs-12 col-sm-8">
								<li className={this.isActive(this.props.location.pathname, 'sobre')}>
									<Link to="/sobre">Sobre</Link>
								</li>
								<li className={this.isActive(this.props.location.pathname, 'ajuda')}>
									<Link to="/ajuda">Ajuda</Link>
								</li>
								<li className={this.isActive(this.props.location.pathname, 'fichatecnica')}>
									<Link to="/fichatecnica">Ficha técnica</Link>
								</li>						
								{/* <li className={this.isActive(this.props.location.pathname, 'experimenta')}>
									<Link to="/ligacoes/experimenta">Experimenta</Link>
								</li>
								<li className={this.isActive(this.props.location.pathname, 'dicasutilidades')}>
									<Link to="/dicasutilidades">Dicas e Utilidades</Link>
								</li> */}
								<li className={this.isActive(this.props.location.pathname, 'politica-privacidade')}>
									<Link to="/politica-privacidade">Política de privacidade</Link>
								</li>
								{/*<li className={this.isActive(this.props.location.pathname, 'noticias')}>
									<Link to="/noticias">Notícias</Link>
								</li>	*/}					
							</ul>
							<div className="col-xs-12 col-sm-4 feedback-button">
								<Link to="/faleconnosco" className="cta white outline">Fale connosco</Link>
							</div>
						</div>
					</div>
					
				</div>
				<section className="copyright container">
					<div className="row">
						<div className="col-xs-12 col-sm-6 col-sm-push-6 social__icons">
							<ul>
								<li><a href="https://www.facebook.com/www.redazores.pt/" title="Página no Facebook" target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook" /></a></li>
								<li><a href="https://twitter.com/Equipa_REDA" title="Perfil no Twitter" target="_blank" rel="noopener noreferrer"><i className="fa fa-twitter" /></a></li>
								<li><a href="https://plus.google.com/108205635869598577823" title="Perfil no Google Plus" target="_blank" rel="noopener noreferrer"><i className="fa fa-google-plus" /></a></li>
								<li><a href="https://www.instagram.com/redazores/" title="Perfil no Instagram" target="_blank" rel="noopener noreferrer"><i className="fa fa-instagram" /></a></li>
								<li><a href="https://www.youtube.com/channel/UCwBEu2YDEqpnNotz_ld0GrA" title="Canal do Youtube" target="_blank" rel="noopener noreferrer"><i className="fa fa-youtube" /></a></li>
								<li><a href="https://vimeo.com/user56937334" title="Canal no Vimeo" target="_blank" rel="noopener noreferrer"><i className="fa fa-vimeo" /></a></li>
								<li><a href="https://pt.pinterest.com/equipareda/" title="Perfil no Pinterest" target="_blank" rel="noopener noreferrer"><i className="fa fa-pinterest" /></a></li>
							</ul>
						</div>

						<div className="col-xs-12 col-sm-6 col-sm-pull-6">
							<div className="partners_logos">
								<img src="/assets/graphics/logos/gov_acores_transparent.png" alt="Governo dos Açores" />
								<img src="/assets/graphics/logos/dre_transparent.png" alt="Direção Regional da Educação" />
							</div>
						</div>				
					</div>

					<div className="row">
						<div className="col-xs-12 text-center">
							<ul className="app__stores">
								<li>
									{/*<a href="/assets/files/reda.apk" download>
										<img src="/assets/graphics/stores/download_android.png" alt="Google Store" title="App REDA Android" />
									</a>*/}
									<a href='https://play.google.com/store/apps/details?id=com.reda&hl=pt-PT&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1' target="_blank" rel="noopener noreferrer"><img alt='Disponível no Google Play' src='/assets/graphics/logos/pt_badge_web_generic.png'/></a>
								</li>
							</ul>
							<p>© Direção Regional da Educação - Secretaria Regional da Educação e dos Assuntos Culturais</p>
						</div>
					</div>
				</section>				
			</footer>
		);
	}
}

BottomNav.propTypes = {
	location: PropTypes.object.isRequired
}