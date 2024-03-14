'use strict';

import React, { Component } from 'react';

// Components
import OptionsBanner from '#/components/about/optionsBanner';
import Contribute from '#/components/about/contribute';
import {VideosListContainer} from '#/components/about/videos';
import VisualIdentity from '#/components/about/useIdentity';
import Search from '#/components/about/search';

// Config
import appConfig from '#/appConfig';

export default class AboutIndex extends Component {
	constructor(props){
		super(props);
	}

	componentDidMount(){
		
		this.props.fetchConfig();
		this.props.fetchFromPlaylist({
			maxResults: 4,
			order: 'date',
			playlistId: appConfig.helpPlaylist
		});
	}

	render() {
		if (!this.props.config.fetched){
			return null;
		}

		return (
			<div>
				<OptionsBanner />
				<Contribute auth={this.props.auth} config={this.props.config} />
				<VideosListContainer videos={this.props.videos} idKey={'snippet.resourceId.videoId'} />
				<VisualIdentity config={this.props.config}/>
				<Search config={this.props.config}/>
			</div>
		);	
	}
}
