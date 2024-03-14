'use strict';

import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import highlights, {resources, resource, relatedResources, genericResource }  from './resources';
import scripts  from './scripts';
import comments  from './comments';
import badwords from './badwords';
import contacts  from './contacts';
import tools, {tool}  from './tools';
import apps, { app } from './apps';
import terms, { taxTerms, allTaxTerms, taxTerm }  from './terms';
import systems  from './systems';
import termsRels  from './relationships';
import taxonomies, { taxonomy }  from './taxonomies';
import recterms  from './recterms';
import auth from './auth';
import { user, users } from './user';
import alerts  from './alerts';
import feedback  from './feedback';
import videos  from './videos';
import news, {newsDetail}  from './news';
import filters, { filtersApps, filtersTools, filtersResources } from './filters';
import config from './config';
import headers from './headers';
import testimonials from './testimonials';
import messages from './messages';
import roles from './roles';
import dashboard from './dashboard';
import types from './types';

const rootReducer = combineReducers({
	config,
	headers,
	form,
	contacts,
	comments,
	badwords,
	resources, resource, relatedResources, highlights, genericResource,
	scripts,	
	terms,
	auth, user,	users,
	filters, filtersApps, filtersTools, filtersResources,
	alerts,
	apps, app,
	systems,
	taxonomies,
	taxonomy,
	recterms,
	taxTerms,
	allTaxTerms,
	taxTerm,
	termsRels,
	feedback,
	videos,
	news,
	newsDetail,
	testimonials,
	messages,
	roles,
	tools,
	tool,
	dashboard,
	types
}); 

export default rootReducer;