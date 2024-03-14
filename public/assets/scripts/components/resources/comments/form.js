'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import renderTextArea from '#/components/fields/textareaInput';


// Actions
import * as alertMessages from '#/actions/message-types';

// Utils
import ReactGA from 'react-ga';

export default class CommentForm extends Component {
  constructor(props){
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }


  onSubmit(data){
    let finalData = {
      comment: data.description
    }

    if (this.props.parent){
      finalData.parent = this.props.parent;
    }

    this.props.addComment(finalData, this.props.resource)
    .then(() => {

      const { comments } = this.props;

      if (comments.errorMessage || comments.errorStatus){
        this.props.addAlert(alertMessages.ALERT_COMMENT_ADD_ERROR, alertMessages.ERROR);
      }else{
        this.props.addAlert(alertMessages.ALERT_COMMENT_CREATE_SUCCESS, alertMessages.SUCCESS)
        this.props.fetchComments({resource: this.props.resource}, {activePage:1, limit: 5});

        ReactGA.event({
          category: 'Comment',
          action: 'Adicionou um novo comentário ao recurso: '+ this.props.resource,
          label: 'Adicionar comentário a: ' + this.props.resource
        });
      }

      this.props.reset();
      
    })
  }

  componentWillUnmount(){
    this.props.reset();
  }


  render() {
    const { 
      asyncValidating, 
      badwords,
      handleSubmit, 
      submitting } = this.props;

    return (
      <div className="comment-form box-form">
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
              formGroupClassName="form-group"
              className="form-control"
              placeholder="Descrição"
              component={renderTextArea} 
              name="description"
              childPos="middle"> 
                {asyncValidating === 'description' && <i className='fa fa-spinner fa-spin'/>}
          </Field>

          <div className="text-center">
            {badwords && badwords.error && 
                <div className="alert alert-danger text-left" role="alert">
                  <p>Reveja as seguintes palavras:</p>
                  <p><strong><em>{badwords.error}</em></strong></p>
                </div>
            }
            <button type="submit" disabled={asyncValidating || submitting || (badwords && badwords.error)} className="cta primary">
              Submeter comentário
            </button>
          </div>
        </form>
      </div>
    )
  }
}

CommentForm.propTypes = {
  fields: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}

CommentForm.contextTypes = {
  router: PropTypes.object
}