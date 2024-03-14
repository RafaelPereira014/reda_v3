'use strict';

import React from 'react';

export default (props) => {

	if (!props.config || !props.config.data){
		return null;
	}

	return (
		<div className="about__visualidentity" id="about-identity">
			<div className="container">
				<div className="row">
					<div className="col-xs-12 col-sm-8 col-sm-offset-2 text-center">
						<h1>Identidade REDA</h1>
						<p>Se pretender utilizar a marca REDA nos seus recursos, projetos ou qualquer tipo de suporte digital ou analógico, deve respeitar um conjunto de regras que contribuem para a consistência de utilização da identidade visual.</p>
						<a 
						href={props.config.data.inner_files+"/Manual de Normas - REDA.pdf"} 
						className="cta white outline big"
						download>
						<i className="fa fa-download"/>Descarregue o manual de identidade visual
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}