'use strict';

require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import apiPath from '#/appConfig';

import { 
	AUTH_REQUEST, 
	AUTH_SUCCESS,
	AUTH_FAILURE,
	AUTH_RESET,
	LOGOUT_REQUEST,
	SIGNUP_REQUEST, 
	SIGNUP_SUCCESS,
	SIGNUP_FAILURE,
	SIGNUPCONFIRM_REQUEST, 
	SIGNUPCONFIRM_SUCCESS,
	SIGNUPCONFIRM_FAILURE,
	AUTH_RESET_ERRORS
} from './action-types';

import * as alertMessages from './message-types';
import * as alertActions from './alerts';

// Utils
import { isNode } from '#/utils';

const BASE_API = isNode ? 'http://127.0.0.1/api/' : apiPath.api;

// LOGIN
function requestLogin(){
	return {
		type: AUTH_REQUEST
	}
}

export function receiveLogin(data){
	return {
		type: AUTH_SUCCESS,
		data: data
	}
}

function loginError(errors){
	return {
		type: AUTH_FAILURE,
		errors
	}
}

export function resetErrors(){
	return {
		type: AUTH_RESET_ERRORS
	}
}

export function loginUser(props){
	let config = {
		method: 'POST',
		headers: { 'Content-Type':'application/x-www-form-urlencoded' },
		body: `email=${encodeURIComponent(props.email)}&password=${encodeURIComponent(props.password)}`
	}

	return dispatch => {
		dispatch(requestLogin());

		/* Change this to API Call */
		return fetch(BASE_API+'users/signin', config)
		.then(response => {
			if (!response.ok) {	 
				let message = response.status == 401 ? "Email ou Palavra-chave incorretos" : "Não foi possível entrar. Contate o administrador da REDA";
				dispatch(loginError(message));
				return Promise.reject(message);
			}

			return response.json();
		})
		.then(json => {

			// If login was successful, set the token in local storage
			!isNode && localStorage.setItem('reda_uid_t', json.token);
			!isNode && localStorage.setItem('user', JSON.stringify(json.user));

			dispatch(alertActions.addAlert(alertMessages.ALERT_LOGIN_SUCCESS, alertMessages.SUCCESS))
			dispatch(receiveLogin(json));			
		})
		.catch(errors => {
			dispatch(loginError(errors));
		})
	}
}

export function logout(){
	return dispatch => {
		!isNode && localStorage.removeItem('reda_uid_t');
		!isNode && localStorage.removeItem('user');
		dispatch(alertActions.addAlert(alertMessages.ALERT_LOGOUT_SUCCESS, alertMessages.SUCCESS));
		dispatch(requestLogout());		
	}
}

function requestLogout(){
	return {
		type: LOGOUT_REQUEST
	}
}

// SIGNUP
function requestSignup(){
	return {
		type: SIGNUP_REQUEST
	}
}

function receiveSignup(data){
	return {
		type: SIGNUP_SUCCESS,
		data: data
	}
}

function signupError(errors){
	return {
		type: SIGNUP_FAILURE,
		errors
	}
}

export function signupUser(props){

	let config = {
		method: 'POST',
		headers: { 'Content-Type':'application/x-www-form-urlencoded' },
		body: `email=${encodeURIComponent(props.email)}&password=${encodeURIComponent(props.password)}&authKey=${encodeURIComponent(props.authKey)}&organization=${encodeURIComponent(props.organization)}&name=${encodeURIComponent(props.name)}&type=${encodeURIComponent(props.userType.type)}&acceptance=${encodeURIComponent(props.acceptance)}`
	}

	return dispatch => {
		dispatch(requestSignup());

		/* Change this to API Call */
		return fetch(BASE_API+'users/signup', config)
		.then(response =>{  
				return response.json()
				.then(json => { 
					return {json, response}
				})
		})
		.then(({ json, response }) => {

			if (!response.ok) {					
				let message = json.message || "Não foi possível registar. Contate o administrador da REDA";
				dispatch(signupError(message));
				return Promise.reject(message);
			}

			dispatch(alertActions.addAlert(alertMessages.ALERT_SIGNUP_SUCCESS, alertMessages.SUCCESS))
			dispatch(receiveSignup(json));	
		})
		.catch(errors => {
			dispatch(signupError(errors));
		})
	}
}

// Confirm signup
function requestSignupConfirm(){
	return {
		type: SIGNUPCONFIRM_REQUEST
	}
}

function receiveSignupConfirm(data){
	return {
		type: SIGNUPCONFIRM_SUCCESS,
		data: data
	}
}

function signupErrorConfirm(errors){
	return {
		type: SIGNUPCONFIRM_FAILURE,
		errors
	}
}

export function confirmSignup(token){

	let config = {
		method: 'GET',
	}

	return dispatch => {
		dispatch(requestSignupConfirm());

		/* Change this to API Call */
		return fetch(BASE_API+'users/confirm/'+token, config)
		.then(response =>{  
			return response.json()
			.then(json => { 
				return {json, response}
			})
		})
		.then(({ json, response }) => {

			if (!response.ok) {					
				let message = json.message || "Não foi possível confirmar o registo. Contate o administrador da REDA";
				dispatch(signupErrorConfirm(message));
				return Promise.reject(message);
			}

			//dispatch(alertActions.addAlert(alertMessages.ALERT_SIGNUPCONFIRM_SUCCESS, alertMessages.SUCCESS))
			dispatch(receiveSignupConfirm(json));	
		})
		.catch(errors => {
			dispatch(signupErrorConfirm(errors));
		})
	}
}


// RECOVER
function requestRecover(){
	return {
		type: AUTH_REQUEST
	}
}

export function recoverError(errors){
	return {
		type: AUTH_FAILURE,
		errors
	}
}

function resetRecover(){
	return {
		type: AUTH_RESET
	}
}

export function submitRequestRecover(data){
	let config = {
		method: 'POST',
		headers: { 'Content-Type':'application/json' },
		body: JSON.stringify(data)
	}

	return dispatch => {
		dispatch(requestRecover());

		/* Change this to API Call */
		return fetch(BASE_API+'users/request-recover', config)
		.then(response =>{  
				return response.json()
				.then(json => { 
					return {json, response}
				})
		})
		.then(({ json, response }) => {

			if (!response.ok) {					
				let message = json.message || "Não foi possível efetuar o pedido de recuperação. Contate o administrador da REDA se necessário.";
					dispatch(recoverError(message));
					return Promise.reject(message);
			}

			dispatch(alertActions.addAlert(alertMessages.ALERT_RECOVERREQUEST_SUCCESS, alertMessages.SUCCESS));
			dispatch(resetRecover());
		})
		.catch(errors => {
			dispatch(recoverError(errors));
		})
	}
}

export function submitNewPassword(data){
	let config = {
		method: 'POST',
		headers: { 'Content-Type':'application/json' },
		body: JSON.stringify(data)
	}

	return dispatch => {
		dispatch(requestRecover());

		/* Change this to API Call */
		return fetch(BASE_API+'users/change-recover-password', config)
		.then(response =>{  
				return response.json()
				.then(json => { 
					return {json, response}
				})
		})
		.then(({ json, response }) => {

			if (!response.ok) {					
				let message = json.message || "Não foi possível definir a nova palavra-passe. Contate o administrador da REDA se necessário.";
				dispatch(recoverError(message));
				return Promise.reject(message);
			}

			dispatch(alertActions.addAlert(alertMessages.ALERT_RECOVERNEWPASSWORD_SUCCESS, alertMessages.SUCCESS));
			dispatch(resetRecover());
		})
		.catch(errors => {
			dispatch(recoverError(errors));
		})
	}
}