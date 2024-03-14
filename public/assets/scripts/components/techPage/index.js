'use strict';

import React, { Component } from 'react';

export default class TechPage extends Component {
	constructor(props){
		super(props);
	}

	componentDidMount(){
		this.props.fetchConfig();
	}

	render() {
		if (!this.props.config.fetched){
			return null;
		}

		return(
			<div className="tech-page-container">
				<section className="light-background teams">					
					<div className="container">
						<h1 className="text-center">Ficha técnica</h1>

						{/*2015-2016*/}
						<div className="row">
							<div className="col-xs-12">
								<h2 className="color-primary">2015-2016</h2>

								<h5>Conceção e coordenação:</h5>
								<p>Tânia Dias Fonseca</p>

								<h5>Designer e Programador Web:</h5>
								<p>Luís Melo</p>

								<h5>Conteúdo, revisão e validação científico-pedagógica:</h5>
								<ul>
									<li>Andreia Sosinho, Licenciada em Ensino da Física e da Química, variante Química, EBS Tomás de Borba</li>
									<li>Fátima Ormonde, Licenciada em Ensino da Matemática, ES Jerónimo Emiliano de Andrade</li>
									<li>Sandra Pacheco, Licenciada em Ensino da Matemática, ES Jerónimo Emiliano de Andrade</li>
									<li>Paula Cabral, Mestre em Cultura e Literatura Portuguesas, ES Vitorino Nemésio</li>
									<li>Paulo Matos, Mestre em Cultura e Literatura Portuguesas, ES Jerónimo Emiliano de Andrade</li>
									<li>Tânia Dias Fonseca, Doutorada em e-Planeamento, ES Jerónimo Emiliano de Andrade</li>
								</ul>

								
								<figure>
									<img src={this.props.config.data.group_images+"/grupo_2015_2016.jpg"} className="img-responsive" alt="Imagem do grupo de 2015/2016"/>
									<figcaption>	
										© António Araujo
									</figcaption>
								</figure>
							</div>
						</div>

						{/*2016-2017*/}
						<div className="row">
							<div className="col-xs-12">
								<h2 className="color-primary">2016-2017</h2>

								<h5>Coordenação:</h5>
								<p>Paulo Novo</p>

								<h5>Administrador de Sistemas, Designer e Programador Web:</h5>
								<p>Luís Melo</p>

								<h5>Conteúdo, revisão e validação científico-pedagógica:</h5>
								<ul>
									<li>Andreia Sosinho, Licenciada em Ensino da Física e da Química, variante Química, EBS Tomás de Borba</li>
									<li>Fátima Ormonde, Licenciada em Ensino da Matemática, ES Jerónimo Emiliano de Andrade</li>
									<li>Sandra Pacheco, Licenciada em Ensino da Matemática, ES Jerónimo Emiliano de Andrade</li>
									<li>Paula Cabral, Mestre em Cultura e Literatura Portuguesas, ES Vitorino Nemésio</li>
									<li>Paulo Matos, Mestre em Cultura e Literatura Portuguesas, ES Jerónimo Emiliano de Andrade</li>
									<li>Paulo Novo, Mestre em Animação, ES Jerónimo Emiliano de Andrade</li>
									<li>Sofia Oliveira, Licenciada em Ensino da Física e da Química, EBS Tomás de Borba</li>
								</ul>

								<figure>
									<img src={this.props.config.data.group_images+"/grupo_2016_2017.jpg"} className="img-responsive" alt="Imagem do grupo de 2016/2017"/>
								</figure>
							</div>
						</div>
					</div>
				</section>
				<section className="container partners">
					<h5>Direção Regional da Educação </h5>
					{/**/}
					<div className="row">
						<div className="col-xs-12">							
							<img src={this.props.config.data.logos+"/gov_acores.jpg"} className="img-responsive" alt="Logótipo do Governo dos Açores"/>
							<img src={this.props.config.data.logos+"/prosucesso.png"} className="img-responsive" alt="Logótipo do Prosucesso"/>
						</div>
					</div>
				</section>
			</div>
		)
	}
}