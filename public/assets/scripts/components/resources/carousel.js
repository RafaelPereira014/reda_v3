'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-bootstrap/lib/Carousel';

// Components
import {Link} from 'react-router-dom';
import ProtectedButton from '#/components/auth/protectedButton';

var renderProtected = (obj, target, el, isAuth) => {
	if (!el.exclusive || isAuth){
		return (
			<Link to={target}>
				{obj}
			</Link>
		)
	}

	return(
	<ProtectedButton target={target}>	
				{obj}
			</ProtectedButton>
	);
}

var renderList = (list, isAuth) => {
    return list.map((element) => {
        return (
            <Carousel.Item key={element.slug}>
                <div className="col-xs-9 col-sm-8 col-xs-offset-2 col-sm-offset-2">
                    <div className="app-carousel__container">
                        {
                            renderProtected(
                                <h1 className="media-heading" dangerouslySetInnerHTML={{ __html: element.title }}></h1>,
                                "/recursos/detalhes-recurso/" + element.slug,
                                element,
                                isAuth
                            )
                        }
                        <div className="app-carousel__text" dangerouslySetInnerHTML={{ __html: element.description }}></div>
                        {renderProtected(
                            <span className="cta secundary no-bg pull-right">Ler mais...</span>,
                            "/recursos/detalhes-recurso/" + element.slug,
                            element,
                            isAuth
                        )}
                    </div>
                </div>
            </Carousel.Item>
        );
    });
}

var renderExtra = (list) => {
	return list.map((element, index) => {

		return (
			<Carousel.Item key={element.id || index}>
				<div className="col-xs-9 col-sm-8 col-xs-offset-2 col-sm-offset-2 text-center">
					<div className="app-carousel__container">
						<h1 className="media-heading">{element.title}</h1>
						<div className="app-carousel__text">
							{element.description}
						</div>
					</div>
				</div>
			</Carousel.Item>
		);
	});
}

export const AppCarousel = (props) => {
	const { settings, extra } = props;

	if (!props.data || !props.data.data || props.data.fetching){
		return <div></div>
	}

	return (
		<div className="container app-carousel margin__top--60">
			<Carousel interval={settings.interval} nextIcon={settings.nextIcon} prevIcon={settings.prevIcon} indicators={settings.indicators}>
				{extra && renderExtra(extra)}
				{renderList(props.data.data, props.isAuthenticated)}				
			</Carousel>
		</div>
	);
}

AppCarousel.propTypes = {
	data: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired
}
