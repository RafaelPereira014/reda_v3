'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';

// Components
import HelpPopover from '#/components/common/helpPopover';

// Components
import renderFormControl from '#/components/fields/genericField';
import renderTextArea from '#/components/fields/textareaInput';
import renderTagsInput from '#/components/fields/resourceTagsInput';
import HierarchyList from '#/components/fields/terms/hierarchyFields';

// Validation
import validate from './validate';

export const fields = [ 
  'title',
  'description', 
  'link',
  'terms',
  'tags'
]


/**
 * FORM FIRST PAGE
 */
class NewToolForm extends Component {
  constructor(props){
    super(props);

    //
    //  Renders
    //

    //
    //  Event handlers
    //
    this.setTerms = this.setTerms.bind(this);
    this.setTags = this.setTags.bind(this);
    this.backClick = this.backClick.bind(this);

    //
    //  Helpers
    //
    this.selectHierarchy = this.selectHierarchy.bind(this);

    this.state = {
      firstRender: true
    }
  }

  componentDidMount(){
    this.props.mapProps.fetchTaxonomies([
			{
				key: "type",
				value: "tools"
			},
			{
				key: "terms",
				value: true
			},
			{
				key: "exclude",
				value: [
					'tags_tools'
				]
			}
    ], false);
  }

  // Set terms
  setTerms(terms){
    let parents = [];

    //  For each taxonomy, get parents of selected terms
    this.props.mapProps.taxonomies.data.map(tax => {
      parents = parents.concat(this.selectHierarchy(terms, tax.Terms));
    });

    //  Remove a parent from list if it was really deselected
    parents = parents.filter(parent => {
      if(this.props.terms.indexOf(parent)>=0 && terms.indexOf(parent)<0){
        return false;
      }
      return true;
    });

    parents = [...new Set(parents)];
    
    // Set to update and change terms field
    this.props.change('terms', terms.concat(parents));
  }

  //  Get parents of selected terms in hierarchy
  selectHierarchy(selected, allTerms){
    let finalSelection = [];

    //  Get full object of selected terms
    let selectedObj = allTerms.filter(obj => selected.indexOf(obj.id)>=0 && obj.parent_id!==null);

    if(selectedObj.length>0){
      //  Get parent id of each selected object
      finalSelection = finalSelection.concat(selectedObj.reduce((acc, cur) => [...acc, cur.parent_id], []) || []);
      
      //  Get parent id of those parents
      finalSelection = finalSelection.concat(this.selectHierarchy(finalSelection, allTerms));
    }
    
    return finalSelection;
  }

  // On change TAGS
  setTags(tags){
    this.props.change('tags', tags);
  }

  backClick(){
    this.props.mapProps.history.goBack();
  }

  render() {
    const {
      tags, 
      invalid,
      handleSubmit,
      submitting,
      submitFailed,
      mapProps
    } = this.props;

    if (typeof tags == 'string' || !mapProps.taxonomies.data){
      return null;
    }

    return (
      <form onSubmit={handleSubmit} className="form first-page box-form">
        {/* FIRST ROW */}
        <div className="row">
          <div className="col-xs-12">
            <label className="input-title required">Título</label>
            <Field
              controlType="input"
              type="text"
              className="form-control"
              formGroupClassName="form-group"
              placeholder="Nome da ligação"
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
              placeholder="Descreva esta ligação sucintamente"
              component={renderTextArea} 
              name="description"
              maxLength={1500}
              minLength={20}/>           
          </div>
        </div>

        {/* LINK */}
        <div className="row">
          <div className="col-xs-12">
            <label className="input-title required">Endereço</label>
            <Field
              controlType="input"
              type="text"
              className="form-control"
              formGroupClassName="form-group"
              placeholder="Endereço da ligação"
              component={renderFormControl} 
              name="link"/>
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

        {
          // Terms
        }
        <Field
          component={HierarchyList}
          taxs={mapProps.taxonomies.data}
          selected={this.props.terms}
          setTerms={this.setTerms}
          collapsed={true}
          name="terms"/>

        {/* NEXT */}
        <footer className="form-buttons">
        <p><small><span className="text-danger">*</span> Campo obrigatório</small></p>
        {submitFailed && invalid && 
              <div className="alert alert-danger" role="alert">
                <p>Existem alguns problemas nos dados fornecidos. Reveja o formulário e os respetivos erros.</p>
              </div>
          }
          <button type="submit" disabled={submitting} className="cta primary">
            {submitting ? <i className='fa fa-spinner fa-spin'></i> : ""} {mapProps.tool && mapProps.tool.data && mapProps.tool.data.id ? "Guardar alterações" : "Criar ferramenta"}
          </button>
          <a className="cta no-bg" onClick={this.backClick} role="link">Cancelar</a>
        </footer>
      </form>
    )
  }
}

NewToolForm.propTypes = {
  fields: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

const selector = formValueSelector('newLink');

let SelectingFormValuesForm = reduxForm({
  form: 'newLink',              // <------ same form name
  fields,                      // <------ only fields on this page
  destroyOnUnmount: false,
  validate                     // <------ only validates the fields on this page
})(NewToolForm);

export default connect (
  state => ({
    initialValues: {
      tags: [],
      terms: []
    },
    title: selector(state, 'title'),
    description: selector(state, 'description'),
    link: selector(state, 'link'),
    terms: selector(state, 'terms'),
    tags: selector(state, 'tags'),
    hasErrors: selector(state, 'hasErrors')
  })
)(SelectingFormValuesForm);