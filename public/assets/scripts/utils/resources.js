'use strict';

// Get page type for request
exports.getType = (type) => {
	switch(type){
		case 'favoritos':
		return 'myfavorites';
		break;
		case 'pendentes':
		return 'pending';
		break;
		case 'hidden':
		return 'hidden';
		break;
	}
}

// Get page title based on type
exports.getPage = (type) => {
	switch(type){
		case 'favoritos':
		return 'Meus favoritos';
		break;
		case 'pendentes':
		return 'Recursos pendentes';
		break
	}
}