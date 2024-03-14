'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';

// Utils
import { scrollToTop, showFileSize } from '#/utils';

import appConfig from '#/config';

// Components
import renderFormControl from '#/components/fields/genericField';
import renderTagsInput from '#/components/fields/resourceTagsInput';
import renderCheckboxGroup from '#/components/fields/checkboxGroupInput';
/* import renderTextArea from '#/components/fields/textareaInput'; */
import renderFileInput from '#/components/fields/fileInput';
import HelpPopover from '#/components/common/helpPopover';
import renderTinyMCE from '#/components/fields/tinyMCE';
import MultiStep from '#/components/fields/terms/multistep';
import Loader from '../../../utils/loader';

// Validation
import validate from './validateSecondPage';

export const fields = [
  'title',
  'author',
  'email',
  'organization',
  'tags',
  'format',
  'file',
  'embed',
  'duration',
  'link',
  'access',
  'targets',
  'techResources',
  'description',
  'exclusive',
  'isOnline',
  'isFile',
 // 'macro',
  'subjects',
  'domains',
  'subdominios',
  'hashtags',
  'years',
  'op_proposal',
  'accept_terms',
  'terms',
  'script_file'
];
// ^^ All fields on last form

export class NewResourceFormSecondPage extends Component {
  constructor(props) {
    super(props);
    console.log(props)

    //
    //  Set state
    //
    this.state = {
      isLoading: true,
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
    //  Event handlers
    //
    this.setTags = this.setTags.bind(this);
    this.setTargets = this.setTargets.bind(this);
    this.setScriptFile = this.setScriptFile.bind(this);
    this.backClick = this.backClick.bind(this);
    this.setDescription = this.setDescription.bind(this);

    //
    //  Renders
    //

    //
    //  Helpers
    //

  }

  componentDidMount() {
    scrollToTop();

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
          /*  case 'macro_areas_resources':
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
        buildState.isLoading = false;
        this.setState(buildState);   
      });
  }

  // On change TAGS
  setTags(tags) {
    this.props.change('tags', tags);
    console.log("tags",tags)
  }

  //  On description change
  setDescription(content){
    this.props.change('op_proposal', content);
  }

  // On change TARGETS
  setTargets(targets) {
    this.props.change('targets', targets);
  }

  // On file change
  setScriptFile(file) {
    this.props.change('script_file', file);
  }

  backClick() {
    this.props.mapProps.history.goBack();
  }

  render() {
    const {
      accept_terms,
      isFile,
      tags,
      submitFailed,
      invalid,
      handleSubmit,
      previousPage,
      submitting
    } = this.props;

    const { mapProps } = this.props;

    if (!mapProps.taxonomies.data) {
      return null;
    }

    if (typeof tags == 'string' || typeof tags == 'undefined') {
      return null;
    }
    return (
      <form onSubmit={handleSubmit} className="form second-page box-form">
        <button
          type="button"
          disabled={submitting}
          onClick={previousPage}
          className="cta primary outline m-b-30"
        >
          <i className="fa fa-chevron-left" aria-hidden="true" />
          Voltar
        </button>

        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <h1>Proposta de operacionalização</h1>
          </div>
        </div>


        {/* SUBJECTS, YEARS */}
        { this.state.isLoading ? <Loader title="A carregar por favor aguarde..." /> :
        <MultiStep
          change={this.props.change}
          years={this.props.years}
          subjects={this.props.subjects}
          domains={this.props.domains}
         // macro={this.props.macro}
          subdominios={this.props.subdominios}
          hashtags={this.props.hashtags}
          taxonomies={{
            subjects: this.state.subjects,
            domains: this.state.domains,
            years: this.state.years,
           // macro: this.state.macro,
            subdominios: this.state.subdominios,
            hashtags: this.state.hashtags
          
          }}
        />
        
        }

        {this.state.isLoading ? null :
        <div className="row">
          <div className="col-xs-12">
            <HelpPopover
              className="fa fa-question-circle form-help"
              id="tags_popover"
              placement="right"
              title="Insira pelo menos 5 palavras ou expressões. Utilize a vírgula, o ponto e vírgula ou a tecla ENTER para separar as palavras ou expressões. "
            />
            <label className="input-title">Outros Conceitos</label>
            <Field
              formGroupClassName="form-group"
              component={renderTagsInput}
              name="tags"
              childPos="top"
              placeholder="Outro conceito"
              footNote="Deve escrever algumas palavras ou expressões, no minimo de 5 palavras ou expressões."
              handleChange={this.setTags}
            />
          </div>
        </div>
  }
        {/* OPERATION PROPOSAL */}
        {this.state.isLoading ? null :
        <div className="row margin__bottom--15">
          <div className="col-xs-12">
            <label className="input-title required">Descrição da proposta de operacionalização</label>
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
        }
         {this.state.isLoading ? null :


        <div className="row">
          <div className="col-xs-12">
            <label className="input-title">Documentação de apoio</label>
            <Field
              controlType="input"
              type="text"
              className="form-control"
              formGroupClassName="form-group"
              handleChange={this.setScriptFile}
              component={renderFileInput}
              name="script_file"
              footNote={
                'Tamanho máximo de ficheiro é de ' +
                showFileSize(appConfig.maxScriptFileSize)
              }
            />
          </div>
        </div>
      
        }

        {/* TARGETS */}
        {this.state.isLoading ? null :
      
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
        }

        {/* TERMS AND CONDITIONS */}
    
        {this.state.isLoading ? null :
        mapProps.terms.data && <div className="row">
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

            <div className="terms-conditions">
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
       
      }

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
          {submitting && isFile == true && (
            <div className="alert alert-info" role="alert">
              <p>
                <i className="fa fa-spinner fa-spin" /> O seu ficheiro está a
                ser carregado...
              </p>
            </div>
          )}
          <button
            type="button"
            disabled={submitting}
            onClick={previousPage}
            className="cta primary outline"
          >
            <i className="fa fa-chevron-left" aria-hidden="true" />
            Voltar
          </button>
          <button type="submit" disabled={submitting} className="cta primary">
            {submitting ? <i className="fa fa-spinner fa-spin" /> : ''}{' '}
            {mapProps.resource.data && mapProps.resource.data.id
              ? 'Guardar alterações'
              : 'Submeter recurso'}
          </button>
          <a className="cta no-bg" onClick={this.backClick} role="link">
            Cancelar
          </a>
        </footer>
        
      </form>
      
 
      
    );
  }
}

NewResourceFormSecondPage.propTypes = {
  fields: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};

const selector = formValueSelector('newResource');

let SelectingFormValuesForm = reduxForm({
  form: 'newResource', // <------ same form name
  fields, // <------ only fields on this page
  destroyOnUnmount: false, // <------ preserve form data
  validate // <------ only validates the fields on this page
})(NewResourceFormSecondPage);


export default connect(state => ({
  initialValues: {
    subjects: [],
    //macro: [],
    domain: [],
    years: [],
    subdominios: [],
    hashtags: [],
    tags: [],
    targets: []
  },
  hasDomains: selector(state, 'hasDomains'),
  isFile: selector(state, 'isFile'),
  subjects: selector(state, 'subjects'),
  op_proposal: selector(state, 'op_proposal'),
  years: selector(state, 'years'),
  tags: selector(state, 'tags'),
  accept_terms: selector(state, 'accept_terms'),
  domains: selector(state, 'domains'),
  subdominios: selector(state, 'subdominios'),
  hashtags: selector(state, 'hashtags'),
 // macro: selector(state, 'macro'),
  script_file: selector(state, 'script_file'),
  terms: selector(state, 'terms'),
  targets: selector(state, 'targets')
}))(SelectingFormValuesForm);