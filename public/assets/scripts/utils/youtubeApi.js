'use strict';

// Config
import appConfig from '#/appConfig';

// Utils
import _ from 'lodash';


// Load and make request
function startRequest(cb) {
	if (typeof gapi == 'undefined'){
		if ($){
			$.getScript("https://apis.google.com/js/client.js", function(err){
				loadClient(cb, err);		
			});	
		}

		
	}else{
		loadClient(cb);
	}
	
}

function loadClient(cb){
	gapi.load('client', function(){
		gapi.client.load('youtube', 'v3', function(){
			gapi.client.setApiKey(appConfig.youtubeKey);
			cb();	
		});
	});
}

// Request channel videos
function channelVideos(options){
	var fullOpt = _.assign({
		part: 'snippet'
    }, options);

	return new Promise((resolve, reject) => { 
		startRequest((err) => {
			if (err) reject(err);
			var request = gapi.client.youtube.search.list(fullOpt);
			request.execute(function(response) {
				resolve(response);
			});	
		});
	});
}

// Request playlist videos
function playlistVideos(options){
	// Assign given options to default
	var fullOpt = _.assign({
		part: 'snippet',
		order: 'date',
		playlistId: appConfig.helpPlaylist,
		pageToken: null,
		maxResults: 6
    }, options);

	return new Promise((resolve, reject) => { 
		startRequest((err) => {
			if (err) reject(err);
			var request = gapi.client.youtube.playlistItems.list(fullOpt);
			request.execute(function(response) {
				resolve(response);
			});	
		});
	});
}

function youTubeGetID(url){
	if(url.match('https://(www.)?youtube|youtu\.be') || url.match('http://(www.)?youtube|youtu\.be')){
		url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
	}
	return null
}

export default {
	channelVideos,
	playlistVideos,
	youTubeGetID
}