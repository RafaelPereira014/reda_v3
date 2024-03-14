'use strict';

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import {Link} from 'react-router-dom';

// Utils
import { toggleClass, removeClass } from '#/utils';

// Components
import Navbar from 'react-bootstrap/lib/Navbar';
import LoginButton from '#/components/auth/loginButton';
import LogoutButton from '#/components/auth/logoutButton';
/* import ConfirmBox from '#/components/common/externalConnection';
 */import SearchContainer from '#/containers/search';
import AdvancedSearch from '#/containers/search/advancedSearch';

import IsAuthenticated from '#/containers/auth/isAuth';
import IsNotAuthenticated from '#/containers/auth/isNotAuth';
import IsAdmin from '#/containers/auth/isAdmin';

// Contexts
import { ResourceFiltersContext } from '#/contexts/resources/filters';
import AdvancedSearchRefactor from '#/containers/search/advancedSearchRefactor';


export default class TopNav extends Component {
	constructor(props){
		super(props);

		this.state = {
			advancedSearchShow : false
		}

		//	Refs
		this.menu_backdrop = React.createRef();

		//
		//	Handle events
		//
		this.onToggle = this.onToggle.bind(this);
		this.reset = this.reset.bind(this);
		
		//
		//	Renders
		//
		this.renderSmallNav = this.renderSmallNav.bind(this);
	}

	componentDidMount() {
		//	Remove open class from body on unmount
		removeClass('open',document.getElementsByTagName("BODY")[0]);
		removeClass('site-menu',document.getElementsByTagName("BODY")[0]);
	}

	componentWillUnmount(){
		this.reset();
	}

	componentDidUpdate(prevProps) {
		if (this.props.location.pathname != prevProps.location.pathname){
			this.reset();
		}
	}

	reset(){
		//	Remove open class from body on unmount
		removeClass('open',document.getElementsByTagName("BODY")[0]);
		removeClass('site-menu',document.getElementsByTagName("BODY")[0]);
		removeClass('open',this.menu_backdrop.current);
		removeClass('open',document.querySelector(".nav-container"));
	}

	onToggle(){
		let item = document.querySelector(".nav-container");
		let backdrop = this.menu_backdrop.current;
		let body = document.getElementsByTagName("BODY")[0];

		toggleClass('open', item);
		toggleClass('open', backdrop);
		toggleClass('open', body);
		toggleClass('site-menu', body);
	}

	getLocation(location){
		location = location.length > 1 ? location.replace(/^\//, '') : location;
		location = location.length > 1 && location.indexOf('/') > 0 ? location.substring(0, location.indexOf('/')) : location;

		return location
	}

	isActive(location, target){
		location = location.length > 1 ? location.replace(/^\//, '') : location;
		return location === target ? 'active' : '';
	}

	isActivePartOf(location, target){	
		// If array of values	
		if (target.constructor === Array){
			var isActive = '';
			for(let item of target){
				if(this.getLocation(location).indexOf(item)>=0){
					isActive = 'active';
				}
			}
			return isActive
		}

		// If not
		return this.getLocation(location).indexOf(target)>=0 ? 'active' : '';
	}

	renderSmallNav(){
		return(
			<ul className="nav navbar-nav small-nav">
				<IsNotAuthenticated>
					<li>
						<LoginButton location={this.props.location.pathname}>
							Entrar
						</LoginButton>
					</li>
				</IsNotAuthenticated>
				{/* <li className={this.isActive(this.props.location.pathname, 'ligacoes/experimenta')}>
					<Link to="/ligacoes/experimenta">Estudantes</Link>
				</li> */}

				<IsNotAuthenticated>
					<li className={this.isActive(this.props.location.pathname, 'registar')}>
						<Link to="/registar">Registar</Link>
					</li>
				</IsNotAuthenticated>	

				<li className={this.isActive(this.props.location.pathname, 'ajuda')}>
					<Link to="/ajuda">Ajuda</Link>
				</li>

				{/*<li className={this.isActive(this.props.location.pathname, 'mapadositio')}>
					<Link to="/mapadositio">Mapa do Sítio</Link>
				</li>*/}
				
				<IsAuthenticated>
					{this.props.auth.data &&  this.props.auth.data.user &&
					<li className={"user-identification "+this.isActivePartOf(this.props.location.pathname, ['painel', 'perfil'])}>
						<Link to={this.props.auth.data.user.role=="user" || this.props.auth.data.user.role=="student" ? "/painel/meusrecursos/favoritos" : "/painel/meusrecursos"}>Minha conta</Link>
					</li>}
				</IsAuthenticated>

				<IsAdmin>
					<li className={"user-identification "+this.isActive(this.props.location.pathname, 'dashboard')}>
						<a href="/dashboard" target="_blank">Administração</a>
					</li>
				</IsAdmin>

				<IsAuthenticated>
					<LogoutButton />
				</IsAuthenticated>
			</ul>
		)
	}

	render() {
		const { isAuthenticated } = this.props.auth;

		return (  
			<Navbar onToggle={this.onToggle}>
				<div className="backdrop" ref={this.menu_backdrop} onClick={this.onToggle}></div>
				<div className={"row"}>
					<div className="col-xs-12 col-sm-12 col-md-3">
						<Navbar.Header>
							<Navbar.Brand>
								<a href="/"><img src="/assets/graphics/REDA_logo.png" alt="Recursos Educativos Digitais e Abertos (REDA) é uma plataforma dedicada à disponibilização de conteúdos educativos para a comunidade escolar." title="Recursos Educativos Digitais e Abertos (REDA) é uma plataforma dedicada à disponibilização de conteúdos educativos para a comunidade escolar." className="img-responsive"/></a>
							</Navbar.Brand>
							<Navbar.Toggle/>
						</Navbar.Header>
					</div>

					<div className="col-xs-6 col-sm-9">
						<div className="nav-container nav navbar-nav">
							<div className="row nav-container-small-device">
								{/* Title */}
								<div className="col-xs-10 nav-container--title">
									<h6>Menu</h6>
								</div>
								{/* Close Button */}
								<div className="col-xs-2 nav-container--close">
									<button type="button" className="close" aria-label="Close" onClick={this.onToggle}><span aria-hidden="true">&times;</span></button>
								</div>
							</div>



							<div className={"menu-container"}>

								{this.renderSmallNav(isAuthenticated)}

								{ /* Search container */}        
								<SearchContainer key="search-container"
								submitOnUpdate={this.isActivePartOf(this.props.location.pathname, 'recursos')==='active'}
								shouldInit={this.isActivePartOf(this.props.location.pathname, 'recursos')==='active'}
								location={this.props.location}
								placeholder="Procurar recursos..."/>
								

								<ul className="nav navbar-nav big-nav" role="navigation">
									<li className={this.isActive(this.props.location.pathname, '/')}>
										<Link to="/" title="Início">Início</Link>
									</li>
									<li className={this.isActivePartOf(this.props.location.pathname, 'recursos')}>
										<Link to="/recursos" title="Recursos">Recursos</Link>
									</li>
									<li className={this.isActive(this.props.location.pathname, 'aplicacoes')}>
										<Link to="/aplicacoes" title="Aplicações">Aplicações</Link>
									</li>	
									<li className={this.isActive(this.props.location.pathname, 'ferramentas')}>
										<Link to="/ferramentas" title="Ferramentas">Ferramentas</Link>
									</li>
									{/*<li className={this.isActivePartOf(this.props.location.pathname, 'noticias')}>
										{/* <ConfirmBox target="https://www.facebook.com/www.redazores.pt/" type="Publicações" title="Publicações">Publicações</ConfirmBox> */}
										{/*<Link to="/noticias" title="Publicações">Publicações</Link>
									</li> 
									{/* <li>
										<ConfirmBox target="http://reda.forumeiros.com/" type="Fórum" title="Fórum">Fórum</ConfirmBox>
									</li>  */}
									{
										this.isActive(this.props.location.pathname, 'recursos') === 'active' &&	
											<ResourceFiltersContext.Consumer>
												{({open, toggleFilters}) => (
													<li className={"advanced-search__open fRight" + (open ? " open" : "")}>
														
															<button 
																type="button" 
																className="cta no-border no-bg" 
																onClick={toggleFilters}
															>																
																Pesquisa avançada 
																{ open ? <i className="fa fa-chevron-up margin__left--15"></i> : <i className="fa fa-chevron-down margin__left--15"></i>}
															</button>

														
													</li>
												)}
											</ResourceFiltersContext.Consumer>
										}
								</ul>								
							</div>
						</div>
					</div>
				</div>
				
				{
					/*this.isActive(this.props.location.pathname, 'recursos') === 'active' && 
					<ResourceFiltersContext.Consumer>
						
							{({open, filtersDidReset, toggleFiltersReset, toggleFilters}) => (
								<AdvancedSearch
									location={this.props.location}
									open={open}
									toggleFilters={toggleFilters}
									filtersDidReset={filtersDidReset}
									toggleFiltersReset={toggleFiltersReset} />
							)}
						
							</ResourceFiltersContext.Consumer>*/
							}


{this.isActive(this.props.location.pathname, 'recursos') === 'active' && 
			
					
					<ResourceFiltersContext.Consumer>
						
							{({open, filtersDidReset, toggleFiltersReset, toggleFilters}) => (
								<AdvancedSearchRefactor
									location={this.props}
									open={open}
									toggleFilters={toggleFilters}
									filtersDidReset={filtersDidReset}
									toggleFiltersReset={toggleFiltersReset} />
							)}
						
						
						</ResourceFiltersContext.Consumer>
							}
				
			</Navbar>
		);
	}
}

TopNav.propTypes = {
	location: PropTypes.object.isRequired
}