'use strict';

import React, { Component } from 'react';

export default class PrivacyPage extends Component {
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
						<h1 className="text-center">Política de privacidade</h1>

						{/*2015-2016*/}
						<div className="row">
							<div className="col-xs-12">

								<h5>Como e para que fins os seus dados pessoais são utilizados?</h5>

								<p><strong>A Direção Regional da Educação (DRE)</strong> utiliza a informação recolhida, através dos formulários de contacto, para facilitar a gestão a nível de funcionalidades fornecidas no website, para fins históricos e estatísticos, obrigações legais, controle da qualidade de serviço e para contactos futuros.</p>

								<p>Utilizamos a informação recolhida para adequar os nossos serviços aos nossos utilizadores, para o envio de informações, promoções através de e-mail ou chamada telefónica. Esta comunicação é relativa aos eventos e novidades providenciadas pela DRE.</p>

								<p>Para além disso, são recolhidos dados relativos ao seu endereço IP e navegador para fins analíticos, que são partilhados com a plataforma Google Analytics.</p>

								<p>Não existem consequências para quem não as fornecer.</p>

								<p>&nbsp;</p>

								<h5>Quem é o responsável pela informação?</h5>

								<p>DRE é a responsável pelos dados recolhidos que são tratados informaticamente. Para garantir a segurança dos seus dados e a máxima confidencialidade, tratamos a informação que nos forneceu de forma absolutamente confidencial, de acordo com as nossas políticas e procedimentos internos de segurança e confidencialidade e não partilhamos os seus dados com terceiros para fins comerciais.</p>

								<p>No caso de dados recolhidos para fins de inscrição em eventos, os seus dados são partilhados com o organizador do mesmo, para fins logísticos.</p>
								<p>O titular dos dados pode apresentar reclamação à autoridade de controlo – a Comissão Nacional de Proteção de Dados.</p>

								<p>&nbsp;</p>

								<h5>Carregamento de ficheiros multimédia</h5>

								<p>Ao carregar imagens para o site, deve evitar carregar imagens com dados incorporados de geolocalização (EXIF GPS). Os visitantes podem descarregar e extrair os dados de geolocalização das imagens do site.</p>

								<p>&nbsp;</p>

								<h5>Utilização de cookies</h5>

								<p>Os cookies utilizados pela REDA consistem essencialmente em serviços como o Google Analytics, utilizado para avaliar o seu desempenho online, acompanhar e examinar o uso deste website de modo a que sejam preparados relatórios sobre as atividades dos seus visitantes. </p>

								<p>&nbsp;</p>

								<h5>Permissões de dispositivo para acesso a dados pessoais</h5>								
								<p>A aplicação móvel requer determinadas permissões por parte dos utilizadores que permitem o acesso a dados do dispositivo a ser utilizado.</p>

								<p>Por definição, estas permissões devem ser garantidas pelo utilizadores antes de proceder à sua recolha. Uma vez atribuída a permissão, esta pode ser removida a qualquer momento. De modo a revogar essas permissões, os utilizadores devem aceder às definições do seu dispositivo.</p>

								<p>O procedimento exato de controle das permissões da aplicação depende do dispositivo do utilizador e software. Tenha em mente que essa revogação pode limitar o bom funcionamento desta aplicação.</p>

								<p>Se o utilizador permitir qualquer das permissões listadas posteriormente, os dados pessoais respetivos poderão ser processados (i. e. acedidos por, modificados ou removidos) por esta aplicação.</p>

								<p>&nbsp;</p>

								<h5>Permissões de dispositivo</h5>

								<p>As permissões são utilizadas para aceder a funcionalidades do dispositivo. Permite, por exemplo, efetuar a leitura do estado atual do dispositivo, o que significa que permite verificar o estado de ligação à internet, aceder ao número do telefone no dispositivo, ou o estado de algumas chamadas realizadas.</p>

								<p>&nbsp;</p>

								<h5>Conteúdo incorporado de outros sites</h5>

								<p>Os artigos neste site podem incluir conteúdo incorporado (por exemplo: vídeos, imagens, artigos, etc.). O conteúdo incorporado de outros sites comporta-se tal como se o utilizador visitasse esses sites.</p>

								<p>Este site pode recolher dados sobre si, usar cookies, incorporar rastreio feito por terceiros, monitorizar as suas interacções com o mesmo, incluindo registar as interacções com conteúdo incorporado se tiver uma conta e estiver com sessão iniciada nesse site.</p>

								<p>&nbsp;</p>

								<h5>Como são protegidos os seus dados?</h5>
								Garantimos a segurança de seus dados pessoais, fornecendo protecção aprimorada por meio do uso de medidas de segurança técnicas e organizacionais específicas para evitar que seus dados pessoais sejam usados ​​ilegalmente ou de forma fraudulenta.

								Garantimos que seus dados pessoais não sejam divulgados, deturpados, danificados / alterados ou terceiros não autorizados tenham acesso a eles.

								<p>&nbsp;</p>

								<h5>Quem posso contactar para aceder, retificar ou apagar os dados?</h5>

								<p>Os nossos utilizadores e visitantes têm diferentes preocupações de privacidade e podem a qualquer momento rever, atualizar e decidir que tipo de dados pretendem ver guardados. O encarregado pelos dados pode ser contactado diretamente através do e-mail ou por correio, a quem poderá solicitar a qualquer momento a cópia dos dados que lhe digam respeito, a retirada do consentimento, a retificação, o apagamento, a limitação, a portabilidade e a oposição ao tratamento dos mesmos. A retirada posterior de consentimento não compromete a legalidade do tratamento realizado com base neste consentimento.</p>

								<p>&nbsp;</p>
							
								<p>Paços da Junta Geral - Carreira dos Cavalos<br/>
								9700 Angra do Heroísmo</p>
								<p><a href="mailto:dre.info@azores.gov.pt">dre.info@azores.gov.pt</a></p>

								<p>&nbsp;</p>

								<h5>Por quanto tempo são os dados armazenados?</h5>

								<p>Os dados pessoais são mantidos até se esgotar o fim a que se destinam, não tendo sido definido um limite temporal para o mesmo. Caso pretenda remover a sua informação da nossa base de dados, contacte-nos.</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		)
	}
}