'use strict';

import React, { Component } from 'react';

// Utils
import { scrollToTop, setDateFormat, truncate, isNode } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import _ from 'lodash';

//	Components
import {Link} from 'react-router-dom';
import Pagination from 'react-bootstrap/lib/Pagination';

export default class NewsList extends Component{
	_isMounted = false;
	constructor(props){
		super(props);

		this.resetState = {
			activePage: 1,
			limit: 8
		}

		this.state = this.resetState;

		this.firstRender = true;

		//
		//	Event handler
		//	
		this.onChangePage = this.onChangePage.bind(this);
	}

	componentDidMount(){
		const { config } = this.props;

		this._isMounted = true;
		this.firstRender = false;

		let initialData = this.resetState;
		let query = null;


		// Has queryString?
		if (this.props.location && this.props.location.search && !_.isEmpty(this.props.location.search)){
			query = parseQS(this.props.location.search);

			if(query.sistema){

				const { pagina, limite } = query;

				initialData = {
					activePage: parseInt(pagina) || initialData.activePage,
					limit: (limite && parseInt(limite)) || initialData.limit,
				};
			}
		}

		this.props.fetchNews(initialData);

		if(this._isMounted){
			this.setState(initialData);

			setQueryString(initialData, {history: this.props.history}, this.props.location);		

			this.firstRender = false;
		}

		// Get configurations
		!config.fetched && this.props.fetchConfig();

		scrollToTop();
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.news.fetched;   
	}

	componentDidUpdate(prevProps, prevState) {
		// Update page on param change
			const { activePage } = this.state;

		if (JSON.stringify(prevState) !== JSON.stringify(this.state) && !this.firstRender && this._isMounted){
			this.requestNew();
			
			if (activePage != prevState.activePage){
				scrollToTop();
			}

			if (this.props.location.key == prevProps.location.key){	 			
				setQueryString(this.state, {history: this.props.history}, this.props.location);
			}
		}
	}
	
	componentWillUnmount() {
		this._isMounted = false;
		this.props.resetNews();
	}

	//
	//	REQUEST NEW DATA
	//
	requestNew(){
		this.props.fetchNews(this.state);
	}

	// Handle pagination
	onChangePage(page) {
		if (page && this._isMounted){
			this.setState({
				activePage: page
			});
		}		
	}
	

	render() {
		const { news, config } = this.props;
		
		if (news.fetching){
			return <p className="margin__top--30 margin__bottom--60">A carregar...</p>;
		}

		if(!news || !news.data || news.data.length==0 || !config || !config.data){
			return <p className="text-center margin__top--30 margin__bottom--60">Não foram encontrados resultados.</p>;
		}

		return (
			<section className="light-background news__container">	
				<h1 className="text-center">Últimas Publicações</h1>

				<div className="container">
					<div className="row">
						{news.data.map((post) => {

							var div = null;
							if(!isNode){
									div = document.createElement("div");
									div.innerHTML = post.description;
							}

							const image = post.Thumbnail ? config.data.files+"/news"+"/"+post.slug + "/" + post.Thumbnail.name + "." + post.Thumbnail.extension : null;

							return (								
								<article 
								key={post.id}>
									<section>
										<header>
											<h2>
												<Link to={`/noticias/${post.slug}`}>{post.title}</Link>
											</h2>
											<small>{setDateFormat(post.created_at, 'LL')} às {`${setDateFormat(post.created_at, 'LT')}h`}</small>
											{
												image && 	<Link to={`/noticias/${post.slug}`}>
													<img src={image} className="img-responsive" />
												</Link>
											}
										</header>
										<div className="content  margin__top--15">
											{truncate(div ? div.innerText : post.description, 10)}
										</div>
										<div className="news__container--actions margin__top--30">
											<Link to={`/noticias/${post.slug}`}><em>Ler Mais &gt;</em></Link>
										</div>
									</section>
								</article>								
							)
						})}

						{/* Pagination */}
							{(() => {
								if (news.data && news.data.length>0 && news.totalPages>1){
									return <Pagination
										prev
										next
										first
										last
										ellipsis
										boundaryLinks
										items={news.totalPages}
										maxButtons={5}
										activePage={this.state.activePage}
										onSelect={this.onChangePage} />
								}
							})()}	
					</div>
				</div>		
			</section>
		)
	}
}