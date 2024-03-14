import React, { Component } from 'react';


export default ({
	input,
	meta: { 
		touched, 
		error, 
		invalid 
	},
	handleChange,
	...rest
}) => {
	return <input {...input} {...rest} checked={input.value==true} onChange={handleChange}/> 
}
