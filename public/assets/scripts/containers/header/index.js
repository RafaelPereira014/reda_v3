'use strict';

import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { fetchHeader } from '#/actions/headers';
import { withRouter } from 'react-router-dom';

// Components
import TopNav from '#/components/navigation/topNav';
import HighlightsContainer from '#/containers/highlights';
import GenericHeader from './genericHeader';
import UserResume from '#/containers/user/resume';
import AboutHeaderButtons from '#/components/about/headerButtons';


import { bindActionCreators } from 'redux';


class Header extends Component {
	constructor(props){
		super(props);

		// Those that don't have white nav
		this.noWhiteNav = [
			'recursos', 
			'noticias', 
			'novorecurso', 
			'editarrecurso',
			'sugestoes', 
			'registar',
			'registo', 
			'gerirguioes', 
			'gerirpropostas',
			'ajuda',
			'novaaplicacao',
			'editarapp',
			'mapadositio',
			'experimenta',
			'novaproposta',
			'novaligacao',
			'editarligacao',
			'novaferramenta',
			'editarferramenta',
			'faleconnosco',
			'termosecondicoes',
			'recuperarpalavrapasse',
			'fichatecnica',
			'politica-privacidade',
		];
	}

	componentDidMount(){
		this.params = null;

		// Get page type of any given
		if (this.props.match.params){
			this.params = this.props.match.params.type;
		}

		//
		//	Fetch data from dummy.json based on route
		//
		this.props.fetchHeader(this.headerType(this.props.location.pathname)[1], this.params);
	}

	componentDidUpdate(prevProps) {

		// Update labels if this is LINKS and it has changed
			if (this.props.match.params && this.props.match.params.type){
				const { type } = this.props.match.params;
			this.params = type;		

			if (prevProps.match.params.type != type) {
				this.props.fetchHeader(this.headerType(this.props.location.pathname)[1], type);
			}
		}
	}

	/* Get Page Type from LOCATION */
	headerType(location){
		location = location.length > 1 ? location.replace(/^\//, '') : location;		
		location = location.length > 1 && location.indexOf('/')>0 ? location.substring(0, location.indexOf('/')) : location;
		
		// If is home, overwrite slash with HOME-PAGE
		location = (location === "/") ? "home-page" : location;

		// Has white nav
		let containerClass = this.noWhiteNav.indexOf(location)>=0 || this.props.background==="noWhite" ? location : location + " white-nav";

		return [containerClass, location];
	}

	render() {
		// 0: container class, 1: real location
		const curPage = this.headerType(this.props.location.pathname);
		const { headers, auth } = this.props;
		
		return (
			<div className={"header-container " + curPage[0] + (this.params ? " "+this.params : "")}>
				<TopNav location={this.props.location} auth={this.props.auth}/>

				{/*Home Page Header*/}
				{curPage[1] == "home-page" && [
					<HighlightsContainer key="highlights-container"/>,							
					
				]}

				{/*Dashboard Header*/}
				{(curPage[1] == "painel" || curPage[1] == "perfil") && <UserResume location={this.props.location}/>}
				
				{/*About Header*/}
				{curPage[1] == "sobre" && 
					<GenericHeader page={curPage[1]} header={headers.data}>
						<AboutHeaderButtons />
					</GenericHeader>
				}

				{/*Generic header*/}
				{(
					curPage[1]!="painel" && 
					curPage[1]!="perfil" && 
					curPage[1]!="home-page" && 
					curPage[1]!="sobre"
					) && <GenericHeader page={curPage[1]} header={headers.data} auth={auth} />}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    headers: state.headers
});

const mapDispatchToProps = (dispatch) => { 
  return bindActionCreators({ 
		fetchHeader
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));