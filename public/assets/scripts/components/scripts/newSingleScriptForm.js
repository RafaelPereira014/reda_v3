'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  reduxForm,
  Field,
  formValueSelector
} from 'redux-form';

// Utils
import { showFileSize } from '#/utils';

import appConfig from '#/config';

// Components
import renderFormControl from '#/components/fields/genericField';
import renderCheckboxGroup from '#/components/fields/checkboxGroupInput';
import renderTinyMCE from '#/components/fields/tinyMCE';
import renderFileInput from '#/components/fields/fileInput';
import renderTagsInput from '#/components/fields/resourceTagsInput';
import HelpPopover from '#/components/common/helpPopover';
import MultiStep from '#/components/fields/terms/multistep';

// Validation
import { validateScript as validate } from './validate';

export const fields = [
  'id',
  'title',
  'description',
  //'macro',
  'subjects',
  'domains',
  'subdominios',
  'hashtags',
  'years',
  'terms',
  'file',
  'op_proposal',
  'accept_terms',
  'hasDomains',
  'tags'
];
// ^^ All fields on last form

class NewSingleScriptForm extends Component {
  constructor(props) {
    super(props);

    //
    //  Set state
    //
    this.state = {
      initialized: false,
      subjects: {
        terms: []
      },
    /*  macro: {
        terms: []
      },*/
      domains: {
        terms: []
      },
      years: {
        terms: []
      },
      subdominios: {
        terms: []
      },
      hashtags: {
        terms: []
      },
      targets: {
        terms: []
      },
      visible_terms: []
    };

    //
    //  Renders

    //
    //  Event Handlers
    //
    this.setFile = this.setFile.bind(this);
    this.setTags = this.setTags.bind(this);
    this.setTargets = this.setTargets.bind(this);
    this.backClick = this.backClick.bind(this);
    this.setDescription = this.setDescription.bind(this);

    //
    //  Helpers
    //
  }

  componentDidMount() {
    let buildState = this.state;
    this.props.mapProps.fetchTerms();
    this.props.mapProps
      .fetchTaxonomies([
        {
          key: 'type',
          value: 'rec'
        },
        {
          key: 'terms',
          value: true
        },
        {
          key: 'exclude',
          value: ['formatos_resources', 'modos_resources']
        }
      ])
      .then(() => {
        // Split taxonomies to individual keys for easy use
        this.props.mapProps.taxonomies.data.map(tax => {
          switch (tax.slug) {
            case 'areas_resources':
              buildState.subjects = {
                topRelLevel: tax.topRelLevel,
                terms: tax.Terms
              };
              break;
            case 'dominios_resources':
              buildState.domains = {
                topRelLevel: tax.topRelLevel,
                terms: tax.Terms
              };
              break;
            case 'anos_resources':
              buildState.years = {
                topRelLevel: tax.topRelLevel,
                terms: tax.Terms
              };
              break;
              case 'subdominios':
                buildState.subdominios = {
                  topRelLevel: tax.topRelLevel,
                  terms: tax.Terms
                };
                break;
                case 'hashtags':
                  buildState.hashtags = {
                    topRelLevel: tax.topRelLevel,
                    terms: tax.Terms
                  };
                  break;
            /*case 'macro_areas_resources':
              buildState.macro = {
                topRelLevel: tax.topRelLevel,
                terms: tax.Terms
              };
              break;*/
            case 'target_resources':
              buildState.targets = {
                terms: tax.Terms
              };
              break;
          }
        });

        this.setState(buildState);
      });
  }

  // On change FILE
  setFile(file) {
    this.props.change('file', file);
  }

  // On tags change
  setTags(tags) {
    this.props.change('tags', tags);
  }

  // On targets change
  setTargets(targets) {
    this.props.change('targets', targets);
  }

  //  On description change
  setDescription(content){
    this.props.change('op_proposal', content);
  }

  backClick() {
    this.props.mapProps.history.goBack();
  }

  render() {
    const {
      accept_terms,
      submitFailed,
      invalid,
      handleSubmit,
      submitting
    } = this.props;

    const { mapProps } = this.props;

    if (!mapProps.taxonomies.data || !mapProps.terms.data) {
      return null;
    }

    return (
      <form onSubmit={handleSubmit} className="form script__form box-form">
        {/* META */}
        <section>
          <div className="row">
            <div className="col-xs-12 col-sm-6 script__form--title">
              <h1>Metadados</h1>
            </div>
          </div>

 

          {/* SUBJECTS, YEARS AND LANGUAGES */}

          {/* SUBJECTS, YEARS, ... */}
          {this.props.mapProps.taxonomies.data && this.props.mapProps.taxonomies.data.length>0 ?
            <MultiStep
              change={this.props.change}
              years={this.props.years}
              subjects={this.props.subjects}
              domains={this.props.domains}
              //macro={this.props.macro}
              subdominios={this.props.subdominios}
              hashtags={this.props.hashtags}
              taxonomies={{
                subjects: this.state.subjects,
                domains: this.state.domains,
                years: this.state.years,
                //macro: this.state.macro,
                subdominios: this.state.subdominios,
                hashtags: this.state.hashtags
              }}
            />
          :
            null
          }

                   {/* TAGS */}
                   <div className="row">
            <div className="col-xs-12">
              <HelpPopover
                className="fa fa-question-circle form-help"
                id="tags_popover"
                placement="right"
                title="Insira entre 5 a 10 palavras ou expressões. Utilize a vírgula, o ponto e vírgula ou a tecla ENTER para separar as palavras ou expressões. "
              />
              <label className="input-title required">Palavras-Chave</label>
              <Field
                formGroupClassName="form-group"
                component={renderTagsInput}
                name="tags"
                childPos="top"
                placeholder="Palavras-chave"
                footNote="Deve escrever algumas palavras ou expressões, no minimo de 5 palavras ou expressões."
                handleChange={this.setTags}
              />
            </div>
          </div>

          {/* OPERATION PROPOSAL */}
          <div className="row margin__bottom--15">
            <div className="col-xs-12">
              <label className="input-title required">
                Descrição da proposta de operacionalização
              </label>
              <Field
                className="form-control" 
                placeholder="Indique como este recurso pode ser utilizado/operacionalizado"
                component={renderTinyMCE} 
                handleChange={this.setDescription}
                name="op_proposal"
                maxLength={1500}
                minLength={20}
                rows={20}/>
            </div>
          </div>

          {/* File */}
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-6">
              <label className="input-title">
                Adicione documentos de apoio
              </label>
              <Field
                controlType="input"
                type="text"
                className="form-control"
                formGroupClassName="form-group"
                handleChange={this.setFile}
                component={renderFileInput}
                name="file"
                footNote={
                  'Tamanho máximo de ficheiro é de ' +
                  showFileSize(appConfig.maxScriptFileSize)
                }
              />
            </div>
          </div>
        </section>

        {/* TARGETS */}
        <div className="row">
          <div className="col-xs-12">
            <label className="input-title required">Destinatários</label>
            <Field
              handleOnChange={this.setTargets}
              name="targets"
              list={this.state.targets.terms}
              formGroupClassName="form-group"
              component={renderCheckboxGroup}
              customCheckbox={true}
              cols={{
                lg: 3,
                md: 3,
                sm: 4
              }}
            />
          </div>
        </div>

        {/* TERMS AND CONDITIONS */}
        <section className="terms-conditions">
          <div className="row">
            <div className="col-xs-12">
              <h1>Termos e condições</h1>
              <p
                dangerouslySetInnerHTML={{
                  __html: mapProps.terms.data.acceptance
                }}
              />

              <div className="license">
                <a
                  rel="license"
                  href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
                >
                  <img
                    alt="Licença Creative Commons"
                    src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
                    className="img-responsive"
                  />
                </a>
              </div>

              <div className="buttons">
                <Field
                  controlType="input"
                  type="checkbox"
                  id="accept_terms"
                  name="accept_terms"
                  value={accept_terms}
                  component={renderFormControl}
                  childPos="middle"
                  hidden={true}
                >
                  <label htmlFor="accept_terms">
                    Li e concordo com os “Termos e condições” de submissão.
                  </label>
                </Field>
              </div>
            </div>
          </div>
        </section>

        <footer className="form-buttons">
          <p>
            <small>
              <span className="text-danger">*</span> Campo obrigatório
            </small>
          </p>
          {submitFailed && invalid && (
            <div className="alert alert-danger" role="alert">
              <p>
                Existem alguns problemas nos dados fornecidos. Reveja o
                formulário e os respetivos erros.
              </p>
            </div>
          )}
          <button type="submit" disabled={submitting} className="cta primary">
            {submitting ? <i className="fa fa-spinner fa-spin" /> : ''}{' '}
            {this.props.mapProps.scripts.data
              ? 'Guardar alterações'
              : 'Adicionar proposta'}
          </button>
          <a className="cta no-bg" onClick={this.backClick} role="link">
            Cancelar
          </a>
        </footer>
      </form>
    );
  }
}

NewSingleScriptForm.propTypes = {
  fields: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};

const selector = formValueSelector('newSingleScript');

let SelectingFormValuesForm = reduxForm({
  form: 'newSingleScript', // <------ same form name
  fields, // <------ only fields on this page
  validate // <------ only validates the fields on this page
})(NewSingleScriptForm);

export default connect(state => ({
  initialValues: {
    scripts: [],
    tags: [],
   // macro: [],
    subdominios: [],
    hashtags: [],
    domains: [],
    subjects: [],
    years: [],
    targets: [],
    terms: []
  },
  //macro: selector(state, 'macro'),
  domains: selector(state, 'domains'),
  subdominios: selector(state, 'subdominios'),
  hashtags: selector(state, 'hashtags'),
  hasDomains: selector(state, 'hasDomains'),
  subjects: selector(state, 'subjects'),
  years: selector(state, 'years'),
  terms: selector(state, 'terms'),
  file: selector(state, 'file'),
  op_proposal: selector(state, 'op_proposal'),
  accept_terms: selector(state, 'accept_terms'),
  targets: selector(state, 'targets')
}))(SelectingFormValuesForm);
