'use strict';

import React from 'react';
import Rating from 'react-rating';

// Boostrap
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

export default ({setRating, ...props}) => {
	const { readonly, initialRate } = props;

	return (
		<span className={"rating-wrapper" + (readonly ? " disabled" : "")}>
			{readonly ? 
				<OverlayTrigger placement="top"  overlay={<Tooltip id={"Rating"}>{initialRate || 0}</Tooltip>}>
					<span>
						<Rating {...props} onClick={setRating} empty="fa fa-star-o" full="fa fa-star"/>
					</span>                            
				</OverlayTrigger>
			:
				<Rating {...props} onClick={setRating} empty="fa fa-star-o" full="fa fa-star"/>
			}
			
		</span>
	);
}