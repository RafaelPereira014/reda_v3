import React from 'react';
import { Field } from 'redux-form';

import renderFormControl from '#/components/fields/genericField';

export default ({
  fields,
  systems,
}) => {

  if (!fields || fields.length==0 || !systems || systems.length==0){
    return null;
  }

  const allFields = fields.getAll();

  return <div>
    {fields.map((element, index) =>{
      if (systems && systems.length>0 && systems.indexOf(allFields[index].id)>=0){                
        return (
          <div key={allFields[index].id || index}>
            <label>{allFields[index].title}</label>
            <Field
                controlType="input"
                type="text"
                className="form-control"
                formGroupClassName="form-group"
                placeholder={"Endereço para " + allFields[index].title}
                component={renderFormControl} 
                name={`${element}.link`}>
              
            </Field>
          </div> 
        )
      }
    })
    }
  </div>
};