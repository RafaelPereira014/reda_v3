import React from 'react';

import FileInput from '#/components/common/fileInput';

export default ({
	input,
	meta: { 
		touched, 
		error, 
		invalid,
		dirty
	}, 
	formGroupClassName, 
	footNote,
	handleChange
}) => {

  return(
   <div className={`${formGroupClassName || ''} file-input ${((touched || dirty) && invalid) ? 'has-error' : ''}`}>
		<FileInput setFile={handleChange} file={input.value}/>                        
		{footNote && <p><small>{footNote}</small></p>}
		{input.value 
			&& !error 
			&& input.value.name 
			&& input.value.extension 
			&& <p>
				<button className="cta delete-action no-bg" title="Remover ficheiro" onClick={() => handleChange(null)}>
					<i className="fa fa-trash" title="Remover ficheiro"></i>
				</button> 
				<strong>Ficheiro: {input.value.name}.{input.value.extension}</strong>
			</p>
		}
		{(touched || dirty) 
			&& error 
			&& <div className="text-danger">{error}</div>}                        
	</div>
  );
};