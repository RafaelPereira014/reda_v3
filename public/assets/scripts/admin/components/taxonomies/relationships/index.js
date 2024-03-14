import React, { Component, Fragment } from 'react';
import _ from 'lodash';

//  Utils
import { setQueryString, parseQS } from '#/utils/history';
import { scrollToTop } from '#/utils';

// Alerts
import * as alertMessages from '#/actions/message-types';

//  Components
import List from '%/components/taxonomies/relationships/list';
import LimitFilter from '%/components/common/filters/limit';

// Error handlers
import ErrorBoundary from '#/components/error/boundary';
import Loader from '../../../../utils/loader';

export default class TermsRelsList extends Component{
    _isMounted = false;
    constructor(props){
        super(props);

        this.resetState = {
            activePage: 1,
            limit: 10,
            update: false,
            rels: [],
            dropdownLists: {},
            editing: [],
            startingValues: [],
            filters: {}
        }

        this.state = this.resetState;

        //
        //  Handlers
        //
        this.onActivateEdit = this.onActivateEdit.bind(this);
        this.submitRow = this.submitRow.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onLimitChange = this.onLimitChange.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);

        //
        //  Helpers
        //
        this.requestNewData = this.requestNewData.bind(this);        
        this.addRow = this.addRow.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.onDropdownChange = this.onDropdownChange.bind(this);
        this.resetStartingValues = this.resetStartingValues.bind(this);
        this.clearFilters = this.clearFilters.bind(this);

        /*
            resetTermsRels
            fetchTermsRels
            deleteTermsRel
            submitTermsRel
        */
    }

    
    async componentDidMount() {
        this._isMounted = true;

        if(this._isMounted){
            scrollToTop();
           
           await this.props.fetchTaxonomies([
               {
                   key: 'include',
                   value: [
                       'anos_resources',
                       //'macro_areas_resources',
                       'areas_resources',
                       'dominios_resources',
                       'subdominios',
                       'hashtags',
                   ]
               },
               {
                   key: "terms",
                   value: true
               }
           ], false);
           this.setState(
                {
                    dropdownLists: {
                        //macro: this.props.taxonomies.data.find(tax => tax.slug === 'macro_areas_resources').Terms,
                        years: this.props.taxonomies.data.find(tax => tax.slug === 'anos_resources').Terms,
                        areas: this.props.taxonomies.data.find(tax => tax.slug === 'areas_resources').Terms,
                        domains: this.props.taxonomies.data.find(tax => tax.slug === 'dominios_resources').Terms,
                        subdominios: this.props.taxonomies.data.find(tax => tax.slug === 'subdominios').Terms,
                        hashtags: this.props.taxonomies.data.find(tax => tax.slug === 'hashtags').Terms,

                    }
                }
            );
        }

        let initialData = {
            activePage: this.state.activePage,
            limit: this.state.limit
        };

         // Has queryString?
		if (this.props.location && this.props.location.search && !_.isEmpty(this.props.location.search)){
			const query = parseQS(this.props.location.search);

            const { pagina } = query;
            
            initialData = {
                ...initialData,
                activePage: parseInt(pagina) || initialData.activePage,
                limit: (query && query.limite && parseInt(query.limite)) || initialData.limit,
                filters: {
                   // macros: (query && query.macros) || null,
                    years: (query && query.anos) || null,
                    areas: (query && query.areas) || null,
                    domains: (query && query.dominios) || null,
                    subdominios: (query && query.subdominios) || null,
                    hashtags: (query && query.hashtags) || null
                },
            };
        }

        if(this._isMounted){
            await this.requestNewData(false, initialData);
            this.setState(initialData);
            setQueryString(initialData, {history: this.props.history}, this.props.location);
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
        this.props.resetTermsRels();
        this.props.resetTaxonomies();
    }

    
    componentDidUpdate() {
        if(this.state.update){
            this.requestNewData();
            this.setState({update: false});

            setQueryString(this.state, {history: this.props.history}, this.props.location);
        }
    }

    //  Get new data
    async requestNewData(reset = false, state = null){
        let tempState = state || this.state;

        let initialData = {
            activePage: tempState.activePage,
            limit: tempState.limit,
            filters: tempState.filters
        }

        //Reset page?
		if (reset){
			initialData = {
                activePage: this.resetState.activePage,
                limit: this.resetState.limit,
                filters: this.resetState.filters
            };

            this.setState(initialData);
		}

        await this.props.fetchTermsRels(initialData);
    }

    //  Reset all currently editing fields to starting values
    async resetStartingValues(avoidIdx = null){
        this.state.startingValues.map(startingValue => {
            const rowIdx = this.props.termsRels.data.findIndex((el) => el.id===startingValue.id);

            //  Avoid changing this item if this was changed already
            if(avoidIdx!==rowIdx){
                //  Set starting values to initial
                this.props.changeRel(startingValue, rowIdx);
            }
        });

        this.setState({
            startingValues: [],
            editing: []
        });
    }

    //  Update page
    onPageChange(page){
        this.setState({
            activePage: page,
            update: true,
            editing: [],
            startingValues: []
        })
    }

    //  Update limit
    onLimitChange(limit){
        this.setState({
            activePage: 1,
            limit,
            update: true,
            editing: [],
            startingValues: []
        })
    }

    //  Add rel row
    addRow(){
        

        this.resetStartingValues();

        this.props.addRelTermRow();        
    }

    //  Add rel row
    deleteRow(idxToDelete){

        this.resetStartingValues();

        let relToDelete = this.props.termsRels.data.find((el, idx) => idx===idxToDelete);

        this.props.deleteRelTermRow(idxToDelete, relToDelete ? relToDelete.id : null);
    }

    //  On dropdown change
    onDropdownChange(evt, level, rowIdx){

        const editedRel = this.props.termsRels.data.find((el, listIdx) => listIdx===rowIdx);

        if (evt.target.value && evt.target.value.length>0){
            this.props.changeRelTerm(parseInt(evt.target.value), level, rowIdx, editedRel ? editedRel.id : null);
        }
    }

    //  On filter change
    onFilterChange(evt, level, rowIdx, meta){
        if(meta && meta.type){
            this.setState({
                filters: {
                    ...this.state.filters,
                    [meta.type]: parseInt(evt.target.value)
                },
                update: true,
                activePage: 1
            })
        }
    }

    //  Clear filters
    clearFilters(){
        this.setState(() => ({
            filters: {},
            update: true,
            activePage: 1
        }))
    }

    //  Active editing of specific row
    onActivateEdit(evt){
        const rowIdx = parseInt(evt.currentTarget.getAttribute('data-rel'));
        const exists = this.state.editing.some(idx => idx === rowIdx);

        let finalList = [];
        let startingValues = [];

        const relData = this.props.termsRels.data.find((el, listIdx) => listIdx===rowIdx);

        //  Remove from list if already exists
        //  Disable editing
        if(exists){
            finalList = this.state.editing.filter(curEl => curEl!==rowIdx);
            
            //  Get initial data to reset
            const resetdata = this.state.startingValues.find(curEl => curEl.id===relData.id);

            //  Remove current rel from starting values
            startingValues = this.state.startingValues.filter(curEl => curEl.id!==relData.id);
            
            //  Set starting values to initial
            this.props.changeRel(resetdata, rowIdx);

        //  If doesn't exist, add to final array
        //  Enable editing
        }else{
            //  Add current row index to editing list
            finalList = [
                ...this.state.editing,
                rowIdx
            ];

            //  Add initial values of row in case of cancelation
            startingValues = [
                ...this.state.startingValues,
                relData
            ];
        }

        this.setState({
            editing: finalList,
            startingValues
        });
    }

    //  Submit row values
    async submitRow(rowIdx){
        const editedRel = this.props.termsRels.data.find((el, listIdx) => listIdx===rowIdx);

        if(Object.entries(editedRel).length === 0 && editedRel.constructor === Object){
            this.props.addAlert(
                alertMessages.TAX_RELS_NO_DATA_CREATE,
                alertMessages.ERROR
              );

        }else{
            return new Promise((resolve, reject) => {
                return this.props.submitRelChanges(editedRel, editedRel ? editedRel.id : null, rowIdx)
                .then(() => {

                    const { errorMessage, errorStatus } = this.props.termsRels;

                    // Dispatch errors to form if any
                    if ((errorMessage || errorStatus) && errorMessage.form_errors) {
                        reject(errorMessage.form_errors);
                        this.props.addAlert(
                        alertMessages.ALERT_REL_ADD_ERROR,
                        alertMessages.ERROR
                        );
                    } else if (errorMessage || errorStatus) {
                        reject(errorMessage || errorStatus);
                        this.props.addAlert(
                            alertMessages.ALERT_SERVER_ERROR,
                            alertMessages.ERROR
                        );
                    } else {
                        resolve();

                        let message = !editedRel.id
                        ? alertMessages.ALERT_REL_CREATE_SUCCESS
                        : alertMessages.ALERT_REL_EDIT_SUCCESS
                        
                        this.props.addAlert(message, alertMessages.SUCCESS);

                        this.setState({
                            editing: []
                        });

                        this.resetStartingValues(rowIdx);
                    }
                });
                
            });
        }
    }
    
    
    render() {
        const { termsRels, taxonomies } = this.props;
        console.log(termsRels)
        if(!taxonomies.data || taxonomies.data.length==0){
            return (    


               
            <Loader />
    
)
        }

        return (
            <Fragment>
                <div className="container-fluid">
                    <h1>Gerir relações <strong>Ano -&gt; Disciplina -&gt; Domínios/Temas -&gt; Subdomínios -&gt; Conceitos</strong></h1>

                    <div className="row margin__top--30">
                        <div className="col-xs-12">
                            <LimitFilter limit={this.state.limit} onChange={this.onLimitChange}/>
                        </div>
                    </div>
                    
                    <div className="row margin__top--30">
                        <div className="col-xs-12">                            
                            <ErrorBoundary>
                               <List
                                    data={termsRels.data}
                                    dropdownLists={this.state.dropdownLists}
                                    addRow={this.addRow}
                                    deleteRow={this.deleteRow}
                                    editRow={{
                                        activeEdit: this.onActivateEdit,
                                        submitRow: this.submitRow
                                    }}
                                    totalPages={this.props.termsRels.totalPages}
                                    onPageChange={this.onPageChange}
                                    activePage={this.state.activePage}
                                    onDropdownChange={this.onDropdownChange}
                                    editing={this.state.editing}
                                    filters={this.state.filters}
                                    onFilterChange={this.onFilterChange}
                                    clearFilters={this.clearFilters}
                               />
                            </ErrorBoundary>                            
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}