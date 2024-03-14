import React, { Component, Fragment } from 'react';

//  Utils
import {setDateFormat} from '#/utils';

//  Components
import TableView from '%/components/common/table'
import ConfirmBox from '#/containers/dashboard/common/confirmBox'; 

export default class TaxTermsList extends Component{
    _isMounted = false;
    constructor(props) {
        super(props);

        this.initialState = {
            activePage: 1,
            limit: 18,
            update: false
        }

        this.state = this.initialState;

        //
        //  Renders
        //
        this.renderTerms = this.renderTerms.bind(this);        

        //
        //  Handlers
        //        
        this.onPageChange = this.onPageChange.bind(this);
        this.deleteTerm = this.deleteTerm.bind(this);

        //
        //  Helpers
        //
        this.renderTerms = this.renderTerms.bind(this);
    }

    
    async UNSAFE_componentWillMount() {
        this._isMounted = true;
        await this.props.fetchTaxTerms(this.props.match.params.slug, this.state);   

        const { taxonomy } = this.props;
        if(!taxonomy.data || taxonomy.data.length==0 || (!taxonomy.fetched && !taxonomy.fetching)){
            await this.props.fetchTaxonomy(this.props.match.params.slug);
        }
        
    }

    componentWillUnmount(){
        this.props.resetTaxTerms();
        this._isMounted = false;
    }

    componentDidUpdate(prevProps, prevState) {
        // Terms page change
        if(this.state.update && this.state.activePage!==prevState.activePage){
            this._isMounted && this.props.fetchTaxTerms(this.props.match.params.slug, this.state);

            this._isMounted && this.setState({update: false})
        }
    }

    //
    //  Handle add input term change
    //
    onPageChange(page){
        this.setState({
            activePage: page,
            update: true
        });
    }

    //
    //  Delete term
    //
    async deleteTerm(el){
        await this.props.deleteTerm(el.slug);
        this.props.fetchTaxTerms(this.props.match.params.slug, this.initialState);
        this.props.selectedTermToEdit(null);
    }

    //
    //  Show terms list
    //
    renderTerms(){
        const { taxTerms } = this.props;

        if(!taxTerms.data || taxTerms.data.length==0){
            return <div>
                <em>Ainda não foram adicionados termos.</em>
            </div>;
        }


        let header = [
            'Título',
            'Data de criação',     
            'Ações'   
        ]

        return <TableView
        data={taxTerms.data}
        header={header}
        responsive={true}
        tableClass="stripped"
        totalPages={taxTerms.totalPages}
        onPageChange={this.onPageChange}
        activePage={this.state.activePage}
        RenderRow={
            (
                {
                    el
                }
            ) => (
                <Fragment>
                    <td>
                        {
                            el.hierarchy_level && el.hierarchy_level>1 ?

                                String.fromCharCode(160) + String.fromCharCode(0x2014).repeat(el.hierarchy_level-1) + String.fromCharCode(160) + el.title
                            :
                                el.title
                        }
                    </td>
                    <td>{setDateFormat(el.created_at, "LLL")}</td>        
                    <td className="vMiddle">
                        <button
                            type="button"
                            onClick={() => this.props.selectedTermToEdit(el)}
                            className="btn__circle btn__circle--c1 outline"
                            title="Editar termo">
                                <i className="fas fa-pen"></i>
                        </button>

                        <ConfirmBox 
                            continueAction={()=> this.deleteTerm(el)} 
                            className="btn__circle btn__circle--danger outline" 
                            title={"Apagar termo"}
                            text={"Tem a certeza que deseja apagar este termo?"}>
                                <i className="fas fa-trash"></i>
                        </ConfirmBox>

                        
                    </td>                
                </Fragment>
            )
        }
        />
    }
    
    render() {
        if(!this.props.match.params.slug){
            return null;
        }

        return (
            <Fragment>
                {this.renderTerms()}
            </Fragment>
        );
    }
    
}