import React, { Component } from 'react';
import { Field } from 'redux-form';

import genericRadioField from '#/components/fields/genericRadio';

export default ({
	isOnline,
	isFile,
	formGroupClassName, 
	controlType, 
	childPos,
	children,
	footNote,
	handleIsOnlineChange,
	handleIsFileChange,
	...rest
}) => {
	const CustomTag = `${controlType}`;


  return(
    <div className={`form-group ${isOnline.meta.touched && !isOnline.input.value && isFile.meta.touched && !isFile.input.value ? 'has-error' : ''}`}>
      <div className="radio">
      	<Field
      		type="radio"
      		id="isOnline"
      		name="isOnline"
      		value={isOnline.input.value}
      		handleChange={handleIsOnlineChange}
      		component={genericRadioField}
      	/>
        <label htmlFor="isOnline">Endereço e/ou código de incorporação</label>
      </div>
      <div className="radio">
      <Field
      		type="radio"
      		id="isFile"
      		name="isFile"
      		value={isFile.input.value}
      		handleChange={handleIsFileChange}
      		component={genericRadioField}
      	/>
        <label htmlFor="isFile">Ficheiro</label>
      </div>
      {isOnline.meta.touched && !isOnline.input.value && isFile.meta.touched && !isFile.input.value && <div className="text-danger">Campo é obrigatório</div>}
    </div>
  );
};