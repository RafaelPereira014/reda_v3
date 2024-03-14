import React, { Component } from 'react';
import { Field } from 'redux-form';

import Tags from '#/components/common/tags';

export default ({
	input,
	input: {
		value
	},
	meta: { 
		touched, 
		error, 
		invalid 
	}, 
	formGroupClassName, 
	controlType, 
	childPos,
	children,
	footNote,
	handleChange,
	...rest
}) => {
	const CustomTag = `${controlType}`;
console.log("values", value);
  return(
   <div className={`${formGroupClassName || ''} ${touched && (invalid) ? 'has-error' : ''}`}>
   	{childPos && childPos == "top" && children ? children : null}
      <Tags setTags={handleChange} tags={value} placeholder="Outros conceitos"/>              
      {touched && error && <div className="text-danger">{error}</div>}
      {footNote && <small>{footNote}</small>}
     {childPos && childPos == "bottom" && children ? children : null}
    </div>
  );
};