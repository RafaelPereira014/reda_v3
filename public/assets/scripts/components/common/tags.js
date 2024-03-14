'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Tags from 'react-tagsinput';


const TagsInput = (props) =>{



    let inputProps={
        className: 'react-tagsinput-input',
        placeholder: props.placeholder
    }

    return (
        <div className={props.className}>
            <Tags 
                value={props.tags} 
                onChange={props.setTags} 
                addKeys={[188,9,13]} 
                inputProps={inputProps}
                addOnBlur={true}
                addOnPast={true}/>
        </div>
    )    
}

TagsInput.propTypes = {
    className: PropTypes.string,
    tags: PropTypes.array.isRequired,
    setTags: PropTypes.func.isRequired
}

export default TagsInput