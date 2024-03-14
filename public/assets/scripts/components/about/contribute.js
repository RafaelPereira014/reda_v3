'use strict';

import React from 'react';

// Components
import LoginButton from '#/components/auth/loginButton';
import {Link} from 'react-router-dom';

export default (props) => {
	return (
		<section className="about__contribute">
			<div className="container">
				<article className="about__contribute--left">
					<h1 className="text-center">Aceda a uma ampla biblioteca de recursos</h1>
					<p className="text-center">Se é docente ou, simplesmente, pretende contribuir para o crescimento da biblioteca, poderá entrar na plataforma e utilizar as nossas ferramentas. Poderá combinar texto, imagens, áudio, vídeo e muitos mais formatos de modo a serem partilhados com professores, alunos e educadores.</p>
					
					<footer className="text-center">
						{!props.auth.isAuthenticated ?
							<LoginButton className="cta white outline">
								Comece a contribuir
							</LoginButton>							
						: 
						<Link to="/painel/meusrecursos" className="cta white outline">Comece a contribuir</Link>}
					</footer>
				</article>
				<article className="about__contribute--right">
					<img src={props.config.data.background_images+"/contribute_laptop.svg"} />
				</article>
			</div>
		</section>
	);	
}
