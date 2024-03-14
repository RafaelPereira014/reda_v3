import React from "react";

const LoaderSmall = (props) => {

    const { titulo } = props;
    return (
        <div className="loader__container">
        <h2>{titulo}</h2>
        <i className='fa fa-spinner fa-spin'></i>
        </div>
    );
    }

export default LoaderSmall;