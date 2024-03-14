const { debug } = require('./dataManipulation');

//
//	Return document header TITLE and META tags
//
exports.buildMeta = function(meta, title) {
	var headStrings = `<title>${title}</title>`;

	if (!meta){
		return headStrings;
	}

	meta.map((tag, index) =>{
		var thisProps = "";

		Object.keys(tag).forEach(function(key,index) {
			let data = tag[key];
			if(data){
				thisProps += ` ${key}="${data.replace(/\"/g, "")}" `;
			}
		  
		});

		if(thisProps!==""){
			headStrings += `<meta data-doc-meta="true" ${thisProps} />`;
		}
		
	});

	return headStrings;
}