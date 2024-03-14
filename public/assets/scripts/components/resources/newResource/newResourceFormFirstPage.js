'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, Fields, formValueSelector } from 'redux-form';
import _ from 'lodash';

// Utils
import { scrollToTop, showFileSize } from '#/utils';

import appConfig from '#/config';

// Components
import HelpPopover from '#/components/common/helpPopover';

import renderTinyMCE from '#/components/fields/tinyMCE';
import renderTinyMCESimple from '#/components/fields/tinyMCESimple';
import renderFormControl from '#/components/fields/genericField';
import renderRadioGroupInput from '#/components/fields/radioGroupInput';
import renderFileInput from '#/components/fields/fileInput';
import renderMediaInput from '#/components/fields/resources/mediaInput';
import renderLinksInput from '#/components/fields/resources/linksInput';
import renderCheckboxGroup from '#/components/fields/checkboxGroupInput';
import Loader from '../../../utils/loader';


// Validation
import validate from './validateFirstPage';
import asyncValidate from './asyncValidate';
import TinyMCEField from '../../fields/tinyMCE';

export const fields = [ 
  'title',
  'author', 
  'email',
  'organization',
  'tags',
  'format',
  'file',
  'embed',
  'link',
  'duration',
  'access',
  'techResources',
  'otherTechResources',
  'description',
  'isOnline',
  'isFile',
  'thumbnail',
  'language',
]


/**
 * FORM FIRST PAGE
 */
class NewResourceFormFirstPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      access: null,
      formats: null,
      languages: [],
    }

    //
    //  Renders
    //

    //
    //  Event handlers
    //
    this.setFormat = this.setFormat.bind(this);
    this.setAccess = this.setAccess.bind(this);
    this.setFile = this.setFile.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.setAutoAccess = this.setAutoAccess.bind(this);
    this.onlineChange = this.onlineChange.bind(this);
    this.isFileChange = this.isFileChange.bind(this);
    this.setThumbnail = this.setThumbnail.bind(this);
    this.setLanguage = this.setLanguage.bind(this);
    this.backClick = this.backClick.bind(this);
    this.setTechResources = this.setTechResources.bind(this);
    this.setOtherTechResources = this.setOtherTechResources.bind(this);
    this.setDescription = this.setDescription.bind(this);
  }

  componentDidMount(){    
    this.props.mapProps.fetchConfig();
    this.props.mapProps.fetchTaxonomies([
      {
        key: "type",
        value: "rec"
      },
      {
        key: "terms",
        value: true
      },
      {
        key: "exclude",
        value: [
          "tags_resources",
          "areas_resources",
          "dominios_resources",
          //"macro_areas_resources",
          "anos_resources"
        ]
      }
    ])
    .then(() => {
      let buildState = this.state;

      // Split taxonomies to individual keys for easy use
      this.props.mapProps.taxonomies.data.map(tax => {
        switch(tax.slug){
          case "modos_resources":
            buildState.access=tax.Terms;
            break;
          case "formato_resources":
            buildState.formats=tax.Terms;
            break;
          case "lang_resources":
            buildState.languages=tax.Terms;
            break;
          case "tec_requirements_resources":
            buildState.techResources=tax.Terms;
            break;
        }
      })
      
      // Set default to downloadable if nothing set
      buildState.access.map((mode) =>{
        (!this.props.access || this.props.access.length==0) && mode.title=="Descarregável" && this.props.change('access', [mode.id]);
      });

      this.setState(buildState);
    });

    scrollToTop();
  }

  

  // On change FORMATS
  setFormat(format){
    this.props.change('format', format);
    //this.props.change('isFile', false);

    if(format.includes(34842)){
      this.props.change('isOnline', true);
    }else{
      this.props.change('isOnline', false);
    }

    if(!format.includes(34842) || !format.includes(34844)){
      this.props.change('duration', null);
    }

    // Set access mode
    _.forEach(this.state.access, (mode) =>{   
      // If video, is online
      if (format.includes(34842) && mode.title=="Online"){
        this.props.change('access', [mode.id]);
      // If not, and if resource is not online, set to downloadable
      }else if (!format.includes(34842) && !this.props.isOnline.value && mode.title=="Descarregável"){
        this.props.change('access', [mode.id]);   
      }
    })
    
  }

  // On change FORMATS
  setAccess(access){
    this.props.change('access', access);
  }

  // On change FILE
  setFile(file){
    this.props.change('file', file);
  }

  // On change THUMBNAIL
  setThumbnail(file){
    this.props.change('thumbnail', file);
  }

  // On change LANGUAGES
  setLanguage(language){
    this.props.change('language', language);
  }

  // Set auto access mode
  setAutoAccess(val){
    // Set access mode based on resource location
    if (this.state.access){      
      _.forEach(this.state.access, (mode) =>{    
        // If is online and this mode is online
        if (val && mode.title.indexOf("Online")>=0){
          this.props.change('access', [mode.id]);
        // If is not online and is a file, set to downloadable
        }else if (!val && mode.title.indexOf("Descarregável")>=0){
          this.props.change('access', [mode.id]);    
        }
      })
    }
  }

  //  On tech resources change
  setTechResources(content){
    this.props.change('techResources', content);
  }

  setOtherTechResources(other){
    this.props.change('otherTechResources', other);
  }

  //  On description change
  setDescription(content){
    this.props.change('description', content);
  }

  setTitle(title){
    this.props.change('title', title);
  }

  // On change FILE
  onlineChange(e){

    const val = e.target.checked;

    this.props.change('isOnline', val);
    this.props.change('isFile', false); 

    this.setAutoAccess(val);
    
  }

  // If set file
  isFileChange(e){

    const val = e.target.checked;

    this.props.change('isFile', val);
    this.props.change('isOnline', false);

    this.setAutoAccess(false);
  }

  backClick(){
    this.props.mapProps.history.goBack();
  }

  render() {
    const {
      thumbnail,
      format,
      isOnline,
      isFile,
      file,
      submitFailed,
      invalid,
      handleSubmit,
    } = this.props;

    const { 
      config,
      resource
    } = this.props.mapProps;


    if (!this.state.access || !this.state.access || this.state.access==0 || this.state.formats.length==0){
      return null;
    }

    let thumbnailUrl = null;

    if (thumbnail && (thumbnail.fullResult || (config && config.data))){
      thumbnailUrl = thumbnail.fullResult || config.data.files+"/resources/"+resource.data.slug+"/"+thumbnail.name+"."+thumbnail.extension;
    }    
    return (

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="form first-page box-form">
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <h1>Detalhes</h1>
          </div>  
        </div>

        {/* FIRST ROW */}
        <div className="row">
          <div className="col-xs-12 form-group">  
          <label className="input-title required">Título</label>
          <Field
                className="form-control" 
                placeholder="Nome do recurso"
                component={renderTinyMCESimple}
                handleChange={this.setTitle}
                name="title"
                rows={1}/>       

        
           { /*<Field
            controlType="input"
            type="text"
            className="form-control" 
            placeholder="Nome do recurso"
            component={renderFormControl} 
            name="title"
            childPos="top">
              <label className="input-title required">Título</label>
              
            </Field>*/}
          </div>                    
        </div>

        {/* SECOND ROW */}
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <label className="input-title required">Autor/Fonte</label>
            <Field
            controlType="input"
            type="text"
            className="form-control"
            formGroupClassName="form-group"
            placeholder="Nome do autor/fonte do recurso"
            component={renderFormControl} 
            name="author"/>
          </div> 
          <div className="col-xs-12 col-sm-6">
            <label className="input-title required">Escola/Organização/Nome do sítio do autor do recurso</label>
            <Field
            controlType="input"
            type="text"
            className="form-control"
            formGroupClassName="form-group"
            placeholder="Escola/organização/nome do sítio do autor do recurso"
            component={renderFormControl} 
            name="organization"/>
          </div>   
        </div>

        {/* FORMATS */}
        <div className="row">
          <div className="col-xs-12 ">
            <label className="input-title required">Formato (max. 2)</label> 
            <Field
            formGroupClassName="form-group"
            component={renderCheckboxGroup}
            name="format"
            list={this.state.formats}
            handleOnChange={this.setFormat}

            />     
          </div>
        </div>

        { /*VIDEO DURATION IF SO */}
        {(() => {
            if(format && format.includes(34842) || format && format.includes(34844)){
              return(
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-6">
                    <label className="input-title required">Duração</label>
                    <Field
                    controlType="input"
                    type="text"
                    className="form-control"
                    formGroupClassName="form-group"
                    placeholder="ex: 01:02:00"
                    component={renderFormControl} 
                    name="duration"/>         
                  </div>
                </div>
              )
            }
          })()}


        {/* File */}
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6">
            <label className="input-title required">Localização do recurso</label>
              {
                // ONLINE CHECKBOX 
              }
              {(() => {
                if(!format || !format.includes(34842)){
                  return(
                    <Fields 
                    names={[ 
                      'isOnline',
                      'isFile'
                    ]}
                    handleIsOnlineChange={this.onlineChange}
                    handleIsFileChange={this.isFileChange}
                    component={renderMediaInput}/>
                  )
                }
              })()}

              {
                // CONDITIONAL INPUT FIELD
              }
              {(() => {

                // If it is not online, and it is not a video, set as a file upload
                if(!isOnline && (!format || !format.includes(34842)) && isFile){
                    return (
                      <Field
                      controlType="input"
                      type="text"
                      className="form-control"
                      formGroupClassName="form-group"
                      handleChange={this.setFile}
                      component={renderFileInput} 
                      name="file"
                      footNote={"Tamanho máximo de ficheiro é de "+showFileSize(appConfig.maxFileSize)}/> 
                    )
                }else if ((isOnline && isOnline==true) || (format && format.includes(34842))) {
                  // If it is online or is a video, set the link or embed field
                  return (
                    <Fields 
                    names={[ 
                      'link',
                      'embed'
                    ]}
                    component={renderLinksInput}/>
                  )
                }
              })()}
          </div>
        </div>

        {/* ACCESS */}
        <div className="row">
          <div className="col-xs-12">
            <HelpPopover 
              className="fa fa-question-circle form-help" 
              id="use_popover" 
              title="Descarregável da plataforma ou do sítio de origem."/>
            <label className="input-title required">Modo de utilização</label>
            <Field
              handleOnChange={this.setAccess}
              name="access"
              list={this.state.access}
              textIndex="title"
              orderBy="title"
              formGroupClassName="form-group"
              component={renderCheckboxGroup} />           
          </div>
        </div>

        {/* TECH RESOURCES */}
        <div className="row">
          <div className="col-xs-12">
            <label className="input-title">Requisitos Técnicos</label>
            <Field
              handleOnChange={this.setTechResources}
              name="techResources"
              list={this.state.techResources}
              textIndex="title"
              orderBy="title"
              formGroupClassName="form-group"
              component={renderCheckboxGroup}
 />
      {/*
            <span><em>Outrosss</em></span>
            <Field
                className="form-control" 
                placeholder="Outros requisitos técnicos que não estejam na lista acima"
                component={renderTinyMCESimple}
                handleChange={this.setOtherTechResources}
                name="otherTechResources"
                rows={1}/>  
            */}
           {/*<Field
              controlType="input"
              type="text"
              className="form-control"
              formGroupClassName="form-group"
              component={renderFormControl} 
              name="otherTechResources"/>*/}
          </div>
        </div>
        {/* <div className="row">
          <div className="col-xs-12">
            <Link to="/ajuda?tab=4" className="popover__link" target="_blank">
                <HelpPopover 
                className="fa fa-question-circle form-help" 
                id="techresources_popover" 
                placement="right"
                title='Consulte a informação disponível em "Submeter um recurso",  no separador Ajuda, para mais informação sobre Requisitos Técnicos'/>
              </Link>
            <label className="input-title required">Requisitos Técnicos</label>
            <Field
              className="form-control" 
              placeholder="Por exemplo: Adobe Flash Player, Adobe Shockwave Player, 7zip, Folha de Cálculo, GeoGebra, Java, Leitor de vídeo (e.g., VLC Media Player, Windows Media Player) + Colunas áudio, Leitor de áudio (e.g., AVI, Windows Media Player) + Colunas áudio, Processador de texto, Visualizador de imagem, N/A, etc."
              component={renderTinyMCE} 
              handleChange={this.setTechResources}
              name="techResources"
              rows={20}> 
                <small style={{fontStyle: "italic",paddingTop:"10px", paddingBottom: "20px"}}>Por exemplo: Adobe Flash Player, Adobe Shockwave Player, 7zip, Folha de Cálculo, GeoGebra, Java, Leitor de vídeo (e.g., VLC Media Player, Windows Media Player) + Colunas áudio, Leitor de áudio (e.g., AVI, Windows Media Player) + Colunas áudio, Processador de texto, Visualizador de imagem, N/A, etc.</small>
            </Field>        
          </div>
        </div> */}

        {/* DESCRIPTION */}
        <div className="row">
          <div className="col-xs-12 form-group margin__top--15">
            <label className="input-title required">Descrição</label>
             {/* <Field
              className="form-control" 
              placeholder="Descreva este recurso sucintamente"
              component={renderTextArea} 
              maxLength={1500}
              minLength={20}
              name="description"/>   */}     
              <Field
                className="form-control" 
                placeholder="Descreva este recurso sucintamente"
                component={renderTinyMCE} 
                handleChange={this.setDescription}
                name="description"
                maxLength={1500}
                minLength={20}
                rows={20}/>     
          </div>
        </div>

        {/* LANGUAGES */}
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <label className="input-title required">Idiomas</label>
            <Field
              formGroupClassName="form-group"
              component={renderRadioGroupInput} 
              name="language"
              list={this.state.languages}
              handleChange={this.setLanguage}
              reverse={true}
              singleCol={true}/>
          </div>
        </div> 

        {/* Thumbnail */}
        <div className="row">
          <div className="col-xs-12">
            <label className="input-title">Imagem de destaque</label>
            <Field
            controlType="input"
            type="text"
            className="form-control"
            formGroupClassName="form-group"
            handleChange={this.setThumbnail}
            component={renderFileInput} 
            name="thumbnail"
            footNote={"Tamanho máximo de ficheiro é de "+showFileSize(appConfig.maxThumbFileSize)}/> 

            {((thumbnail && thumbnail.id) || (thumbnail && thumbnail.data)) && !thumbnail.error && thumbnail && <div className="row">
              <div className="image-preview" style={{marginBottom: "180px"}}>
                <img className="img-responsive" src={thumbnailUrl} />
              </div>
            </div>} 
          </div>
        </div>

        {/* NEXT */}
        <footer className="form-buttons" style={{marginTop: "20px"}}>
          <p><small><span className="text-danger">*</span> Campo obrigatório</small></p>
          {submitFailed && invalid && 
              <div className="alert alert-danger" role="alert">
                <p>Existem alguns problemas nos dados fornecidos. Reveja o formulário e os respetivos erros.</p>
              </div>
          }
          <button type="submit" className="cta primary" disabled={file && file.loading}>Continuar</button>
          <a className="cta no-bg" onClick={this.backClick} role="link">Cancelar</a>
        </footer>
      </form>

    )
  }
}

NewResourceFormFirstPage.propTypes = {
  fields: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

const selector = formValueSelector('newResource');

let SelectingFormValuesForm = reduxForm({
  form: 'newResource',              // <------ same form name
  fields,                      // <------ only fields on this page
  destroyOnUnmount: false,     // <------ preserve form data
  validate,                    // <------ only validates the fields on this page
  asyncValidate,
  asyncBlurFields: [ 'title', 'link' ],
})(NewResourceFormFirstPage);

export default connect (
state => ({
  initialValues: {
    exclusive: true,
    access: [],
    isOnline:false,
    isFile: false,
    tags: [],
    format: [],
    techResources: []
  },
  title: selector(state, 'title'),

  link: selector(state, 'link'),
  embed: selector(state, 'embed'),
  access: selector(state, 'access'),
  isOnline: selector(state, 'isOnline'),
  isFile: selector(state, 'isFile'),
  hasDomains: selector(state, 'hasDomains'),
  exclusive: selector(state, 'exclusive'),
  format: selector(state, 'format'),
  file: selector(state, 'file'),
  thumbnail: selector(state, 'thumbnail'),
  language: selector(state, 'language'),
  otherTechResources: selector(state, 'otherTechResources'),
}))(SelectingFormValuesForm);