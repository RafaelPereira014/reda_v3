import React, { Component } from 'react';
import { Field } from 'redux-form';

const renderFormControl =  ({
	input, 
	meta: { 
		touched, 
		error, 
		invalid,
		asyncValidating 
	}, 
	formGroupClassName, 
	controlType, 
	childPos,
	children,
	...rest
}) => {
	const CustomTag = `${controlType}`;

	return(
    <div className={`${formGroupClassName || ''} ${touched && (invalid) ? 'has-error' : ''}`}>
    	{childPos && childPos == "top" && children ? children : null}
			<CustomTag {...rest} {...input}/>
			{asyncValidating && <i className='fa fa-spinner fa-spin'/>}
			{childPos && childPos == "middle" && children ? children : null}
			{touched && error && <div className="text-danger">{error}</div>}
			{childPos && childPos == "bottom" && children ? children : null}
    </div>
  );
};

export default renderFormControl;