'use strict';

import React from 'react';

// Boostrap
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

export default (props) => {
	// Type tooltip
	const tooltip = (
		<Tooltip id={"popover_" + props.id} >{props.title}</Tooltip>
	);

	return(
		<OverlayTrigger placement={props.placement || 'right'} overlay={tooltip}>
			<i className={props.className || "fa fa-info-circle form-help fRight"} aria-hidden="true"></i>
		</OverlayTrigger>
	)
}