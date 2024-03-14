import React, { Component, Fragment } from 'react';

//  Utils
import { scrollToTop } from '#/utils';

// Alerts
import * as alertMessages from '#/actions/message-types';

//  Components
import TaxForm from '%/containers/taxonomies/details/forms/form';
import TermsList from '%/containers/taxonomies/details/termsList';
import TermsForm from '%/containers/taxonomies/details/forms/newTerm';

// Error handlers
import ErrorBoundary from '#/components/error/boundary';

export default class TaxonomyDetails extends Component{
    _isMounted = false;
    constructor(props){
        super(props);

        this.resetState = {
            update: false,
            curEdit: null
        }

        this.state = this.resetState;

        //
        //  Handlers
        //
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onTermToEdit = this.onTermToEdit.bind(this);
    }

    
    async componentDidMount() {
        scrollToTop();
        this._isMounted = true;       
        if (this.props.match.params.slug){
            await this.props.fetchTaxonomy(this.props.match.params.slug);       
        }        

        await this.props.fetchTypes();
    }

    componentWillUnmount(){
        this.props.resetTaxonomy();
        this._isMounted = false;
    }


    onTermToEdit(el){
        this.setState({
            curEdit: el
        })
    }
    

    //
    //  Handle tax form submition
    //
    async handleSubmit(values){
        const { slug } = this.props.match.params;

        // MAKE SUBMITION
        return new Promise(async (resolve, reject) => {
            try{
                await this.props.submitTaxonomy(values, slug);

                const { errorMessage, errorStatus } = this.props.taxonomy;

                // Dispatch errors to form if any
                if ((errorMessage || errorStatus) && errorMessage.form_errors){
                    reject(errorMessage.form_errors);
                    this.props.addAlert(alertMessages.ALERT_TAXONOMY_ADD_ERROR, alertMessages.ERROR);

                }else if (errorMessage || errorStatus){
                    reject();
                    this.props.addAlert(alertMessages.ALERT_SERVER_ERROR, alertMessages.ERROR);

                }else{       
                    let message = !slug ? alertMessages.ALERT_TAXONOMY_CREATE_SUCCESS : alertMessages.ALERT_TAXONOMY_EDIT_SUCCESS

                    resolve();  
                    this.props.addAlert(message, alertMessages.SUCCESS);
                    

                    //  Redirect only if new
                    if(!slug){
                        this.props.resetTaxonomy();
                        this.props.history.push('/dashboard/taxonomias');
                    }
                }

            }catch(error){
                reject(error);
                this.props.addAlert(error, alertMessages.ERROR);
            }

        })
    }

    render() {
        const { taxonomy, types } = this.props;
        const { slug } = this.props.match.params;

        if((slug && (!taxonomy.data || taxonomy.data.length==0)) || !types.data){
            return null;
        }

        return (
            <Fragment>
                <div className="container-fluid">
                    {slug ?
                        <h1>Editar taxonomia: <strong>{taxonomy.data.title}</strong></h1>
                        :
                        <h1>Criar nova taxonomia</h1>
                    }

                    <div className="row margin__top--35">
                        <div className="col-xs-12 col-md-4">                            
                            <ErrorBoundary>
                                <TaxForm
                                    onSubmit={this.handleSubmit}
                                    {...this.props}/>
                            </ErrorBoundary>
                            <hr/>
                            <ErrorBoundary>
                                <TermsForm 
                                    {...this.props}
                                    curEdit={this.state.curEdit}
                                    selectedTermToEdit={this.onTermToEdit}/>
                            </ErrorBoundary>
                        </div>

                        {slug && 
                            <div className="col-xs-12 col-sm-8">
                                <ErrorBoundary>
                                    <h2 className="margin__bottom--20" style={{marginTop: 0}}>Lista de termos</h2>
                                    <TermsList
                                        selectedTermToEdit={this.onTermToEdit}
                                        />
                                </ErrorBoundary>
                            </div>
                        }
                    </div>
                </div>
            </Fragment>
        );
    }
    
}