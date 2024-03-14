import React, { Component, Fragment } from 'react';

//  Components
import {  Field } from 'redux-form';
import renderCheckboxGroup from '#/components/fields/checkboxGroupInput';

//  Utils
import {
  getRelated,
  toggleTermsVisibility,
  getDownRelated,
  getRelatedItems
} from '#/utils/termsRelationships';
import _ from 'lodash';

class MultiStepCheckboxs extends Component{
  constructor(props) {
    super(props);

    //
    //  Set state
    //
    this.state = {
      visible_terms: []
    };    

    //
    //  Event handlers
    //
    this.setMacro = this.setMacro.bind(this);
    this.setSubdominios = this.setSubdominios.bind(this);
    this.setHashtags = this.setHashtags.bind(this);

    this.setSubject = this.setSubject.bind(this);
    this.setDomains = this.setDomains.bind(this);
    this.setYears = this.setYears.bind(this);

    //
    //  Renders
    //
    this.renderMacro = this.renderMacro.bind(this);
    this.renderYears = this.renderYears.bind(this);
    this.renderSubdominios = this.renderSubdominios.bind(this);
    this.renderHashtags = this.renderHashtags.bind(this);
    this.renderSubjects = this.renderSubjects.bind(this);
    this.renderDomains = this.renderDomains.bind(this);

    //
    //  Helpers
    //
    this.startTerms = this.startTerms.bind(this);
    this.setTerms = this.setTerms.bind(this);
  }

  componentDidMount() {
    this.startTerms();
  }

  componentDidUpdate(prevProps) {
    

    const didUpdateSelected = 
      !_.isEqual(prevProps.years, this.props.years) || 
      !_.isEqual(prevProps.subjects, this.props.subjects) || 
      //!_.isEqual(prevProps.macro, this.props.macro) || 
      !_.isEqual(prevProps.subdominios, this.props.subdominios) || 
      !_.isEqual(prevProps.hashtags, this.props.hashtags) || 
      !_.isEqual(prevProps.domains, this.props.domains);

    const didUpdateTaxonomies = !_.isEqual(prevProps.taxonomies, this.props.taxonomies);

    if (didUpdateTaxonomies || didUpdateSelected) {
      this.startTerms();
    }
  }

  startTerms() {
    let buildState = this.state;
    

    // Get relationships of active elements
    let active_rels = getRelated(
      (this.props.years || [])
        .concat(this.props.macro || [])
        .concat(this.props.subjects || [])
        .concat(this.props.domains || [])
        .concat(this.props.subdominios || [])
        .concat(this.props.hashtags || [])
      , this.props.taxonomies);
    // Get visible terms in order to get those that are actually valid to submit
    let visible_terms = toggleTermsVisibility(active_rels, this.props.taxonomies).concat(
      this.props.macro || []
    );

    // Get active terms in order to check those that are actually valid to submit
    let valid_terms = (this.props.subjects || [])
      .concat(this.props.years || [])
      .concat(this.props.macro || [])
      .concat(this.props.domains || [])
      .concat(this.props.subdominios || [])
      .concat(this.props.hashtags || []);

    buildState.active_rels = active_rels;
    buildState.visible_terms = visible_terms;
    buildState.valid_terms = valid_terms;

    this.setState(buildState);
  }

  // On change MACRO
  setMacro(group) {
    const { uniqEl } = this.props;

    let activeTerms = (this.props.subjects || [])
      .concat(this.props.years || [])
      .concat(this.props.domains || [])
      .concat(this.props.subdominios || [])
      .concat(this.props.hashtags || [])
      .concat(group || []);

    this.props.change(uniqEl ? `${uniqEl}.macro` : "macro", group);

    this.setTerms(activeTerms, group);
    
  }

  // On change YEARS
  setYears(group) {
    const { uniqEl } = this.props;

    // Get active terms in order to check those that are actually valid to submit
    let activeTerms = (this.props.subjects || [])
      .concat(this.props.subdominios || [])
      .concat(this.props.hashtags || [])
      .concat(this.props.macro || [])
      .concat(this.props.domains || [])
      .concat(group || []);

    this.props.change(uniqEl ? `${uniqEl}.years` : "years", group);

    this.setTerms(activeTerms, this.props.macro || []);
  }

  // On change SUBJECTS
  setSubject(group) {
    const { uniqEl } = this.props;

    let activeTerms = (this.props.years || [])
      .concat(this.props.subdominios || [])
      .concat(this.props.hashtags || [])
      .concat(this.props.macro || [])
      .concat(this.props.domains || [])
      .concat(group || []);

    this.props.change(uniqEl ? `${uniqEl}.subjects` : "subjects", group);
    
    this.setTerms(activeTerms, this.props.macro || []);
  }

  // On change DOMAINS
  setDomains(group) {
    const { uniqEl } = this.props;

    let activeTerms = (this.props.subjects || [])
      .concat(this.props.subdominios || [])
      .concat(this.props.hashtags || [])
      .concat(this.props.macro || [])
      .concat(this.props.years || [])
      .concat(group || []);

    this.props.change(uniqEl ? `${uniqEl}.domains` : "domains", group);
  
    this.setTerms(activeTerms, this.props.macro || []);
  }



  setSubdominios(group) {
    const { uniqEl } = this.props;

    let activeTerms = (this.props.subjects || [])
      .concat(this.props.hashtags || [])
      .concat(this.props.domains || [])
      .concat(this.props.macro || [])
      .concat(this.props.years || [])
      .concat(group || []);

    this.props.change(uniqEl ? `${uniqEl}.subdominios` : "subdominios", group);
  
    this.setTerms(activeTerms, this.props.macro || []);
  }


  setHashtags(group) {
    const { uniqEl } = this.props;

    let activeTerms = (this.props.subjects || [])
      .concat(this.props.domains || [])
      .concat(this.props.subdominios || [])
      .concat(this.props.macro || [])
      .concat(this.props.years || [])
      .concat(group || []);

    this.props.change(uniqEl ? `${uniqEl}.hashtags` : "hashtags", group);
  
    this.setTerms(activeTerms, this.props.macro || []);
  }


  setTerms(activeTerms, group){
    const { uniqEl } = this.props;
    let relatedItems = getRelatedItems(activeTerms, group, this.props.taxonomies);

    this.setState({
      active_rels: relatedItems.active_rels,
      visible_terms: relatedItems.visible_terms,
      valid_terms: relatedItems.valid_terms
    });

    this.props.change(uniqEl ? `${uniqEl}.terms` : "terms", relatedItems.valid_terms);
  }

  // Render macros from years
  renderMacro() {
    const { macro } = this.props.taxonomies;
    const { uniqEl } = this.props;

    if (macro && macro.terms && macro.terms.length > 0) {
      return (
        <div className="row macro__selection">
          <div className="col-xs-12">
            <label className="input-title required">MacroÃ¡reas</label>
            <Field
              handleOnChange={this.setMacro}
              name={uniqEl ? `${uniqEl}.macro` : "macro"}
              list={macro.terms}
              formGroupClassName="form-group"
              component={renderCheckboxGroup}
              customCheckbox={true}
              cols={{
                xs: 12,
              }}
            />
          </div>
        </div>
      );
    }

    return null;
  }

  // Render years from macros
  renderYears() {
    const { years } = this.props.taxonomies;
    const { uniqEl } = this.props;

    const list = getDownRelated(years.terms, years.topRelLevel, this.state.active_rels);
    /* console.log(this.state.active_rels); */
    if (list && list.length > 0) {
      return (
        <div className="row years__selection">
          <div className="col-xs-12">
            <label className="input-title required">Anos de escolaridade</label>
            <Field
              handleOnChange={this.setYears}
              name={uniqEl ? `${uniqEl}.years` : "years"}
              list={list}
              formGroupClassName="form-group"
              component={renderCheckboxGroup}
              isYears={true}
              customCheckbox={true}
            />
          </div>
        </div>
      );
    }

    return null;
  }

  // Render subjects from macros
  renderSubjects() {
    const { subjects } = this.props.taxonomies;
    const { uniqEl } = this.props;

    const list = getDownRelated(subjects.terms, subjects.topRelLevel, this.state.active_rels);

    if (list && list.length > 0) {
      return (
        <div className="row subjects__selection">
          
          <div className="col-xs-12">
          <hr/>
            <label className="input-title required">Disciplinas</label>
            <Field
              handleOnChange={this.setSubject}
              name={uniqEl ? `${uniqEl}.subjects` : "subjects"}
              list={list}
              formGroupClassName="form-group"
              component={renderCheckboxGroup}
              customCheckbox={true}
            />
          </div>
        </div>
      );
    }

    return null;
  }

  // Render domains by subjects
  renderDomains() {
    const { domains } = this.props.taxonomies;
    const { uniqEl } = this.props;

    const list = getDownRelated(domains.terms, domains.topRelLevel, this.state.active_rels);

    if (list && list.length > 0) {
      return (
        <div className="row domains__selection">
         
          <div className="col-xs-12">
          <hr/>
            <label className="input-title required">Domínios</label>
            <Field
              handleOnChange={this.setDomains}
              name={uniqEl ? `${uniqEl}.domains` : "domains"}
              list={list}
              formGroupClassName="form-group"
              component={renderCheckboxGroup}
              customCheckbox={true}
            />
          </div>
        </div>
      );
    }

    return null;
  }

  renderSubdominios() {
    const { subdominios } = this.props.taxonomies;
    const { uniqEl } = this.props;

    const list = getDownRelated(subdominios.terms, subdominios.topRelLevel, this.state.active_rels);

    if (list && list.length > 0) {
      return (
        <div className="row subdominios__selection">
  
          <div className="col-xs-12">
          <hr/>
            <label className="input-title">subdomínios</label>
            <Field
              handleOnChange={this.setSubdominios}
              name={uniqEl ? `${uniqEl}.subdominios` : "subdominios"}
              list={list}
              formGroupClassName="form-group"
              component={renderCheckboxGroup}
              customCheckbox={true}
            />
          </div>
        </div>
      );
    }

    return null;

  }

  renderHashtags() {
    const { hashtags } = this.props.taxonomies;
    const { uniqEl } = this.props;

    const list = getDownRelated(hashtags.terms, hashtags.topRelLevel, this.state.active_rels);

    if (list && list.length > 0) {
      return (

        <div className="row hashtags__selection">
         
          <div className="col-xs-12">
          <hr/>
            <label className="input-title">Conceitos</label>
            <Field
              handleOnChange={this.setHashtags}
              name={uniqEl ? `${uniqEl}.hashtags` : "hashtags"}
              list={list}
              formGroupClassName="form-group"
              component={renderCheckboxGroup}
              customCheckbox={true}
            />
          </div>
        </div>
      );
    }

    return null;

  }


  render() {
    const { taxonomies } = this.props;

    if(!taxonomies || taxonomies.length==0){
      return null;
    }

    return (
      <Fragment>
          
          {this.renderYears()}
          {this.renderSubjects()}
          {this.renderDomains()}
          {this.renderSubdominios()}
          {this.renderHashtags()}

      </Fragment>
    )
  }
  
}

export default MultiStepCheckboxs;
