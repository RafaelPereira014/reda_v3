import apiPath from '#/appConfig';
import ReactGA from 'react-ga';
// Utils
import { setUrl } from '#/utils';

export const downloadFile = (el) => {
	if (el.currentTarget.getAttribute('href')){
		ReactGA.ga('send', 'event', 'File', 'Download', setUrl(apiPath.domain+el.currentTarget.getAttribute('href').replace(/^\/|\/$/g, '')));
	}
}