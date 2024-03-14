'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import _ from 'lodash';

import {Link} from 'react-router-dom';

// Utils
import { isNode } from '#/utils';

import Slider from 'react-slick';

export const FormatsList = (props) => {
	const { formats, config, onFilter} = props;

	let dragging = false;

	const settings = {
		dots: false,
		infinite: false,
		speed: 500,
		arrows: false,
		beforeChange: () => dragging = true,
      	afterChange: () => dragging = false,
		responsive: [
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 4
				}
			},
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 7
				}
			},
			{
				breakpoint: 9999,
				settings: {
					slidesToShow: 7
				}
			}
		]
	}

	const listObjects = _.sortBy(formats.data, 'priority')
	.filter((format)=>{
		return format.type!='all';
	})
	.map((format, index) => {
		return (
	      	<article className="formats__element" key={format.id} onClick={(e) => dragging ? e.preventDefault() : onFilter(format)}>
				<img src={(config.data && config.data.formatIcons)+"/"+format.Image.name+"."+format.Image.extension} alt={format.Image.alt} className="img-responsive" />
				<span>{format.title}</span>
			</article>
	    );					
    });

    if (isNode){
    	return <div></div>
    }
    
	return (
		<div className="container">
			<div className="row">
				<Slider {...settings}>
					{listObjects}				
				</Slider>
								
			</div>
		</div>
	);
   
}

FormatsList.propTypes = {
	formats: PropTypes.object.isRequired,
	config: PropTypes.object.isRequired,
	onFilter: PropTypes.func.isRequired
}