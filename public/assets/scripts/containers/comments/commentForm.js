'use strict';

import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import { bindActionCreators } from 'redux';
import { fetchBadwords, fetchComments, addComment } from '#/actions/comments';
import { addAlert } from '#/actions/alerts';
import fetch from 'isomorphic-fetch';
import apiPath from '#/appConfig';

// Components
import CommentForm from '#/components/resources/comments/form';

export const fields = [ 
  'description',
  'badwords'
];

/* Validate field types */
export const validate = () => {
  const errors = {}
  return errors
}

/* Make request to server to check data */
export const asyncValidate = (values) => {

  let config = { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'reload'
  }

  
  return new Promise((resolve, reject) => {
      config.body = JSON.stringify({comment: values.description});
    
      // Check backwords from API
      return fetch(apiPath.api + 'comments/has-badwords', config)
      .then(response =>{
          return response.json()
          .then(json => ({ json, response }))
        }
      ).then(({ json, response }) => {

        if(!values || !values.description){
          return reject({ description: 'Deve preencher o campo para submeter', badwords: null });
        }

        if (!response.ok) {        
          return reject({description: "Erro de comunicação com o servidor"})
        }

        // Are there any words?
        if (json.result && json.result.length>0){
          let palavrasErro = '';

          // Print words as error
          for(let word of json.result){
            if (palavrasErro.length>0){
              palavrasErro += ', ';
            }

            palavrasErro += word.title;
          }

          reject({ description: 'Existem palavras no seu comentário que são proibidas.', badwords: palavrasErro });

        } else {
          resolve();
        }

      })
      .catch(err => Promise.reject(err))
  })
}

const selector = formValueSelector('CommentForm');

/* Set sharable state */
function mapStateToProps(state) {
  return { 
    badwords: selector(state, 'badwords'),
    auth: state.auth,
    comments: state.comments
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchBadwords,
    addComment,
    fetchComments,
    addAlert
  }, dispatch);
}



let SelectingFormValuesForm = reduxForm({
  fields,
  asyncValidate,
  asyncBlurFields: [ 'description' ],
  validate                     // <------ only validates the fields on this page
})(CommentForm);

export default connect (mapStateToProps, mapDispatchToProps)(SelectingFormValuesForm);
