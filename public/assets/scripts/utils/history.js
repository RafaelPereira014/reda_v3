'use strict';
import { serializeQs } from '#/utils';
import { parse } from 'qs';

// Set queryString on URL
// state => state to apply
// router => context to update URL
// location => to get pathname and current queryString
exports.setQueryString = (state, router, location) => {
	if (router && state && location){


		const { 
			activePage,
			tags,
			res_tags,
			order,
			limit,
			system,
			role,
			term
		} = state;

		//const curQuery = parse(location.search.substring( location.search.indexOf('?') + 1 ));

		// Set queryString

	}
}

exports.parseQS = (queryString) => {
	return parse(queryString.substring( queryString.indexOf('?') + 1 ));
}