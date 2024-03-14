import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default ({
	meta: { 
		touched, 
		error, 
	},
	...rest
}) => {

	return (
		<div>
			<ReCAPTCHA
				sitekey={rest.sitekey}
				onChange={rest.verifyRecaptcha}
			/>
			{touched && error && <div className="text-danger">{error}</div>}
		</div>
	)
}


