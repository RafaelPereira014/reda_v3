'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import CustomRoutes from './routes';


//	Generic configurations
//import appConfig from '#/config';

// Google Analytics
import ReactGA from 'react-ga';

// Utils
//import { isNode } from '#/utils';

/* import * as Sentry from '@sentry/browser'; */

// Init Sentry for error reporting
/* Sentry.init({
 dsn: "https://c9a61739991f4b0d9fd069156e23a716@sentry.io/1338793"
}); */



ReactGA.initialize("G-NWZ6GQDTG3");
/*if(isNode){
	ReactDOM.hydrate(
	<Root>  
		<CustomRoutes />
	</Root>
	, document.getElementById('site-canvas'));
}else{
	ReactDOM.render(
	<Root>  
		<CustomRoutes />
	</Root>
	, document.getElementById('site-canvas'));
}*/


ReactDOM.render(
	<Root>  
		<CustomRoutes />
	</Root>
	, document.getElementById('site-canvas'));