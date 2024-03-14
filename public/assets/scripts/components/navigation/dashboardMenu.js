'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';

// Utils
import { toggleClass, removeClass } from '#/utils';

export default class DashboardMenu extends Component {
	constructor(props){
		super(props);

		this.dasboard_menu_list = React.createRef();
    this.backdrop = React.createRef();

		//
		//	Handle events
		//
		this.toggleMenu = this.toggleMenu.bind(this);

	}

	componentWillUnmount(){
		//	Remove open class from body on unmount
		removeClass('open',document.getElementsByTagName("BODY")[0]);
		removeClass('admin-op-menu',document.getElementsByTagName("BODY")[0]);
	}

	toggleMenu(){
		let list = this.dasboard_menu_list;
		let backdrop = this.backdrop;
		let body = document.getElementsByTagName("BODY")[0];

		toggleClass('open', list.current);
		toggleClass('open', backdrop.current);
		toggleClass('open', body);
		toggleClass('admin-op-menu', body);
	}

	isActive(location, target){
		//return location.indexOf(target)>0 ? 'active' : '';
		if (target.constructor === Array){
			var isActive = '';
			for(let item of target){
				if(location == item || (this.props.match && item===this.props.match.path)){
					isActive = 'active';
				}
			}
			return isActive
		}

		return location == target || (this.props.match && target===this.props.match.path) ? 'active' : '';
	}
	
	render() {
		return (  
			<nav className="left-menu dashboard__menu">
				<div className="backdrop" ref={this.backdrop} onClick={this.toggleMenu}></div>
				<div className="row dashboard__menu--toggle">
					<div className="col-xs-12">
						<button className="cta primary outline" onClick={this.toggleMenu}><i className="fa fa-wrench"></i>Opções de Administração</button>
					</div>
				</div>
				<div className="dashboard__menu--list" ref={this.dasboard_menu_list}>
					<div className="row dashboard__menu--title">
						<div className="col-xs-10">
							<h6>Minhas Opções</h6>
						</div>
						<div className="col-xs-2 dashboard__menu--close">
							<button type="button" className="close" aria-label="Close" onClick={this.toggleMenu}><span aria-hidden="true">&times;</span></button>
						</div>
					</div>
					
					<ul>
						{this.props.auth.data.user.role != "user" && this.props.auth.data.user.role != "student" &&
							<Fragment>
								<li className={this.isActive(this.props.location.pathname, '/painel/meusrecursos')}>
									<Link to="/painel/meusrecursos" title="Os meus recursos">Meus recursos <i className="fa fa-chevron-right"></i></Link>
								</li>		
				
								<li className={this.isActive(this.props.location.pathname, '/painel/minhaspropostas')}>
									<Link to="/painel/minhaspropostas" title="Minhas propostas de operacionalização">Minhas propostas de op.<i className="fa fa-chevron-right"></i></Link>
								</li>	
								<li className={this.isActive(this.props.location.pathname, '/painel/aplicacoes')}>
									<Link to="/painel/aplicacoes" title="Minhas aplicações">Minhas aplicações<i className="fa fa-chevron-right"></i></Link>
								</li>	
								<li className={this.isActive(this.props.location.pathname, '/painel/ferramentas')}>
									<Link to="/painel/ferramentas" title="Minhas ferramentas">Minhas ferramentas<i className="fa fa-chevron-right"></i></Link>
								</li>		
							</Fragment>					
						}

						<li className={this.isActive(this.props.location.pathname, '/painel/meusrecursos/favoritos')}>
							<Link to="/painel/meusrecursos/favoritos" title="Favoritos">Favoritos <i className="fa fa-chevron-right"></i></Link>
						</li>
						
						<li className={this.isActive(this.props.location.pathname, ['/painel/mensagens', '/painel/mensagens/:resource'])}>
							<Link to="/painel/mensagens" title="Mensagens">Mensagens <i className="fa fa-chevron-right"></i></Link>
						</li>
						{/*<li className={this.isActive(this.props.location.pathname, '/painel/comentarios-pendentes')}>
							<Link to="/painel/comentarios-pendentes" title="Comentários pendentes">Comentários pendentes <i className="fa fa-chevron-right"></i></Link>
						</li>*/}
					</ul>
					{/* <IsAdmin>
						<div className="admin-tools">
							<h6>Opções de Administrador</h6>
							<ul>
								<li className={this.isActive(this.props.location.pathname, '/painel/utilizadores')}>
									<Link to="/painel/utilizadores" title="Gestão de utilizadores">Gestão de utilizadores <i className="fa fa-chevron-right"></i></Link>
								</li>
								<li className={this.isActive(this.props.location.pathname, '/painel/recursos/pendentes')}>
									<Link to="/painel/recursos/pendentes" title="Recursos Pendentes">Recursos pendentes <i className="fa fa-chevron-right"></i></Link>
								</li>
								<li className={this.isActive(this.props.location.pathname, '/painel/propostas/pendentes')}>
									<Link to="/painel/propostas/pendentes" title="Operacionalizações pendentes">Operacionalizações pendentes <i className="fa fa-chevron-right"></i></Link>
								</li>
								<li className={this.isActive(this.props.location.pathname, '/painel/comentarios/pendentes')}>
									<Link to="/painel/comentarios/pendentes" title="Comentários pendentes">Comentários pendentes <i className="fa fa-chevron-right"></i></Link>
								</li>
								<li className={this.isActive(this.props.location.pathname, '/painel/ferramentas')}>
									<Link to="/painel/ferramentas" title="Ferramentas">Ferramentas <i className="fa fa-chevron-right"></i></Link>
								</li>
								<li className={this.isActive(this.props.location.pathname, '/painel/aplicacoes')}>
									<Link to="/painel/aplicacoes" title="Aplicações">Aplicações <i className="fa fa-chevron-right"></i></Link>
								</li>            
							</ul>
						</div>
					</IsAdmin> */}
					</div>
			</nav>
		);
	}
}

DashboardMenu.propTypes = {
	location: PropTypes.object.isRequired
}