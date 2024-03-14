import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

const Tabs = (props) => {
    const childrenWithProps = React.Children.map(props.children, child =>
        React.cloneElement(child, { 
            activeKey: props.activeKey,
        })
    );

    return (
        <ul className={"link-tabs" + (props.className ? " "+props.className : "")}>
            {childrenWithProps}
        </ul>   
    ) 
}

const Tab = (props) => (
    <li className={props.eventKey===props.activeKey ? "active" : ""}>
        <Link to={props.link} title={props.title} >
            {props.children}
        </Link>       
    </li>    
)

Tabs.propTypes = {
    activeKey: PropTypes.string.isRequired,
};

Tab.propTypes = {
    eventKey: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};

export {
    Tabs,
    Tab
}