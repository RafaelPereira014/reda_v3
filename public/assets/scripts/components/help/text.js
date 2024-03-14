'use strict';

import React from 'react';

// Components
import {Link} from 'react-router-dom';

// Scroll
/*import Scroll from 'react-scroll';
var Element = Scroll.Element;*/

export default (props) => {

	if (!props.config || !props.config.data){
		return null;
	}

	return [
		{
			"title": "Direitos de autor",
			"description": 
			<div>
				<p>A pensar nos criadores de recursos, reconhecendo e mantendo o seu direito e os seus direitos conexos, mas permitindo que outras pessoas os utilizem, copiem, distribuam e façam alguns usos do seu trabalho para fins educacionais e não comerciais, os recursos submetidos à plataforma REDA, salvo disposição em contrário, a partir da sua divulgação, ficam sujeitos a uma licença Creative Commons com a Atribuição e Partilha nos Termos da Mesma Licença designada como Atribuição-Não Comercial-Compartilha Igual (CC BY-NC-SA). Sobre esta licença:</p>
				<ul>
					<li><strong>Atribuição</strong> - Tem de dar o crédito adequado, fornecer um link para a licença  e indicar se foram feitas alterações. Poderá fazê-lo de qualquer forma razoável, mas não de forma a sugerir que o licenciante concorda consigo ou com o uso atribuído.</li>
					<li><strong>Uso Não Comercial</strong> - Não pode usar o material para fins comerciais.</li>
					<li><strong>Compartilhamento pela mesma licença</strong> - Se alterar, transformar ou construir em cima do material existente, deve distribuir as suas contribuições sob a mesma licença que o original. Para saber mais sobre esta licença, consulte aqui.</li>
				</ul>

				<p>Ao submeter um recurso, certifique-se de que é o autor ou o proprietário da obra ou que tem permissão do autor/criador para a distribuir e partilhar para fins educativos.</p>

				<p>Se o recurso que pretende submeter se encontrar na Internet, é da sua responsabilidade ler os "Termos e condições" do sítio, no qual o recurso se encontra e pedir a devida autorização. Nos casos em que o seu autor permita a distribuição e partilha,  para fins educativos, dos recursos e estes estejam sujeitos a uma licença Creative Commons, ou outro tipo de licença, deve colocar sempre essa indicação no campo da "Descrição" do recurso.</p>

				<strong>Exemplo: Resolução gráfica de sistemas de duas equações do 1.º grau</strong>

				<p>Descrição: Este recurso apresenta um sistema de duas equações do 1.º grau com duas incógnitas, escrito na forma canónica e a respetiva representação gráfica. Os coeficientes de x e de y, assim como os termos independentes, podem ser alterados. É possível visualizar a classificação do sistema e, quando este é "possível e determinado", são dadas as coordenadas do ponto de interseção das retas. Licença CC-BY-SA</p>

				<p>Para além disso, deve certificar-se que utiliza os créditos exigidos pelo autor do recurso e preencher corretamente os campos existentes para os detalhes desse recurso na plataforma.</p>

				<p>A submissão de recursos e da(s) proposta(s) de operacionalização dos mesmos, pressupõe a aceitação dos "Termos e condições" e a autorização de distribuição sob os termos descritos no ponto anterior. Ao fazê-lo:</p>
				<ul>
					<li>mantém os direitos autorais do trabalho submetido;</li>
					<li>é o autor ou o proprietário da obra ou tem permissão do autor/criador para a distribuir;</li>
					<li>pretende que o trabalho seja distribuído sob os termos dessa licença (inclusive permitir a sua modificação, sendo-lhe dado o crédito pela sua criação);</li>
					<li>leu e concorda com os <Link to="/termosecondicoes">"Termos e condições"</Link> de submissão.</li>
				</ul>

				<p>Todos os materiais, descritivos, marcas e, de um modo geral, todos os conteúdos da plataforma REDA, em todas as suas valências, estão sujeitos a estes "Termos e condições" e aos termos gerais de direito pela legislação nacional e internacional de proteção da Propriedade Intelectual. Consequentemente, efetue aqui a leitura completa e atenta dos mesmos.</p>
				 
				<p>Os direitos de autor encontram-se protegidos na ordem jurídica portuguesa pelo Código do Direito de Autor e Direitos Conexos, aprovado pelo Decreto-Lei n.º 63/85, de 14 de março, na redação atual.<br/>
				O Código, nas sucessivas alterações ao longo dos anos, acolhe a evolução natural dos meios de comunicação e de reprodução e da circulação da informação, caracterizado pela celeridade e pela constante citação e transcrição, seguindo entre outros o Direito Comunitário e as convenções internacionais.<br/>
				Para aceder à versão integral do Código do Direito de Autor e Direitos Conexos <a href={props.config.data.inner_files+"/CDADC.pdf"} download>clique aqui</a>.</p>
				 
				<p>Em caso de dúvida, contacte a equipa REDA, utilizando o <Link to="/faleconnosco">formulário "Fale connosco"</Link>.</p>
			</div>
		},
		{
			"title": "Plug-ins do navegador (Browser Plug-ins)",
			"description": 
			<div>
				<p>Por favor, certifique-se de que tem a versão mais recente destes plug-ins gratuitos comumente utilizados, não exclusivas, de acordo com os formatos disponíveis na plataforma REDA:</p>
				<ul>
					<li>Adobe Flash Player 9 ou superior: usado para exibir o conteúdo de Animação/Simulação, Jogo didático  e outros conteúdos não-estático. <a href="https://get.adobe.com/br/flashplayer/" title="Descarregar Adobe Flash Player 9">Descarregue</a></li>
					<li>Adobe Shockwave Player: usado para exibir o conteúdo de Animação/Simulação, Jogo didático  e conteúdo não-estático e interativo. <a href="https://get.adobe.com/br/shockwave/otherversions/" title="Descarregar Adobe Shockwave Player">Descarregue</a>.</li>
					<li>Windows Media Player: usados para exibir o conteúdo de áudio e formatos visuais. <a href="https://www.microsoft.com/pt-br/download/windows-media-player-details.aspx" title="Descarregar Windows Media Player">Descarregue</a>. O Flip4Mac permite reproduzir vídeo Windows Media e arquivos de áudio no seu Mac. <a href="http://www.apple.com/downloads/" title="Descarregar Flip4Mac">Descarregue</a>.</li>
					<li>QuickTime: é necessário para formatos de media QuickTime.</li>
					<li>Adobe Reader: usado para exibir arquivos Portable Document Format (PDF). <a href="https://get.adobe.com/br/reader/" title="Descarregar Adobe Reader">Descarregue</a>.</li>
					<li>Java: Instalação varia muito de navegador para navegador. Por favor, consulte a ajuda do seu navegador para obter instruções de instalação.</li>
					<li>RealPlayer: usado para exibir o conteúdo de áudio e formatos visuais. <a href="http://www.real.com/pt" title="Descarregar RealPlayer">Descarregue</a>.</li>
					<li>GeoGebra: software de matemática dinâmica para todos os níveis de educação que reúne geometria, álgebra, folha de cálculo, gráficos, estatísticas e cálculo. <a href="https://www.geogebra.org/download" title="Descarregar GeoGebra">Descarregue</a>.</li>
					<li>Hot Potatoes: software que permite a criação de aplicações com exercícios de escolha-multipla, palavras-cruzadas, preenchimento de espaços, etc. <a href="https://hotpot.uvic.ca/index.php#downloads" title="Descarregar Hot Potatoes">Descarregue</a>.</li>
				</ul>
			</div>
		},
		{
			"title": "Pesquisar",
			"description": 
			<div>
				<p>Pode pesquisar por: Palavra-chave, Macroárea, Área, Domínio, Ano e Formato.</p>
				<p>Se optar por pesquisar apenas por:</p>
				<ul>
					<li>palavra-chave, utilize também o singular/plural ou forma derivada da palavra-chave;</li>
					<li>disciplina, ser-lhe-ão ativados os domínios correspondentes, que já possuem recursos;</li>
					<li>ano, ser-lhe-ão devolvidos os resultados de todos os recursos referentes a esse ano de escolaridade;</li>
					<li>formato, ser-lhe-ão devolvidos os resultados de todos os recursos do formato selecionado;</li>
				</ul>
				<p>Se pretender restringir a sua pesquisa, utilize, cumulativamente,  mais do que um filtro.</p> 
				<strong>Exemplo 1: Ciências Físico-Químicas, Espaço, 7.º ano</strong>
				<ul>
					<li>ser-lhe-ão devolvidos resultados de todos os recursos em todos os formatos de Ciências Físico-Químicas, do domínio Espaço, do 7.º ano de escolaridade.</li>
				</ul>
				<strong>Exemplo 2: Ciências Físico-Químicas, Espaço, 7.º ano, Vídeo</strong>
				<ul>				
					<li>ser-lhe-ão devolvidos resultados de todos os recursos existentes com o formato de vídeo para o 7.º ano de escolaridade, no domínio Espaço, da disciplina de Ciências Físico-Químicas.</li>
				</ul>
			</div>
		},
		{
			"title": "Submeter um recurso",
			"description": 
			<div>
				<h5>Campos de preenchimento obrigatório</h5>

				<h6>Recurso exclusivo a docentes</h6>
				<p>Este campo encontra-se selecionado por defeito. Se pretender preparar um recurso exclusivo para alunos, retire essa seleção. Lembre-se de que os recursos exclusivos a docentes não são visíveis aos alunos, enquanto os recursos não exclusivos são visíveis por todos os utilizadores (registados e não registados).</p>

				<h6>Título</h6>
				<p>Refere-se ao título do recurso. Seja sugestivo e objetivo.</p>

				<h6>Autor/Fonte</h6>
				<p>Este campo refere-se ao autor do recurso. Se não for o autor original, coloque o nome do autor e certifique-se que tem autorização para usar/alterar/transmitir/distribuir o recurso. É da sua responsabilidade respeitar os direitos autorais. Se for o autor, coloque o seu nome.</p>

				<h6>Escola/Organização/Nome Do Sítio</h6>
				<p>Preencha com o nome da sua escola ou organização, sempre que o recurso for da sua autoria. Caso contrário, coloque o nome da organização ou instituição do autor. Se não o conseguir encontrar, indique o nome do sítio na Internet onde se encontra o recurso. Sem esta(s) referência(s), não poderá introduzir o recurso por questões de Direitos de Autor.</p>

				<h6>Palavras-chave</h6>
				<p> Insira palavras ou expressões que melhor descrevam o conteúdo do recurso. Ou seja, termos que facilitem ao utilizador encontrar resultados adequados à sua pesquisa. No que respeita à base de dados, essas palavras-chave são vistas como uma ferramenta para indexação dos recursos e conteúdos na plataforma. Adicione o acrónimo "CREB" sempre que considerar que o recurso se adequa ao referencial curricular para a educação básica na Região Autónoma dos Açores.<br/>
					Neste campo, deve inserir entre 1 a 10 palavras ou expressões. Utilize a vírgula, o ponto e vírgula ou a tecla ENTER para separar as palavras ou expressões.</p>

				<h6>Formato</h6>
				<p>Na plataforma são permitidos apenas os seguintes formatos:<br/>
				Animação/Simulação; Áudio; Folha de cálculo; Imagem; Jogo didático; Texto e Vídeo.</p>
				<p>No caso de o recurso ser:</p>
				<ul>
					<li>um cartaz ou um folheto, escolha Imagem ou Texto, consoante considerar mais adequado;</li>
					<li>um vídeo ou um áudio, a duração do mesmo é obrigatória. Utilize o formato: 0:00:00.</li>
				</ul>
				<p>Se considerar pertinente a permissão de outros formatos, por favor, entre em contacto com a equipa REDA, através do <Link to="/faleconnosco" title="Entre em contato connosco">formulário "Fale connosco"</Link>.</p>
				
				<h6>Localização do recurso</h6>
				<p>As opções, que se apresentam, referem-se ao local onde ficará o recurso (na plataforma, no caso de ser um ficheiro, caso contrário, na Internet). Não são aceites na plataforma o carregamento de ficheiros cujo tamanho exceda os 60MB (incluindo os de vídeo).</p>

				<p>Se o recurso:</p>
				<ul>
					<li>estiver na Internet, de acesso facilitado, escolha a opção "Endereço e/ou código de incorporação". Deve inserir, de seguida, o endereço da página da Internet onde se encontra o recurso (link). Caso tenha um código de incorporação, por favor adicione-o também.</li>
					<li>
						for um vídeo existente na Internet, insira o endereço da página da Internet onde se encontra o recurso (link). No caso de ser um vídeo do Youtube, insira também o código de incorporação.<br/>
						Para este efeito, proceda da seguinte forma:
						<ol type="1">
							<li>Aceder ao vídeo do Youtube;</li>
							<li>Clicar em Partilhar <i className="fa fa-share-alt" aria-hidden="true"></i> Incorporar um Vídeo, que se encontra por baixo da caixa do vídeo.</li>
							<li>Clicar em Incorporar.</li>
							<li>Copiar o código HTML existente na caixa apresentada.</li>
							<li>Colar o código no campo "Insira o código de incorporação", na plataforma REDA.</li>
						</ol>
					</li>
					<li>for um ficheiro áudio feito por si, e com um tamanho inferior a 60MB, poderá carregá-lo para a plataforma.</li>
					<li>for um vídeo feito por si, deve carregá-lo, em primeiro lugar, para o Youtube, ou outro sítio na Internet,  e, posteriormente, inserir o endereço da página da Internet onde se encontra o vídeo (link) e o código de incorporação (se existir) na plataforma REDA. A plataforma REDA não permite o carregamento direto de vídeos. Caso escolha carregar o seu vídeo para o Youtube,  consulte, por favor, o tutorial <a href="https://support.google.com/youtube/answer/57407?hl=pt" title="Tutorial para carregar vídeos no Youtube">Carregar Vídeos</a> no Youtube. </li>
				</ul>

				<p>Poderá também consultar o separador <Link to="/dicasutilidades" title="Aceder a Dicas e Utilidades">"Dicas e Utilidades"</Link>, na plataforma REDA, para outras sugestões.</p>

				<h6 id="requirements">Requisitos Técnicos</h6>
				<p>De forma a uniformizar a informação disponibilizada na plataforma e a permitir a utilização facilitada dos recursos, considerou-se pertinente facultar a informação necessária para o efeito. Consulte, por favor, a tabela que se segue para identificar a informação a colocar no campo “Requisitos Técnicos”, que deve ter no mínimo 3 caracteres e no máximo 300.</p>

				<div className="table-responsive">
					<table className="table valign-middle table-striped">
						<thead>
							<tr>
								<th className="text-center table-title" colSpan="3">Recursos Técnicos</th>
							</tr>
							<tr>
								<th>Formato do recurso</th>
								<th>Exemplos de extensões/formatos do ficheiro do recurso</th>
								<th>Informação a colocar, tal como se apresenta</th>
							</tr>						
						</thead>
						<tbody>
							{/*ROW 1*/}
							<tr>
								<td rowSpan="4">Simulações/animações/jogos/outros objetos</td>
							</tr>
							<tr>
								<td>.swf</td>
								<td>
									Adobe Flash Player ou Adobe Shockwave Player
								</td>
							</tr>
							<tr>
								<td>
									. jar<br/>
									.jnlp
								</td>
								<td>
									Java
								</td>
							</tr>
							<tr>
								<td>
									.ggb
								</td>
								<td>
									Geogebra
								</td>
							</tr>

							{/*ROW 2*/}
							<tr>
								<td>Vídeo</td>
								<td>
									.avi<br/>
									.mp4
								</td>
								<td>
									Leitor de vídeo (e.g., VLC Media Player, Windows Media Player); Colunas áudio
								</td>
							</tr>

							{/*ROW 3*/}
							<tr>
								<td>Áudio</td>
								<td>
									.mp3<br/>
									.wav<br/>
									.wma
								</td>
								<td>
									Leitor de vídeo (e.g., VLC Media Player, Windows Media Player); Colunas áudio
								</td>
							</tr>

							{/*ROW 4*/}
							<tr>
								<td>Folha de cálculo (Excel e similares)</td>
								<td>
									.xlsx<br/>
									.xls<br/>
									.ods<br/>
									.xlsm
								</td>
								<td>
									Folha de cálculo
								</td>
							</tr>

							{/*ROW 5*/}
							<tr>
								<td>Imagem</td>
								<td>
									.gif<br/>
									.jpeg<br/>
									.png<br/>
									.tiff
								</td>
								<td>
									Visualizador de imagem
								</td>
							</tr>

							{/*ROW 6*/}
							<tr>
								<td>Documento texto</td>
								<td>
									.rtf<br/>
									.doc<br/>
									.docx<br/>
									.odt<br/>
									.txt
								</td>
								<td>
									Processador de texto
								</td>
							</tr>

							{/*ROW 7*/}
							<tr>
								<td>Textos, cartazes ou posters em pdf</td>
								<td>
									.pdf
								</td>
								<td>
									Visualizador de PDF
								</td>
							</tr>

							{/*ROW 8*/}
							<tr>
								<td colSpan="2">Se o recurso for constituído por um conjunto de documentos, por favor, comprima para uma pasta (Zipada) e carregue a pasta para a plataforma através do botão "Escolher Ficheiro".</td>
								<td>
									Descompactador de ficheiros (e.g., 7zip, Winzip; WinRAR)
								</td>
							</tr>

							{/*ROW 9*/}
							<tr>
								<td colSpan="2">Quando é uma página da Internet (contendo imagem, texto ou outros)</td>
								<td>
									N/A
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<p>Para identificar a extensão/ formato do ficheiro:</p>
				<ul>
					<li>colocar o rato sobre o ficheiro e clicar com o lado direito do mesmo. Ler a informação que se encontra no final da lista que aparece;</li>
					<li>guardar o ficheiro e ler a extensão do ficheiro;</li>
					<li>selecionar as propriedades do ficheiro e verificar o formato;</li>
					<li>ler o código do objeto!</li>
				</ul>

				<strong>Exemplo 1:</strong> vídeo do Youtube<br/>
				Formato: Vídeo<br/>
				Requisitos Técnicos: Leitor de vídeo (e.g., VLC Media Player, Windows Media Player); Colunas áudio<br/>
				<strong>Exemplo 2:</strong> simulação em “Flash”<br/>
				Formato: Animação/Simulação<br/>
				Requisitos Técnicos: Adobe Flash Player<br/>
				<strong>Exemplo 3:</strong> gif animado <br/>
				Formato: Imagem<br/>
				Requisitos Técnicos: Visualizador de Imagem

				<h6>Descrição</h6>
				<p>Este campo deve ser preenchido com informação que descreva o recurso, deve ter no mínimo 20 caracteres e no máximo 800. Se o recurso necessitar de informação adicional, coloque de forma sucinta essa informação (e.g., variáveis manipuláveis, procedimentos na página da Internet de origem). Não deve conter informação sobre a proposta de operacionalização.</p>

				<h6>Metadados</h6>
				<strong>Áreas</strong>
				<p>As áreas disponíveis na plataforma REDA são: Cidadania, Ciências Físico-Químicas, Ciências Naturais, Estudo do Meio, Inglês, Matemática, Português e TIC.</p>
				<p>Selecione a(s) que se adequa(m) melhor ao recurso que está a introduzir. Pode selecionar também “outras”, caso considere importante. Ao selecionar mais do que uma disciplina, quando o utilizador efetuar uma pesquisa, poderá obter como resultado o recurso em causa, potenciando a multidisciplinaridade.</p>
				<p>Se considerar pertinente a inserção de novas áreas, por favor, entre em contacto com a equipa REDA, através do <Link to="/faleconnosco" title="Entre em contacto connosco">formulário "Fale connosco"</Link>.</p>

				<h6>Domínios</h6>
				<p>Estão disponíveis os domínios de Cidadania, de Ciências Físico-Químicas, de Ciências Naturais, de Matemática e de Português. Tornam-se visíveis após a seleção da(s) disciplina(s).</p>
				<p>Se considerar pertinente a inserção de novos domínios, por favor, entre em contacto com a equipa REDA, através do <Link to="/faleconnosco" title="Entre em contacto connosco">formulário "Fale connosco"</Link>.</p>

				<h6>Anos de escolaridade</h6>
				<p>Deve selecionar o(s) ano(s) em que o recurso pode ser utilizado.</p>

				<h6>Área</h6>
				<p>Se selecionar mais do que uma área fora do seu grupo de lecionação, por favor verifique com um(a) colega da respetiva área. Pode também consultar as <a href="http://www.dge.mec.pt/programas-e-metas-curriculares-0" title="Metas curriculares">metas curriculares</a>.</p>

				<h6>Idiomas</h6>
				<p>Estão disponíveis as referências aos seguintes idiomas:</p>
				 <ul>
				 	<li>Português (PT); Português (BR); Inglês, legendado em português; Inglês; Francês, legendado em português; Francês; Castelhano, legendado em português; Castelhano; Outros, legendado em português; Outros e Não se aplica.</li>
				 </ul>
				<p>A opção “Não se aplica” deve ser selecionada quando o recurso não apresentar falas nem legendas.</p>

				<p>Se o recurso for um vídeo do Youtube:</p>
				<ul>
					<li>confirme se este tem legendas em Português. Para isso, pode consultar o tutorial <a href="https://support.google.com/youtube/answer/100078?hl=pt-PT" title="Como ativar as legendas do youtube">Ativar</a> e desativar legendas do Youtube;</li>
					<li>adicione legendas ou edite as existentes. Para isso, pode consultar os tutoriais <a href="https://support.google.com/youtube/answer/2734796?hl=pt" title="Como adicionar legendas no Youtube">Adicione</a> ou <a href="https://support.google.com/youtube/answer/2734705" title="Como editar ou retirar legendas no Youtube">Editar ou retirar</a> legendas do Youtube.</li>
				</ul>
				<p>Se considerar pertinente a inserção de novos idiomas, por favor, entre em contacto com a equipa REDA, através do <Link to="/faleconnosco" title="Entre em contacto connosco">formulário "Fale connosco"</Link>.</p>

				<h6>Proposta de operacionalização</h6>
				<p>Este campo deve ser preenchido com uma proposta de operacionalização, contendo informação suficiente que permita a sua implementação. Deve ter no mínimo 20 caracteres e no máximo 800. Não deve, no entanto, ser uma planificação de aula.</p>

				<h6>Termos e condições</h6>
				<p>Antes de submeter um recurso, deve aceitar os <Link to="/termosecondicoes" title="Termos e condições">Termos e condições</Link> de utilização da plataforma REDA. Ao submeter um recurso, está a autorizar que o conteúdo seja distribuído sob os termos da licença Creative Commons com a atribuição designada como Atribuição-Não Comercial-Compartilha Igual <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" title="Licença CC BY-NC-SA Creative Commons">(CC BY-NC-SA)</a>.</p>
				 <p>A responsabilidade sobre os direitos de autor do recurso é da total responsabilidade do utilizador que o submete.</p>
				<p>Ao fazê-lo:</p>
				<ul>
					<li>mantém os direitos autorais do trabalho submetido;</li>
					<li>declara ser o autor ou o proprietário da obra ou ter a permissão do autor para a distribuir;</li>
					<li>pretende que o trabalho/obra submetido(a) seja distribuído(a) sob os termos da licença CC-BY-NC-SA.</li>
				</ul>
				<p>Caso não seja o autor da obra e este exija outro tipo de licença, deverá mencionar no campo “Descrição”. Contudo, a licença deve ser sempre Creative Commons com “atribuição”. Caso contrário, não poderá submeter o recurso.</p>
				<p>Para mais informações, consulte a <a href="http://creativecommons.pt/" title="Creative Commons">página oficial da Creative Commons</a>.</p>


			</div>
		}
	]
}