'use strict';

// Get page title based on type
exports.getPage = (type) => {
	switch(type){
		case 'sugestoes':
			return 'Sugestões';
		case 'experimenta':
			return 'Experimenta';
	}
}