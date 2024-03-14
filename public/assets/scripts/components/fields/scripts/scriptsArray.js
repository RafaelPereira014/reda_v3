import React, { Component } from 'react';
import { Field } from 'redux-form';

import appConfig from '#/config';

// Utils
import { showFileSize } from '#/utils';
import {
  getDownRelated,
  getRelatedItems
} from '#/utils/termsRelationships';

// Components
import Collapsible from '#/components/common/collapse';

import renderCheckboxGroup from '#/components/fields/checkboxGroupInput';
import renderTinyMCE from '#/components/fields/tinyMCE';
import renderFileInput from '#/components/fields/fileInput';
import renderTagsInput from '#/components/fields/resourceTagsInput';
import HelpPopover from '#/components/common/helpPopover';
import MultiStep from '#/components/fields/terms/multistep';

export default class ScriptsArrayComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scripts: []
    };

    //
    //  Helpers
    //
    this.onTermsChange = this.onTermsChange.bind(this);

    //
    //  Renders
    //
  }

  // On change FILE
  setFile(script, file) {
    this.props.fullProps.change(`${script}.file`, file);
  }

  // On change TAGS
  setTags(script, tags) {
    this.props.fullProps.change(`${script}.tags`, tags);
  }

  // On change TAGS
  setDescription(script, content) {
    this.props.fullProps.change(`${script}.op_proposal`, content);
  }

  // On targets change
  setTargets(script, index, targets) {
    this.props.fullProps.change(`${script}.targets`, targets);
  }

  onTermsChange(dataId, group){
    this.props.fullProps.change(dataId, group);
  }

  render() {
    const {
      parentState,
      eventHandlers,
      fields: scripts
    } = this.props;

    return (
      <div className="scripts__list">
        {this.props.parentState.scripts.length>0 || scripts.length>0 ? scripts.map((script, index) => (
          <div key={index}>
            <Collapsible
              title={'Proposta ' + (index + 2)}
              className="cta primary script__form--collapsible"
              iconOpen="fa fa-chevron-up"
              iconClosed="fa fa-chevron-down"
              isOpen={true}
              continueAction={() => eventHandlers.removeEl(scripts, index)}
              deleteIcon="fa fa-trash-o"
            >
              {/* META */}
              <section>
                <div className="row">
                  <div className="col-xs-12 col-sm-6 script__form--title">
                    <h1>Metadados</h1>
                  </div>
                </div>

                {/* SUBJECTS, YEARS AND LANGUAGES */}
                {/* SUBJECTS, YEARS, ... */}
                <MultiStep
                  change={this.onTermsChange}
                  uniqEl={script}
                  years={this.props.fullProps.scripts[index].years}
                  subjects={this.props.fullProps.scripts[index].subjects}
                  domains={this.props.fullProps.scripts[index].domains}
                  //macro={this.props.fullProps.scripts[index].macro}
                  subdominios={this.props.fullProps.scripts[index].subdominios}
                  hashtags={this.props.fullProps.scripts[index].hashtags}
                  taxonomies={{
                    subjects: this.props.taxonomies.subjects,
                    domains: this.props.taxonomies.domains,
                    years: this.props.taxonomies.years,
                   // macro: this.props.taxonomies.macro,
                    subdominios: this.props.taxonomies.subdominios,
                    hashtags: this.props.taxonomies.hashtags
                  }}
                />
                
                {/* TAGS */}
                <div className="row">
                  <div className="col-xs-12">
                    <HelpPopover
                      className="fa fa-question-circle form-help"
                      id="tags_popover"
                      placement="right"
                      title="Insira entre 5 a 10 palavras ou expressões. Utilize a vírgula, o ponto e vírgula ou a tecla ENTER para separar as palavras ou expressões. "
                    />
                    <label className="input-title required">
                      Palavras-chave
                    </label>
                    <Field
                      formGroupClassName="form-group"
                      component={renderTagsInput}
                      name={`${script}.tags`}
                      childPos="top"
                      placeholder="Palavras-chave"
                      footNote="Deve escrever algumas palavras ou expressões, no minimo de 5 palavras ou expressões."
                      handleChange={this.setTags.bind(this, script)}
                    />
                  </div>
                </div>


                {
                  // OPERATION PROPOSAL
                }
                <div className="row margin__bottom--15">
                  <div className="col-xs-12">
                    <label className="input-title required">
                      Descrição da proposta de operacionalização
                    </label>
                    <Field
                      className="form-control" 
                      placeholder="Indique como este recurso pode ser utilizado/operacionalizado"
                      component={renderTinyMCE} 
                      handleChange={this.setDescription.bind(this, script)}
                      name={`${script}.op_proposal`}
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
                      handleChange={this.setFile.bind(this, script)}
                      component={renderFileInput}
                      name={`${script}.file`}
                      footNote={
                        'Tamanho máximo de ficheiro é de ' +
                        showFileSize(appConfig.maxFileSize)
                      }
                    />
                  </div>
                </div>

                {/* TARGETS */}
                <div className="row">
                  <div className="col-xs-12">
                    <label className="input-title required">
                      Destinatários
                    </label>
                    <Field
                      handleOnChange={this.setTargets.bind(this, script, index)}
                      name={`${script}.targets`}
                      list={parentState.targets.terms}
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
              </section>
            </Collapsible>
          </div>
        ))
        :
        null
        }

        {scripts && scripts.length > 0 && (
          <button
            type="button"
            className="cta primary outline"
            onClick={eventHandlers.scrollToActions}
          >
            Finalizar
          </button>
        )}
        {/* ADD MORE*/}
        <button
          type="button"
          className="cta warning more-script margin__left--15"
          onClick={() => eventHandlers.addEl(scripts)}
        >
          Adicionar formulário de proposta
        </button>
      </div>
    );
  }
}
