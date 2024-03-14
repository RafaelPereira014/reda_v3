'use strict';

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { reduxForm, Field, FieldArray, formValueSelector } from 'redux-form';

// Utils
import { showFileSize, scrollToTop } from '#/utils';

import appConfig from '#/config';

// Components
import HelpPopover from '#/components/common/helpPopover';

import renderFormControl from '#/components/fields/genericField';
import renderTextArea from '#/components/fields/textareaInput';
import renderTagsInput from '#/components/fields/resourceTagsInput';
import renderCheckboxGroup from '#/components/fields/checkboxGroupInput';
import renderFileInput from '#/components/fields/fileInput';
import renderAppLinksField from '#/components/fields/apps/appLinksField';

// Validation
import validate from './validate';

export const fields = [ 
  'title',
  'description', 
  'links[].id',
  'links[].title',
  'links[].link',
  'image',
  'tags',
  'terms',
  'taxs[]'
]


/**
 * FORM FIRST PAGE
 */
class NewAppForm extends Component {
  constructor(props){
    super(props);

    //
    //  Set state
    //
    this.state = {
      systems: {
        terms: []
      },
      firstRender: true
    }

    //
    //  Renders
    //
    this.renderTerms = this.renderTerms.bind(this);

    //
    //  Event handlers
    //
    /* this.setTerms = this.setTerms.bind(this); */
    this.setImage = this.setImage.bind(this);
    this.setTags = this.setTags.bind(this);
    this.backClick = this.backClick.bind(this);
  }

  async componentDidMount(){
    await this.props.mapProps.fetchTaxonomies([
			{
				key: "type",
				value: "apps"
			},
			{
				key: "terms",
				value: true
			},
			{
				key: "exclude",
				value: [
					'tags_apps'
				]
			}
    ], false);

    let buildState = this.state;
    
    // Split taxonomies to individual keys for easy use
    this.props.mapProps.taxonomies.data.map(tax => {
      switch(tax.slug){
        case "sistemas_apps":
          buildState.systems = {
            terms: tax.Terms
          };
          break;
      }
    });

    this.setState(buildState);
    scrollToTop();
  }

  componentDidUpdate(prevProps, prevState) {
    const { systems } = this.state;

    // Set links fields after updating
    if(
      ((!prevState.systems.terms || prevState.systems.terms.length==0) && (systems.terms && systems.terms.length>0))
      || (systems.terms && systems.terms.length>0 && this.state.firstRender)){      
        
        // Set new ones
        systems.terms.map(system => {        
          this.props.links.push({
            id: system.id,
            title: system.title,
            link: ''
          });            
        });
        this.setState({firstRender: false});
    }
  }

  // On change FILE
  setImage(image){
    this.props.change('image', image);
  }

  // Set terms
  setTerms(tax, terms){
    this.props.change('terms', terms);


    
    this.props.mapProps.taxonomies.data.map(thisTax => {
      let curTaxTerms = [];
      if(thisTax.slug == tax.slug){
        curTaxTerms = tax.Terms.filter(term => terms.indexOf(term.id)>=0).reduce((acc, cur) => [...acc, cur.id], []);
        this.props.change(thisTax.slug, curTaxTerms);
      }
    });

    /* let taxsProp = {
      ...this.props.taxs,
      [tax.slug]: curTaxTerms
    };

    this.props.change('taxs', taxsProp); */
  }

  // On change TAGS
  setTags(tags){
    this.props.change('tags', tags);
  }

  renderTerms(){
    const { data } = this.props.mapProps.taxonomies;
    
		if (!data || data.length==0){
			return null;
    }
    

    return(
      <Fragment>
				{data.map( (item, taxIdx) => (
          <div className="row" key={taxIdx}>
            <div className="col-xs-12">
              <label className="input-title required">{item.title}</label>
              <Field
                handleOnChange={this.setTerms.bind(this, item)}
                name={item.slug}
                list={item.Terms}
                formGroupClassName="form-group"
                component={renderCheckboxGroup}
                customCheckbox={true}
                cols={{
                  xs:12
                }} /> 
            </div>

            {(item.slug == 'sistemas_apps') ? 
              <div className="col-xs-12">
                <FieldArray
                  name={"links"}
                  component={renderAppLinksField}
                  formGroupClassName="form-group"
                  systems={this.props.terms}/>
              </div>
            :
                null
            }
          </div>
        ))}
      </Fragment>
    )
  }
  
  backClick(){
    this.props.mapProps.history.goBack();
  }

  render() {
    const {
      image,
      invalid,
      handleSubmit,
      submitting,
      submitFailed,
      mapProps
    } = this.props;

    if (typeof tags == 'string' || !mapProps.taxonomies){
      return null;
    }


    let imageUrl = null;
    if (image && (image.fullResult || mapProps.config.data)){
      imageUrl = image.fullResult || mapProps.config.data.files+"/apps/"+mapProps.match.params.app+"/"+image.name+"."+image.extension;
    }
    

    return (
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="form first-page box-form">

        {/* FIRST ROW */}
        <div className="row">
          <div className="col-xs-12">
            <label className="input-title required">Título</label>
            <Field
              controlType="input"
              type="text"
              className="form-control"
              formGroupClassName="form-group"
              placeholder="Nome da aplicação"
              component={renderFormControl} 
              name="title"/>
          </div>          
        </div>

        {/* DESCRIPTION */}
        <div className="row">
          <div className="col-xs-12">
            <label className="input-title required">Descrição</label>
            <Field
              formGroupClassName="form-group"
              className="form-control"
              placeholder="Descreva esta aplicação sucintamente"
              component={renderTextArea} 
              name="description"
              maxLength={1500}
              minLength={20}/>          
          </div>
        </div>

        {/* TAGS */}
        <div className="row">
          <div className="col-xs-12">
            <label className="input-title">Palavras-chave</label>
            <Field
            formGroupClassName="form-group"
            component={renderTagsInput} 
            name="tags"
            childPos="top"
            footNote="Deve escrever entre 1 e 10 palavras ou expressões"
            placeholder="Palavras-chave"
            handleChange={this.setTags}>
              <HelpPopover 
              className="fa fa-question-circle form-help fRight" 
              id="tags_popover" 
              placement="left"
              title="Utilize a vírgula, ponto e vírgula ou a tecla ENTER para separar as palavras."/>
            </Field>       
          </div>
        </div>

        
        {this.renderTerms()}

        
        <div className="row">
          {/*File*/}
          <div className="col-xs-12">
            <label className="input-title">Imagem de destaque</label>
            <Field
              controlType="input"
              type="text"
              className="form-control"
              formGroupClassName="form-group"
              handleChange={this.setImage}
              component={renderFileInput} 
              name="image"
              footNote={"Tamanho máximo de ficheiro é de "+showFileSize(appConfig.maxThumbFileSize)}/> 

            {((image && image.id) || (image && image.data)) && !image.error && imageUrl && <div className="row">
              <div className="image-preview">
                <img className="img-responsive" src={imageUrl} />
              </div>
            </div>}            
          </div>
        </div>

        {/* NEXT */}
        <footer className="form-buttons">
        <p><small><span className="text-danger">*</span> Campo obrigatório</small></p>
        {submitFailed && invalid && 
              <div className="alert alert-danger" role="alert">
                <p>Existem alguns problemas nos dados fornecidos. Reveja o formulário e os respetivos erros.</p>
              </div>
          }
          <button type="submit" disabled={submitting} className="cta primary">
            {submitting ? <i className='fa fa-spinner fa-spin'></i> : ""} {mapProps.app.data && mapProps.app.data.id ? "Guardar alterações" : "Criar aplicação"}
          </button>
          <a className="cta no-bg" onClick={this.backClick} role="link">Cancelar</a>
        </footer>
      </form>
    )
  }
}

NewAppForm.propTypes = {
  fields: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

const selector = formValueSelector('newApp');

let SelectingFormValuesForm = reduxForm({
  form: 'newApp',              // <------ same form name
  fields,                      // <------ only fields on this page
  destroyOnUnmount: false,
  validate                     // <------ only validates the fields on this page
})(NewAppForm);

export default connect (
state => ({
  initialValues: {
    links: [],
    tags: []
  },
  title: selector(state, 'title'),
  description: selector(state, 'description'),
  links: selector(state, 'links'),
  image: selector(state, 'image'),
  terms: selector(state, 'terms'),
  taxs: selector(state, 'taxs'),
}))(SelectingFormValuesForm);
