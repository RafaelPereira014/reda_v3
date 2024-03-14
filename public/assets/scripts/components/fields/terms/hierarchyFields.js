import React from 'react';

import HierarchyList from '#/components/common/terms/hierarchy';

export default ({
	input: {
		value
	},
	meta: { 
		touched, 
		error, 
		invalid 
	}, 
	formGroupClassName, 
	childPos,
	children,
  footNote,
  setTerms,
  taxs,
  collapsed,
  wrapperClassname
}) => {

  return(
   <div className={`${formGroupClassName || ''} ${touched && (invalid) ? 'has-error' : ''}`}>
    {childPos && childPos == "top" && children ? children : null}
      <HierarchyList 
        taxs={taxs}
        selected={value}
        setTerms={setTerms}
        collapsed={collapsed}
        wrapperClassname={wrapperClassname}    
      />              
      {touched && error && <div className="text-danger">{error}</div>}
      {footNote && <small>{footNote}</small>}
     {childPos && childPos == "bottom" && children ? children : null}
    </div>
  );
};