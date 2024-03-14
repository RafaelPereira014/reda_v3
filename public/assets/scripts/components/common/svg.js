'use strict';


import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';

export default class SvgComponent extends Component {
	constructor(props){
		super(props);

		this.setColor = this.setColor.bind(this);

		this.svgElement = React.createRef();
	}

	componentDidMount(){		
		this.setColor();		
	}

	componentDidUpdate(){
		this.setColor();
	}

	setColor(){
		
		if (this.props.color && this.svgElement && this.svgElement.current){
			let elColor = this.props.color;
			this.svgElement.current.addEventListener("load", function(e){
				var doc = e.currentTarget.getSVGDocument();
				if(doc){
					var els = doc.querySelectorAll("path");		
					for (var i=0; i < els.length; i++) {
						els[i].setAttribute("class", "");
						els[i].setAttribute("fill", elColor);
					} 
				}
				
			});		
			
		}
	}

	render() {
		if (!this.props.element){
			return null;
		}

		return (
			<object ref={this.svgElement} className="svg-element" data={this.props.element} type="image/svg+xml" style={this.props.style}></object>
		);
	}
}

SvgComponent.propTypes = {
	color: PropTypes.string,
	element: PropTypes.string.isRequired
}