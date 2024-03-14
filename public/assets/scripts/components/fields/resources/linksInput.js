import React, { Component } from 'react';
import { Field } from 'redux-form';

import genericInput from '#/components/fields/genericInput';

export default ({
	link,
	embed,
	formGroupClassName, 
	...rest
}) => {

  return(
     <div className={`form-group ${(link.meta.touched && link.meta.invalid) || (embed.meta.touched && embed.meta.invalid) ? 'has-error' : ''}`}>
        <Field
          name="link"
          className="form-control"
          placeholder="Indique o endereço do recurso" 
          component={genericInput} />
        {link.meta.touched && link.meta.error && <div className="text-danger">{link.meta.error}</div>}
        <small>e/ou</small>
        <Field
          name="embed"
          className="form-control"
          placeholder="Insira o código de incorporação"
          component={genericInput} />
        {embed.meta.touched && embed.meta.error && <div className="text-danger">{embed.meta.error}</div>}
      </div>
  );
};