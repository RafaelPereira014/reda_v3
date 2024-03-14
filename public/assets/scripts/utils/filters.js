'use strict'

// Set class to a specific element, if it passed the scroll from top
exports.setScrollClass = (el, testClass, initPos) => {

	let elClass = el.getAttribute('class');
	let scrollTop = document.body.scrollTop;

	if (initPos-scrollTop<0 && elClass.indexOf('filters--fixed')<0){
		el.setAttribute('class', elClass + ' filters--fixed');
	}else if (initPos-scrollTop>0 && elClass.indexOf('filters--fixed')>=0){
		el.setAttribute('class', elClass.replace( /(?:^|\s)filters--fixed(?!\S)/g , '' ))
	}
}	