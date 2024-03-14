import React from 'react';

export default (props) => (
    <article className={"overview-item overview-item--c"+(props.type || '1')}>
        <div className="overview-box">
            <div className="icon">
                <i className={props.icon || "far fa-list-alt"}></i>
            </div>
            <div className="text">
                <h2>{props.data}</h2>
                <span>{props.label}</span>
            </div>
        </div>
    </article>
)