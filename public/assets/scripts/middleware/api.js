'use strict';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import apiPath from '#/appConfig';

// Utils
import { browserHistory } from 'react-router';
import { isNode } from '#/utils';


// Actions
import * as alertMessages from '#/actions/message-types';
import * as alertActions from '#/actions/alerts';
import * as actionTypes from '#/actions/action-types';
const BASE_URL = isNode ? 'http://127.0.0.1:3000/api/' : apiPath.api;

import Progress from "react-progress-2";

function callApi(endpoint, sendToken, mustAuth, method, data) {
  let config = {};
  
  let token = !isNode ? localStorage && localStorage.getItem('reda_uid_t') : null
  config = { 
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if (data){
    config.body = JSON.stringify(data);
  }

  
  if(sendToken) {
    if(token) {
      config.headers.RedaUid = `${token}`;
      /* config.headers.Authorization = `${token}`; */
    } else if(mustAuth){
      throw "No token saved!"
    }
  }
  

  return fetch(BASE_URL + endpoint, config)
    .then(response =>{    
        return response.json()
        .then(json => { 
          return {json, response}
        })
    })
    .then(({ json, response }) => {
      if (!response.ok) {  

        return Promise.reject({error: json, response})
      }
      return json;
    }).catch(err => {

      return Promise.reject(err)
    })
}

export const CALL_API = Symbol('Call API')

export default store => next => action => {
  
  const callAPI = action[CALL_API]
  
  // So the middleware doesn't get applied to every single action
  if (typeof callAPI === 'undefined') {
    return next(action)
  }
  
  
  if(Progress && typeof Progress!=="undefined" && typeof Progress.instance!=="undefined" && !isNode){
    Progress.show();
  }
  
  return makeAPIRequest(callAPI, next, store);
  
}

function makeAPIRequest(callAPI, next, store){
  let { endpoint, types, sendToken, mustAuth, method, data, compData } = callAPI;
  let requestType = null;
  let successType = null;
  let errorType = null;

  if (types){
    [ requestType, successType, errorType ] = types;
  }
  

  // Passing the authenticated boolean back in our data will let us distinguish between normal and secret quotes
  return callApi(endpoint, sendToken, mustAuth, method, data).then(
    response => {
        if(Progress && typeof Progress!=="undefined" && typeof Progress.instance!=="undefined" && !isNode){
        Progress.hide();
      }

      // Refresh token if any given
      if (!isNode && response && response.new_token){
        localStorage.setItem('reda_uid_t', response.new_token);
      }

      // Refresh user data if any given
      if (!isNode && response && response.user){
        let stringifiedUser = JSON.stringify(response.user);
        let curUser = localStorage.getItem('user');

        // Set new user data
        localStorage.setItem('user', JSON.stringify(response.user));

        // Update state with new user info if any difference from previous
        if (stringifiedUser != curUser){
          next({
            data: {
              user: response.user,
              token: response.new_token
            },
            type: actionTypes.AUTH_SUCCESS
          })
        }           
      }

      // Continue to the requested information
      if (successType){
        next({
          data: response,
          compData,
          type: successType
        })
      }
      
    })   
    .catch((result) => {
      if(Progress && typeof Progress!=="undefined" && typeof Progress.instance!=="undefined" && !isNode){
        Progress.hide();
      }

      // Recursive if the error is a new token
      /* if (result.error && result.error.new_token){
        localStorage.setItem('reda_uid_t', result.error.new_token);
        return makeAPIRequest(callAPI, next, store);
      } */

      // If token expired, logout and remove user data
      if (result && result.error && result.error.message && result.error.message=='token_expired'){
        !isNode && localStorage.removeItem('reda_uid_t');
        !isNode && localStorage.removeItem('user');
        store.dispatch(alertActions.addAlert(alertMessages.ALERT_TOKEN_EXPIRED, alertMessages.ERROR));

        // Redirect and logout
        browserHistory.push('/');
        next({
          type: actionTypes.LOGOUT_REQUEST
        });
      }

      // Save target page if not allowed
      if (!isNode && result && result.response && result.response.status && result.response.status==401){
        localStorage.setItem('returnTo', window.location.pathname );
      }

      // Dispatch alert if any error except tokenExpired
      if (result && result.error && result.error.message && result.error.message!='token_expired'){
        !isNode && store.dispatch(alertActions.addAlert(result.error.message, alertMessages.ERROR));
      }      

      if (errorType){
        next({
          message: (result.error) ? (result.error.message || result.error) : 'There was an error.',
          status: result.response ? result.response.status : null,
          type: errorType
        })
      }
    }
  )
}