'use strict';

import React from 'react';
import PropTypes from 'prop-types';


const sendEmail = (props) => {
	const { to, subject, body } = props;	
	window.location = `mailto:${to}`
	+`?subject=${encodeURIComponent(subject)}`
	+`&body=${encodeURIComponent(body)}`;
	
}

export const EmailIcon = (props) => {
	return (
		<div className="media__action" title="Enviar por E-mail" onClick={() => sendEmail(props)}>
			<i className="fa fa-envelope"></i>
		</div>
	);
}

EmailIcon.propTypes = {
	to: PropTypes.string.isRequired,
	subject: PropTypes.string.isRequired,
	body: PropTypes.string.isRequired
}