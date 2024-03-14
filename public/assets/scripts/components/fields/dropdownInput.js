import React, { Component } from 'react';
import { Field } from 'redux-form';

import Dropdown from '#/components/common/dropdown';


const renderFormControl =  ({
	input, 
	meta: { 
		touched, 
		error, 
		invalid 
	}, 
	formGroupClassName, 
	childPos,
	children,
    footNote,
    startValue,
    list,
    listValue,
    listTitle,
    onChange,
    disabled,
    placeholder,
	...rest
}) => {

  return(
    <div className={`${formGroupClassName || ''} ${touched && (invalid) ? 'has-error' : ''}`}>
    	{childPos && childPos == "top" && children ? children : null}
        <Dropdown
            list={list}
            listValue={listValue} 
            listTitle={listTitle}            
            startValue={input.value}            
            defaultOption={placeholder || "---"}
            disabled={disabled}
            {...input}
            {...rest}
        />

        {childPos && childPos == "middle" && children ? children : null}
        {touched && error && <div className="text-danger">{error}</div>}
        {childPos && childPos == "bottom" && children ? children : null}
    </div>
  );
};

export default renderFormControl;