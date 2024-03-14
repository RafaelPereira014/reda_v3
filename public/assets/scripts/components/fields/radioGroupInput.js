import React, { Component } from 'react';
import { Field } from 'redux-form';

import RadioGroup from '#/components/common/radioGroup';

export default ({
	input,
	input: {
		name,
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
	reverse,
	singleCol,
	list,
	descKey,
	...rest
}) => {
	const CustomTag = `${controlType}`;

  return(
   <div className={`${formGroupClassName || ''} ${touched && (invalid) ? 'has-error' : ''}`}>
   	{childPos && childPos == "top" && children ? children : null}
      <RadioGroup 
	      list={list} 
	      name={name} 
	      setRadio={handleChange} 
	      checked={value}
	      descKey={descKey}
	      reverse={reverse || null}
	      singleCol={singleCol || null}/>             
      {touched && error && <div className="text-danger">{error}</div>}
      {footNote && <small>{footNote}</small>}
     {childPos && childPos == "bottom" && children ? children : null}
    </div>
  );
};