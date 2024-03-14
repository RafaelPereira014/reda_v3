'use strict';

import React from 'react';
import { Component } from 'react';

// Utils
import { isNode } from '#/utils';

import Slider from 'react-slick';

export default class TestimonialsBlock extends Component {
	constructor(props){
		super(props);

		this.state = {};
	}

	componentDidMount(){
		this.props.fetchTestimonials();
	}

	render() {
		const { testimonials } = this.props;

		if (!testimonials || !testimonials.data || testimonials.data.length==0 ){
			return null;
		}

		const carouselSettings = {
			dots: true,
			infinite: true,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false
		}

		const listObjects = testimonials.data
		.map((element) => {
			return (
				<blockquote className="testimonials__element" key={element.id}>
					<p>{element.description}</p>
					<footer>
						{element.person}
					</footer>
				</blockquote>
				);					
			});

			if (isNode){
				return <div></div>
			}
			

		return (
			<div className="container testimonials__container">
				<div className="row">
					<div className="col-xs-12">
						<h1 className="spaced__title">Testemunhos</h1>
					</div>
				</div>
				<div className="row">
					<Slider {...carouselSettings}>
						{listObjects}				
					</Slider>
				</div>
			</div>			
		);
	}
}