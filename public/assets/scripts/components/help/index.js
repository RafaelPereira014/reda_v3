'use strict';

import React, { Component } from 'react';

// Components
import { VideosList } from '#/components/videos/list';
import Pager from 'react-bootstrap/lib/Pager';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import {Tab} from 'react-bootstrap';

// Config
import appConfig from '#/appConfig';

// Utils
import { scrollToTop, isNode } from '#/utils';

import { parseQS } from '#/utils/history';

// Static Data
import helpText from './text';

// Scroll
import Scroll from 'react-scroll';
var scroller = Scroll.scroller;

export default class HelpIndex extends Component {
	constructor(props){
		super(props);

		//
		//	Handlers
		//
		this.getList = this.getList.bind(this);
		this.prevPage = this.prevPage.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.onPaneSelect = this.onPaneSelect.bind(this);

		this.state = {
			activeEventKey: 1
		}

	}

	componentDidMount(){
		
		this.props.fetchConfig();
		this.getList();

		if (this.props.location.search){
			var query = parseQS(this.props.location.search);
			if(query.tab){
				this.setState({activeEventKey: parseInt(query.tab)})
			}
		}
	}

	getList(pageToken){
		this.props.fetchFromPlaylist({
			order: 'date',
			playlistId: appConfig.helpPlaylist,
			pageToken: pageToken || null,
			maxResults: 12
		});
	}

	prevPage(){
		this.getList(this.props.videos.prevPageToken);
	}

	nextPage(){
		this.getList(this.props.videos.nextPageToken);
	}

	onPaneSelect(e){
		this.setState({activeEventKey: e});
	}

	render() {
		const { videos, config } = this.props;
		const {activeEventKey} = this.state;
		const hasVideos = this.props.videos.data && this.props.videos.data.items && this.props.videos.data.items.length>0;

		let helpTextData = null;
		let finalVideos = null;

		/*if (!this.props.config.fetched || !this.props.videos.fetched){
			return null;
		}*/

		if (helpText){
			helpTextData = helpText({config});
		}

		if (videos.data && videos.data.items && videos.data.items.length>0){
			finalVideos = videos.data.items.filter(video => video.snippet.title!="Private video" && video.snippet.title!="Deleted video");
		}

		return (
			<div className="light-background help-page">
				{/*Videos Section*/}
				<div className="videos__wrapper"> 
					<h1 className="text-center">Vídeos de ajuda</h1>
					<p className="text-center">Aceda a um conjunto de vídeos que o podem auxiliar na utilização da plataforma.</p>
					{!hasVideos && <p className="text-center">Não existem vídeos a disponibilizar</p>}
					<VideosList videos={finalVideos} idKey={'snippet.resourceId.videoId'} colsList={this.props.cols}/>
					{/* Pagination */}
					{videos.data && videos.data.items.length>0 && videos.pageInfo.totalResults>1 && (videos.prevPageToken || videos.nextPageToken) && <Pager>
					    	<button disabled={!videos.prevPageToken} onClick={this.prevPage} className="cta primary outline" title="Página Anterior">Anterior</button>
						    <button disabled={!videos.nextPageToken} onClick={this.nextPage} className="cta primary outline" title="Página Seguinte">Próximo</button>
						</Pager>
					}
				</div>
				

				{/*Help Text Section*/}
				{!isNode && helpTextData && helpTextData.length>0 && 
					<section className="help-text__wrapper">
						<div className="container">
							<h1 className="text-center">Como utilizar a plataforma</h1>
							
							<Tab.Container id="help-text-container" activeKey={activeEventKey} onSelect={this.onPaneSelect}>
								<div className="row">
									<div className="col-xs-12 col-sm-4 col-md-3">
										<Nav onSelect={this.onPaneSelect} className="pannels__container pannels__container--left">
											{helpTextData && helpTextData.length>0 && helpTextData.map((item, index) => {
												return (
													<NavItem eventKey={index+1} key={index}>
										            	<div dangerouslySetInnerHTML={{__html: item.title}}/>
									          		</NavItem>
												)
											})}
									    </Nav>
								    </div>
									
									<div className="col-xs-12 col-sm-8 col-md-9">
									    <Tab.Content>
									    	{helpTextData && helpTextData.length>0 && helpTextData.map((item, index) => {
												return (
													<Tab.Pane eventKey={index+1} key={index}>
														<h3>{item.title}</h3>
										            	{item.description}
									          		</Tab.Pane>
												)
											})}
									    </Tab.Content>
								    </div>
								</div>		
							</Tab.Container>	
						</div>		
					</section>
				}
			</div>	
		);	
	}
}

HelpIndex.defaultProps = {
	cols:{
		lg:3,
		md:4,
		sm:6,
		xs:6
	}
}