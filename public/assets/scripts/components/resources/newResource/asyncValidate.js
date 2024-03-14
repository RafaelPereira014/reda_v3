import fetch from 'isomorphic-fetch';
import apiPath from '#/appConfig';

import { isNode } from '#/utils';

/* Make request to server to check data */

export default async (values, dispatch, props) => {

    let config = { 
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    cache: 'reload'
    }

    config.body = JSON.stringify({
        fields: [
            {
                key: "title",
                value: values.title
            },
            {
                key: "link",
                value: values.link || null
            }            
        ],
        resource_slug: props.mapProps.match.params && props.mapProps.match.params.resource ? props.mapProps.match.params.resource : null
    });

    let token = !isNode ? localStorage && localStorage.getItem('reda_uid_t') : null
    config.headers.RedaUid = `${token}`;
    config.headers.Authorization = `${token}`;

    let response = await fetch(apiPath.api + 'resources/async-validate', config);
    let json = await response.json();

    if (!response.ok) {        
        throw {
            title: "Erro de comunicação com o servidor",
            link: "Erro de comunicação com o servidor"
        }
    }

    // Are there any words?
    if (json.result && json.result.length>0){
        
        let errorsObj = {};

        json.result.map(error => {
            errorsObj[error.field] = error.error;
        })
        throw errorsObj;
    }  
}