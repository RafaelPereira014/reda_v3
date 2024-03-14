'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Components
import Popup from '#/components/common/genericPopup';

export const EmbedIcon = (props) => {
	const { code } = props;
	return (
		<Popup 
		title="Código de incorporação" 
		className="media__action"
		description={"<code>"+_.escape(code)+"</code>"}>
			<i className="fa fa-code" title="Obter código de incorporação"></i>
		</Popup>
	);
}

EmbedIcon.propTypes = {
	code: PropTypes.string.isRequired
}