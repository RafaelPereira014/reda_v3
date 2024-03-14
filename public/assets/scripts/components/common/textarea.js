'use strict';

import React from 'react';

export default (props) => {
	const { field, maxLength, minLength, ...rest } = props;
    if (!field)
        return null;

	return (
		<div>
			<textarea {...maxLength} {...minLength} {...rest} {...field}></textarea>
			<div className="row">
        <div className="col-xs-6">
        {(() => {
          if (maxLength){
            return <span>{field.value.length + "/" + maxLength}</span>
          }
        })()}
        </div>
        <div className="col-xs-6 text-right">
          <small>Deve ter no mínimo {minLength} car{minLength>1 && 'a' || 'á'}cter{minLength>1 && 'es'} e no máximo {maxLength}</small>
        </div>
      </div>
    </div>
  )

}