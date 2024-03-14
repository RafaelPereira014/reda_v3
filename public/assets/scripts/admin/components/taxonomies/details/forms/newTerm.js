import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';

import appConfig from '#/config';

// Utils
import { scrollToTop, showFileSize } from '#/utils';


//  Components
import renderFormControl from '#/components/fields/genericField';
import renderColorPickerControl from '#/components/fields/colorPicker';
import Dropdown from '#/components/common/dropdown';
import renderFileInput from '#/components/fields/fileInput';
import SvgComponent from '#/components/common/svg';

// Validation
import validate from './validateTerm';

// added id
export const fields = [
    'id',
    'slug',
    'title',
    'parent',
    'color',
    'icon',
    'image'
]


class NewTermForm extends Component{
    _isMounted = false;
    constructor(props) {
        super(props);
        
        this.initialState = {
            update: false
        }

        this.state = this.initialState;

        //
        //  Renders
        //
        this.printForm = this.printForm.bind(this);

        //
        //  Handlers
        // 
        this.clearEdit = this.clearEdit.bind(this);
        this.onDropdownChange = this.onDropdownChange.bind(this);
        this.setImage = this.setImage.bind(this);

        //
        //  Helpers
        //
    }

    
    async componentDidMount() {
        this._isMounted = true;
        const { taxonomy } = this.props;
        this.props.fetchConfig(); 

        //  If accepts hierarchy, get all terms
        if(this._isMounted && taxonomy.data && taxonomy.data.hierarchical){
            this.props.fetchAllTaxTerms(taxonomy.data.slug);  
                     
        }

        scrollToTop();
    }
    

    componentDidUpdate(prevProps) {
        //  Set values to edit term or create new one
        console.log(this.props);
        if(prevProps.curEdit!==this.props.curEdit){
            this.props.change('id', this.props.curEdit ? this.props.curEdit.id : this.props.initialValues.id)
            this.props.change('slug', this.props.curEdit ? this.props.curEdit.slug : this.props.initialValues.slug)
            this.props.change('title', this.props.curEdit ? this.props.curEdit.title : this.props.initialValues.title)
            this.props.change('parent', this.props.curEdit && this.props.curEdit.parent_id ? this.props.curEdit.parent_id : this.props.initialValues.parent)
            this.props.change('color', this.props.curEdit && this.props.curEdit.color ? this.props.curEdit.color : this.props.initialValues.color)
            this.props.change('icon', this.props.curEdit && this.props.curEdit.icon ? this.props.curEdit.icon : this.props.initialValues.icon)
            this.props.change('image', this.props.curEdit && this.props.curEdit.Image ? this.props.curEdit.Image : this.props.initialValues.Image)
      
        }
    }

    
    componentWillUnmount() {
        this._isMounted = false;
    }

    //
    //  On parent dropdown change
    //
    onDropdownChange(evt){
        if (evt.target.value && evt.target.value.length>0){
            
            this.props.change('parent', evt.target.value);
        }
    }

    // On change image
    setImage(file){
        this.props.change('image', file);
    }

    //
    //  Stop editing
    //
    clearEdit(){
        this.props.resetForm();
        this.props.selectedTermToEdit(null);
    }

    //
    //  Show form to add new term or edit one
    //
    printForm(){
        const { allTaxTerms, taxonomy } = this.props;
        const terms = allTaxTerms && allTaxTerms.data ? allTaxTerms.data : [];

        const {
            invalid,
            submitting,
            submitFailed,
            image,
            config,
            curEdit
        } = this.props;

        let imageUrl = null;

        if(curEdit && (image && (image.fullResult || (config && config.data)))){
            imageUrl = image.fullResult || (curEdit && curEdit.slug ? config.data.files+"/terms/"+curEdit.slug+"/"+image.name+"."+image.extension : null);
        }
        
        return (
            <Fragment>   
                
                {
                    this.props.curEdit ?
                        <Fragment>
                            <h2 className="margin__bottom--30">Editar termo: <em><strong>{this.props.curEdit.title}</strong></em></h2>
                            {/* <div className="margin__topbottom--10">
                                <i className="fas fa-info-circle padding__right--10"></i> 
                                <small>
                                    Está a editar o termo <em><strong>{this.props.curEdit.title}</strong></em>
                                </small>
                            </div> */}
                        </Fragment>
                    :
                        <h2 className="margin__bottom--30">Adicionar novo Termo</h2>
                }

                { /* Title */}
                <div className="form-group">            
                    <Field
                    controlType="input"
                    type="text"
                    className="form-control" 
                    placeholder="Nome do termo"
                    component={renderFormControl} 
                    name="title"
                    childPos="top">
                        <label className="input-title required">Título</label>
                    </Field>
                </div>                    

                { /* Parent term */}
                {terms.length>0 && taxonomy.data.hierarchical && 
                    <div className="form-group margin__bottom--15">
                        <label className="input-title">Termo superior</label>
                        <Dropdown
                            list={terms}
                            listValue="id"
                            listTitle="title"
                            startValue={this.props.parent || ""}
                            onChange={this.onDropdownChange}
                            defaultOption="---"
                        />
                    </div>
                }

                { /* Icon */}
                <div className="form-group">            
                    <Field
                    controlType="input"
                    type="text"
                    className="form-control" 
                    placeholder="e.g. save"
                    component={renderFormControl} 
                    name="icon"
                    childPos="top">
                        <label className="input-title">Ícone</label>
                        <div className="margin__bottom--10">
                            <em>(Verificar <a href="https://fontawesome.com/icons" target="_blank" rel="noopener noreferrer">https://fontawesome.com/icons</a>)</em>
                        </div>
                    </Field>
                </div>

                { /* Color */}
                <div className="form-group">            
                    <Field
                    className="form-control" 
                    placeholder="e.g. #ff0022"
                    component={renderColorPickerControl} 
                    name="color"
                    changeField={this.props.change}
                    childPos="top">
                        <label className="input-title">Cor</label>
                    </Field>
                </div>  

                {/* Image */}
                <div className="row">
                    <div className="col-xs-12">
                        <label className="input-title">Imagem</label>
                        <Field
                        controlType="input"
                        type="text"
                        className="form-control"
                        formGroupClassName="form-group"
                        handleChange={this.setImage}
                        component={renderFileInput} 
                        name="image"
                        footNote={"Tamanho máximo de ficheiro é de "+showFileSize(appConfig.maxThumbFileSize)}/> 

                        {((image && image.id) || (image && image.data)) && !image.error && image &&  <div className="row">
                        <div className="image-preview">
                            {image.extension == 'svg' ?
                                <SvgComponent element={imageUrl} color={this.props.color ? this.props.color : "#6a696a"} style={{maxHeight: "300px"}}/>
                            :
                                <img className="img-responsive" src={imageUrl} />
                            }
                            
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
                        {submitting ? <i className='fa fa-spinner fa-spin'></i> : ""} {this.props.curEdit && this.props.curEdit.id ? "Guardar termo" : "Criar termo"}
                    </button>
                    <button type="button" className="cta no-bg" onClick={this.clearEdit}>
                        Limpar
                    </button>
                </footer>
            </Fragment>
        )
    }

    render() {
        const {
            classes,
            handleSubmit
        } = this.props;

        return (
            <form onSubmit={handleSubmit} className={"form" + (classes ? ` ${classes}` : '')}>
                {this.printForm()}
            </form>
        );
    }
}

NewTermForm.propTypes = {
    fields: PropTypes.array.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }
  
  const selector = formValueSelector('newTermForm');
  
  let SelectingFormValuesForm = reduxForm({
    form: 'newTermForm',              // <------ same form name
    fields,                      // <------ only fields on this page
    destroyOnUnmount: false,
    validate,                     // <------ only validates the fields on this page
  })(NewTermForm);
  
  export default connect (
  state => ({
    initialValues: {
        id: null,
        slug: null,
        title: "",
        parent: "",
        color: null,
        icon: null
    },
    id: selector(state, 'id'),
    slug: selector(state, 'slug'),
    title: selector(state, 'title'),
    parent: selector(state, 'parent'),
    color: selector(state, 'color'),
    icon: selector(state, 'icon'),
    image: selector(state, 'image')
  }))(SelectingFormValuesForm);
  