import React, { Component } from 'react';


export default ({
	input,
	meta: { 
		touched, 
		error, 
		invalid 
	},
	...rest
}) => {
	return <input {...input} {...rest}/> 
}
