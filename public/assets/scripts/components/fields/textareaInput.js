import React, { Component } from 'react';
import { Field } from 'redux-form';

import TextArea from '#/components/common/textarea';

export default ({
	input, 
	meta: { 
		touched, 
		error, 
		invalid 
	}, 
	formGroupClassName, 
	childPos,
	children,
	maxLength,
	minLength,
	...rest
}) => {

  return(
    <div className={`${formGroupClassName || ''} ${touched && (invalid) ? 'has-error' : ''}`}>
		{childPos && childPos == "top" && children ? children : null}
		<TextArea maxLength={maxLength || 300} minLength={minLength || 3} className={rest.className} placeholder={rest.placeholder} field={input}  {...rest}/>
		{childPos && childPos == "middle" && children ? children : null}
		{touched && error && <div className="text-danger">{error}</div>}
		{childPos && childPos == "bottom" && children ? children : null}
    </div>
  );
};