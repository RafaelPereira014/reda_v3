import React, { Component } from 'react';

import appConfig from '#/config';
import appEnvConfig from '#/appConfig';

//  Utils
import { stripAllTags } from '#/utils';

//  Components
import { Editor } from '@tinymce/tinymce-react';

export default class TinyMCEField extends Component {
  constructor(props) {
    super(props);

    this.editor = null;

    //
    //  Handlers
    //
    this.editorSetup = this.editorSetup.bind(this);
    
  }

  editorSetup(editor){
    this.editor = editor;
  }

  render() {
    const {
      input, 
      meta: { 
        touched, 
        error, 
        invalid 
      }, 
      formGroupClassName, 
      childPos,
      children,
      handleChange,
      maxLength,
      minLength
    } = this.props;

    let noHtmlContent = this.editor ? stripAllTags(this.editor.getContent()) : stripAllTags(input.value);

    return(
      <div className={`${formGroupClassName || ''} ${touched && (invalid) ? 'has-error' : ''}`}>
      {childPos && childPos == "top" && children ? children : null}
      <Editor
        apiKey={appConfig.tinyMCEKey}
        init={{
          charset: 'utf8mb4',
          language: 'pt_PT',
          entity_encoding : "raw",
          //language_url: `${appEnvConfig.domainClean}assets/files/tinymce/language/pt_PT.js`,
          plugins: 'table link',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | link unlink | fontsizeselect',
          content_style: '.mce-content-body {font-size:13px;font-family:Open Sans, sans-serif}',
          menubar: 'edit view format table tools insert',
          min_height: 400,
          // added forced root block to remove p tag
          forced_root_block : false,
          invalid_elements: "script,link,iframe,applet,style,form,noframes,noscript,plaintext,xml,head,html,body,object,embed,frame,layer,ilayer,meta,bgsound,isindex,nextid",
          fontsize_formats: "11px 13px 14px 16px 18px 24px 36px 48px",
          setup: this.editorSetup
        }}
        onEditorChange={handleChange}
        textareaName={input.name}
        {...input}
      />

      {
        maxLength && minLength?
        <div className="row">
          <div className="col-xs-6">
            <span>{noHtmlContent.length + "/" + maxLength}</span>
          </div>
          <div className="col-xs-6 text-right">
            <small>Deve ter no mínimo {minLength} car{minLength>1 && 'a' || 'á'}cter{minLength>1 && 'es'} e no máximo {maxLength}</small>
          </div>
        </div>
        : null
      }
      

      {childPos && childPos == "middle" && children ? children : null}
      {touched && error && <div className="text-danger">{error}</div>}
      {childPos && childPos == "bottom" && children ? children : null}
      </div>
    );
  }
}