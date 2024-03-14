'use strict'

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  reduxForm,
  Field,
  FieldArray,
  formValueSelector
} from 'redux-form';
import _ from 'lodash';

// Components
import renderFormControl from '#/components/fields/genericField';
import renderScripts from '#/components/fields/scripts/scriptsArray';

//  Utils
import {
  getRelated,
  toggleTermsVisibility,
} from '#/utils/termsRelationships';

// Validation
import validate from './validate';

export const fields = [
  'scripts[].id',
  'scripts[].title',
  'scripts[].description',
 // 'scripts[].macro',
  'scripts[].subjects',
  'scripts[].domains',
  'scripts[].subdominios',
  'scripts[].hashtags',
  'scripts[].years',
  'scripts[].file',
  'scripts[].op_proposal',
  'accept_terms',
  'scripts[].terms',
  'scripts[].tags',
  'scripts[].targets'
];
// ^^ All fields on last form

class NewScriptForm extends Component {
  constructor(props) {
    super(props);

    //
    //  Set state
    //
    this.state = {
      scripts: [],
      subjects: {
        terms: []
      },
      domains: {
        terms: []
      },
      subdominios: {
        terms: []
      },
      hashtags: {
        terms: []
      },
      years: {
        terms: []
      },
     /* macro: {
        terms: []
      },*/
      targets: {
        terms: []
      }
    };

    //
    //  Renders
    //

    //
    //  Event Handlers
    //
    this.removeEl = this.removeEl.bind(this);
    this.scrollToActions = this.scrollToActions.bind(this);
    this.addEl = this.addEl.bind(this);
    this.backClick = this.backClick.bind(this);

    //
    //  Helpers
    //
    this.updateState = this.updateState.bind(this);
    this.startTerms = this.startTerms.bind(this);
  }

  componentDidMount() {
    let buildState = _.cloneDeep(this.state);
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
          value: [
            'tags_resources',
            'formatos_resources',
            'modos_resources',
            'lang_resources'
          ]
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
            case 'anos_resources':
              buildState.years = {
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

        this.setState(buildState);
      });
  }

  componentDidUpdate(prevProps) {
    const { scripts } = this.props;

    if (prevProps.scripts && prevProps.scripts.length < scripts.length) {
      this.startTerms();
    }
  }

  startTerms() {
    const { scripts } = this.props;

    let buildState = _.cloneDeep(this.state.scripts);

    scripts.length > 0 &&
      scripts.map((script, idx) => {
        buildState[idx] = {};

        // Get relationships of active elements
        let active_rels = getRelated(
          (script.years || [])
           // .concat(script.macro || [])
            .concat(script.subjects || [])
            .concat(script.domains || [])
            .concat(script.subdominios || [])
            .concat(script.hashtags || [])
        , this.state);

        // Get visible terms in order to get those that are actually valid to submit
        let visible_terms = toggleTermsVisibility(active_rels, this.state).concat(
          script.years || []
        );

        // Get active terms in order to check those that are actually valid to submit
        let valid_terms = (script.subjects || [])
          //.concat(script.macro || [])
          .concat(script.years || [])
          .concat(script.domains || [])
          .concat(script.subdominios || [])
          .concat(script.hashtags || []);

        buildState[idx].active_rels = active_rels;
        buildState[idx].visible_terms = visible_terms;
        buildState[idx].valid_terms = valid_terms;
      });

    this.setState({ scripts: buildState });
  }

  scrollToActions() {
    var el = document.getElementById('form-actions');
    var total = el.offsetTop;
    window.scrollTo(0, total);
  }

  // Delete script
  removeEl(formScripts, index) {
    const { scripts, deleteScript } = this.props.mapProps;
    const { refreshScripts } = this.props;

    formScripts.remove(index);
    if (
      scripts.data.length > 0 &&
      scripts.data[index] &&
      scripts.data[index].id
    ) {
      deleteScript(scripts.data[index].id).then(() => refreshScripts());
    }
  }

  // Delete script
  addEl(formScripts) {
    formScripts.push({
      tags: [],
      years: [],
      //macro: [],
      subjects: [],
      domains: [],
      subdominios: [],
      hashtags: [],
      terms: [],
      targets: []
    });
  }

  updateState(tempState) {
    this.setState(tempState);
  }

  backClick() {
    this.props.mapProps.history.goBack();
  }

  render() {
    const {
      scripts,
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
        <header>
          <h1>Minhas propostas de operacionalização</h1>
          <p>
            Edite as suas propostas de operacionalização para este recurso,
            podendo sempre adicionar novas propostas através da opção{' '}
            <strong>Adicionar formulário de proposta</strong>.
          </p>
        </header>

        {!scripts ||
          (!scripts.length && (
            <div className="alert alert-warning">
              Contribua com uma nova proposta de operacionalização
            </div>
          ))}

        <FieldArray
          name="scripts"
          component={renderScripts}
          fullProps={this.props}
          parentState={{
            scripts: this.state.scripts,
            targets: this.state.targets
          }}
          taxonomies={{
            subjects: this.state.subjects,
            domains: this.state.domains,
            years: this.state.years,
           // macro: this.state.macro,
            subdominios: this.state.subdominios,
            hashtags: this.state.hashtags
          }}
          eventHandlers={{
            removeEl: this.removeEl,
            scrollToActions: this.scrollToActions,
            addEl: this.addEl,
            updateParentState: this.updateState
          }}
        />

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

        <footer className="form-buttons" id="form-actions">
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
            {submitting ? <i className="fa fa-spinner fa-spin" /> : ''} Guardar
            alterações
          </button>
          <a className="cta no-bg" onClick={this.backClick} role="link">
            Cancelar
          </a>
        </footer>
      </form>
    );
  }
}

NewScriptForm.propTypes = {
  fields: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};

const selector = formValueSelector('newScript');

let SelectingFormValuesForm = reduxForm({
  form: 'newScript', // <------ same form name
  fields, // <------ only fields on this page
  validate // <------ only validates the fields on this page
})(NewScriptForm);

export default connect(state => ({
  initialValues: {
    scripts: []
  },
  scripts: selector(state, 'scripts'),
  accept_terms: selector(state, 'accept_terms')
}))(SelectingFormValuesForm);
