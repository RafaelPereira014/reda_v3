'use strict';

// Get page type for request
exports.isPending = (location) => {
	return location && location.indexOf('propostas/pendentes')>=0
}