
// Notify new contact message
exports.notifyNew = function(data){
	var source = `<p>Foi lhe enviada uma mensagem no contexto do recurso <strong>${data.resource}</strong>.</p>
		<p>Pode visualizar os detalhes do seu recurso em <a href="https://reda.azores.gov.pt/recursos/detalhes-recurso/${data.resourceSlug}">www.reda.azores.gov.pt/recursos/detalhes-recurso/${data.resourceSlug}</a></p>
       ${data.message && `
        	<strong>Mensagem:</strong> </br>
			<p>
				<em>${data.message}</em>
			</p>
		`}
		<div style="text-align:center;">
			<p style="margin-top: 30px; margin-bottom: 30px; font-size: 14px;">Para responder à mensagem que lhe foi enviada, deverá autenticar-se na REDA e aceder à seguinte ligação:</p>
			<a href="https://reda.azores.gov.pt/painel/mensagens/${data.resourceSlug}" style="display:block; width:240px;background-color:#83ae03; color:white; font-size:16px;border:none; line-height:3.5; text-decoration:none; margin: 0 auto;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Responder à mensagem&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>

			<p style="opacity: 0.8;margin-top:120px; font-size:12px;">
				Não responda a este e-mail. Para qualquer questão, contacte para o e-mail <a href="mailto:${data.teamEmail}">${data.teamEmail}</a>.
			</p>			
		</div>		
		`;
		
	return source;
	/* var template = Handlebars.compile(source); */

	/* return template(data); */
}