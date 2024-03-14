'use strict';

require('es6-promise').polyfill();

import { 
	VIDEOS_REQUEST, 
	VIDEOS_SUCCESS,
	VIDEOS_FAILURE,
	VIDEOS_RESET
} from './action-types';

// Youtube
import YoutubeAPI from '#/utils/youtubeApi';

// Messages
import * as alertMessages from '#/actions/message-types';


function requestVideos(){
	return {
		type: VIDEOS_REQUEST
	}
}

function receiveVideos(data){
	return {
		type: VIDEOS_SUCCESS,
		data: data
	}
}

function videosError(message){
	return {
		type: VIDEOS_FAILURE,
		message: message
	}
}

export function resetVideos(){
	return {
		type: VIDEOS_RESET
	}
}


export function fetchFromChannel(options){
	return dispatch => {
		dispatch(requestVideos);

		YoutubeAPI.channelVideos(options)
		.then(data => {
			if (data && data.result){
				dispatch(receiveVideos(data))
			}else{
				dispatch(videosError(alertMessages.ALERT_VIDEOS_GET_ERROR));
			}
		})
		/* .catch(err => {
			console.log(err);
		}) */
	}
}

export function fetchFromPlaylist(options){
	return dispatch => {
		dispatch(requestVideos);

		YoutubeAPI.playlistVideos(options)
		.then(data => {
			if (data && data.result){
				dispatch(receiveVideos(data))
			}else{
				dispatch(videosError(alertMessages.ALERT_VIDEOS_GET_ERROR));
			}
		})
		/* .catch(err => {
			console.log(err);
		}) */
	}
}