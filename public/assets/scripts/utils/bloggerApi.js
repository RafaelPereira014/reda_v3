'use strict';

import fetch from 'isomorphic-fetch';
import AppConfig from '#/config';
import _ from 'lodash';

import Progress from 'react-progress-2';

const BASE_URL = `${AppConfig.bloggerAPI.url}/${AppConfig.bloggerAPI.blogID}`;


//
//	Get list of posts
//
function getPosts(options){
	var fullOpt = _.assign({
		maxResults: 2,
		pageToken: null
    }, options);

	const requestUrl = `${BASE_URL}/posts?key=${AppConfig.bloggerAPI.key}${convertOptions(fullOpt)}`;

	return request(requestUrl);
}

//
//	UTILS
//

// Make request
function request(endpoint, options){
	Progress && Progress.show();

	return fetch(endpoint, options)
	.then( data => {

		Progress && Progress.hide();
		return data;
	})
	.catch( err => {

		Progress && Progress.hide();
		return Promise.reject(err)
	});
}

// Convert options to sky friendly
function convertOptions(options){
	let finalString = '';

	for(let key in options){
		if (options[key]!=null){
			finalString += `&${key}=${options[key]}`;
		}		
	}

	return finalString;
}

export default {
	getPosts
}