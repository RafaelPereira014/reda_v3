'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';

//  Components
import renderDropdown from '#/components/fields/dropdownInput';
import renderFormControl from '#/components/fields/genericField';

// Validation
import validate from './validateTax';

export const fields = [ 
  'title',
  'type',
]


/**
 * FORM FIRST PAGE
 */
class NewTaxForm extends Component {
    constructor(props){
        super(props);

        //
        //  Set state
        //
        this.state = {
            firstRender: true
        }

        //
        //  Renders
        //
        this.renderTerms = this.renderTerms.bind(this);

        //
        //  Event handlers
        //
        this.onDropdownChange = this.onDropdownChange.bind(this);
    }

    async componentDidMount(){

    }

    //
    //  On parent dropdown change
    //
    onDropdownChange(evt){
        if (evt.target.value && evt.target.value.length>0){
            
            this.setState({
                term: {
                    ...this.state.term,
                    parent: evt.target.value
                }
            })
        }
    }

    renderTerms(){
        return (
            <div className="margin__bottom--15">
                <Field
                component={renderDropdown} 
                name="type"
                childPos="top"
                list={this.props.types.data}
                listValue="id"
                listTitle="title"
                startValue={this.props.type}
                defaultOption="---"
                disabled={this.props.taxonomy.data && this.props.taxonomy.data.locked ? "disabled" : null}>
                    <label className="input-title required">Tipo</label>
                </Field>

                {
                    this.props.taxonomy.data && this.props.taxonomy.data.locked && 
                    <div className="padding__top--10">
                        <small><i className="fas fa-lock padding__right--10"></i><em>Não é possível alterar o tipo, pois é uma taxonomia de sistema.</em></small>
                    </div>                    
                }
            </div>
        )
    }

    render() {
        const {
            invalid,
            handleSubmit,
            submitting,
            submitFailed,
            taxonomy,
            classes
        } = this.props;


        return (
            <form onSubmit={handleSubmit} className={"form" + (classes ? ` ${classes}` : '')}>
                {/* FIRST ROW */}
                <div className="row">
                    <div className="col-xs-12">
                        <label className="input-title required">Título</label>
                        <Field
                            controlType="input"
                            type="text"
                            className="form-control"
                            formGroupClassName="form-group"
                            placeholder="Título da taxonomia"
                            component={renderFormControl} 
                            name="title"/>
                    </div>          
                </div>
                
                {this.renderTerms()}

                {/* NEXT */}
                <footer className="form-buttons">
                <p><small><span className="text-danger">*</span> Campo obrigatório</small></p>
                {submitFailed && invalid && 
                        <div className="alert alert-danger" role="alert">
                        <p>Existem alguns problemas nos dados fornecidos. Reveja o formulário e os respetivos erros.</p>
                        </div>
                    }
                    <button type="submit" disabled={submitting} className="cta primary">
                    {submitting ? <i className='fa fa-spinner fa-spin'></i> : ""} {taxonomy.data && taxonomy.data.id ? "Guardar alterações" : "Criar taxonomia"}
                    </button>
                </footer>
            </form>
        )
    }
}

NewTaxForm.propTypes = {
  fields: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

const selector = formValueSelector('newTax');

let SelectingFormValuesForm = reduxForm({
  form: 'newTax',              // <------ same form name
  fields,                      // <------ only fields on this page
  destroyOnUnmount: false,
  validate                     // <------ only validates the fields on this page
})(NewTaxForm);

export default connect (
state => ({
  initialValues: {
  },
  title: selector(state, 'title'),
  type: selector(state, 'type'),
}))(SelectingFormValuesForm);
