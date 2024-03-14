const { debug } = require('./utils/dataManipulation');
const fs = require('fs');
const path = require('path');

export function fetchComponentsData(dispatch, components, params, query) {
    const promises = components.map(current => {
        const component = current.WrappedComponent ? current.WrappedComponent : current;

        return component.fetchData
            ? component.fetchData(dispatch, params, query)
            : null;
    });

    return Promise.all(promises);
}

/**
 * Read folder and create meta tag to include in html
 */
export function fetchAssets(folder, targetFolder){
	var fileString = '';
	var onHold = '';
	fs.readdirSync(folder).forEach(file => {
		if( file.indexOf('admin-')<0){
			if (path.extname(file) === ".css" && file.indexOf('admin-')<0){
				fileString += '<link rel="stylesheet" href="'+targetFolder+file+'">';
			}

			if (path.extname(file) === ".js"){
				if (file.indexOf('vendor')>=0){
					fileString += '<script src="'+targetFolder+file+'"></script>';
				}else{
					onHold += '<script src="'+targetFolder+file+'"></script>';
				}	  	
			}
		}
	});

	if (onHold.length>0){
		fileString += onHold;
	}

	debug(fileString, "AppINIT", 'Assets');

	return fileString;
}

/**
 * Read folder and create meta tag to include in html
 */
export function fetchAdminAssets(folder, targetFolder){
	var fileString = '';
	var onHold = '';
	fs.readdirSync(folder).forEach(file => {

		if (path.extname(file) === ".css" && file.indexOf('admin-')>=0){
			fileString += '<link rel="stylesheet" href="'+targetFolder+file+'">';
		}

		if (path.extname(file) === ".js"){
			if (file.indexOf('vendor')>=0){
				fileString += '<script src="'+targetFolder+file+'"></script>';
			}else if(file.indexOf('admin-')>=0){
				onHold += '<script src="'+targetFolder+file+'"></script>';
			}	  	
		}
		
	});

	if (onHold.length>0){
		fileString += onHold;
	}

	debug(fileString, "AppINIT", 'Assets');

	return fileString;
}