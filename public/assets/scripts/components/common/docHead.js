'use strict';

import React, { Fragment } from 'react';

// Utils
import _ from 'lodash';

// Meta
import DocMeta from "react-doc-meta";
import DocumentTitle from 'react-document-title';

// Config
import appConfig from '#/appConfig';

export default (props) => {
	const { data, location } = props;

  var fullData = _.assign({
      description: "REDA é uma plataforma dedicada à disponibilização rápida e fácil de conteúdos educativos para qualquer aluno, professor ou utilizador, sem restrições.",
      title: "REDA - Recursos Educativos Digitais e Abertos",
      image: "/assets/graphics/favicon/favicon-96x96.png",
      url: location && appConfig && appConfig.domain ? appConfig.domain.replace(/\/$/, '')+location.pathname : appConfig.domain
    }, data);

	let tags = [
      {name: "description", content: fullData.description},
      {itemProp: "name", content: fullData.title},
      {itemProp: "description", content: fullData.description},
      {itemProp: "image", content: appConfig.domainClean+fullData.image},
      {name: "twitter:site", content: "@REDA"},
      {name: "twitter:title", content: fullData.title},
      {name: "twitter:description", content: fullData.description},
      {name: "twitter:creator", content: "@REDA"},
      {name: "twitter:image", content: appConfig.domainClean+fullData.image},
      {property: "og:title", content: fullData.title},
      {property: "og:type", content: "website"},
      {property: "og:url", content: fullData.url},
      {property: "og:description", content: fullData.description},
      {property: "og:site_name", content: fullData.title},
      {property: "og:image", content: appConfig.domainClean+fullData.image}
    ]

	return (
		<Fragment>
			<DocMeta tags={tags} />
      <DocumentTitle title={fullData.title}/>
		</Fragment>		
	)
}