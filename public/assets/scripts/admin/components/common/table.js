import React, { PureComponent, Fragment } from 'react';

//  Components
import Pagination from 'react-bootstrap/lib/Pagination';
import ConfirmBoxWrapper from '%/components/common/table/confirmBoxWrapper'; 
import Loader from '../../../utils/loader';

export default class TableView extends PureComponent{
    constructor(props) {
        super(props);

        this.state = {
            openFilters: true
        }
        
        //
        //  Event handlers
        //
        this.toggleFilters = this.toggleFilters.bind(this);

        //
        //  Renders
        //
        this.renderEditMode = this.renderEditMode.bind(this);
        this.renderFilters = this.renderFilters.bind(this);
    }    
    
    handleClick(row, evt){
        this.props.clickEvent(row, evt);
    }

    toggleFilters(){
        this.setState(state => ({
            openFilters : !state.openFilters
        }))
    }

    renderEditMode(props, idx, isActive){
        if(isActive){
            return (
                <Fragment>
                    <ConfirmBoxWrapper
                        continueAction={props.editRow.submitRow} 
                        idx={idx}
                        data-rel={idx}
                        className="table__row--delete btn__circle btn__circle--dark-green" 
                        title={"Guardar relação"}
                        topIcon={"fas fa-save"}
                        text={"Tem a certeza que deseja guardar esta relação?"}>
                            <i className="fas fa-check"></i>
                    </ConfirmBoxWrapper>

                    <button
                        type="button"
                        className="btn__circle btn__circle--danger outline"
                        title="Cancelar"
                        onClick={props.editRow.activeEdit}
                        data-rel={idx}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                    

                </Fragment>
            )
        }

        return (
            <Fragment>
                <button
                    type="button"
                    className="btn__circle btn__circle--dark-green"
                    title="Editar relação"
                    onClick={props.editRow.activeEdit}
                    data-rel={idx}
                >
                    <i className="fas fa-pen"></i>
                </button>
                <ConfirmBoxWrapper
                    continueAction={props.deleteRow} 
                    idx={idx}
                    className="table__row--delete btn__circle btn__circle--danger outline" 
                    title={"Apagar relação"}
                    topIcon={"fas fa-exclamation-triangle"}
                    text={"Tem a certeza que deseja apagar esta relação?"}>
                        <i className="fas fa-trash"></i>
                </ConfirmBoxWrapper>   
            </Fragment>
        )
        
    }

    renderFilters(){
        const props = this.props;

        const RenderFilters = props.RenderFilters || null;

        if(!RenderFilters){
            return null;
        }

        return(
            <div className="margin__bottom--40">
                <div className="margin__bottom--10"><b>Filtrar por:</b></div>
                <div className={"advanced-search__open margin__bottom--10" + (this.state.openFilters ? " open" : "")}>
                    <button 
                        type="button" 
                        className="cta no-border no-bg" 
                        onClick={this.toggleFilters}
                    >																
                        { this.state.openFilters ? "Esconder filtros" : "Mostrar filtros"}
                        { this.state.openFilters ? <i className="fas fa-chevron-up margin__left--15"></i> : <i className="fas fa-chevron-down margin__left--15"></i>}
                    </button>
                </div>

                { this.state.openFilters ? 
                    <table className={(props.responsive ? 'table-responsive' : '') + (props.tableClass ? " "+props.tableClass : '') + " margin__bottom--30 terms__filter"}>
                        <thead>
                            {props.header && props.header.length>0 ?
                                <tr>
                                    {props.header.map((header, idx) => <th key={"header_"+idx} colSpan={idx==props.header.length-1 && props.deleteRow ? 2 : 0}>{header}</th>)}
                                </tr>
                            :
                                null
                            }
                        </thead>

                        <tbody>
                            <tr>
                                <RenderFilters />
                                <td>
                                <button
                                    type="button"
                                    className="btn__circle btn__circle--danger outline"
                                    title="Limpar filtros"
                                    onClick={props.clearFilters}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                : null
                }
            </div>
        )
    }
    

    render(){
        const props = this.props;
        const RenderRow = props.RenderRow || null;

        return(    
            
            <Fragment>
                {this.renderFilters()}

                {props.data && props.data.length>0 ? 
                    <Fragment>
                        <table className={(props.responsive ? 'table-responsive' : '') + (props.tableClass ? " "+props.tableClass : '')}>
                            <thead>
                                {props.header && props.header.length>0 ?
                                    <tr>
                                        {props.header.map((header, idx) => <th key={"header_"+idx} colSpan={idx==props.header.length-1 && props.deleteRow ? 2 : 0}>{header}</th>)}
                                    </tr>
                                :
                                    null
                                }
                            </thead>
                            
                            <tbody>
                                {
                                    props.data.map((row, idx) => <Fragment key={"row_"+idx}>
                                        {
                                            idx == 0 && props.addRow && (props.activePage==1 || !props.activePage) && 
                                            <tr>
                                                <td colSpan={!props.deleteRow ? props.header.length : props.header.length+1}>
                                                    <button type="button" className="table__row--add cta primary block" title="Adicionar linha" onClick={props.addRow}><i className="fas fa-plus"></i> Adicionar linha</button>                                            
                                                </td>
                                            </tr> 
                                        }
                                        <tr className={!row.id ? 'new' : ''}>                                        
                                            {
                                                RenderRow ?
                                                    <RenderRow
                                                    el={row}
                                                    idx={idx}/>
                                                :
                                                    row.map((value, valIdx) => <td key={"row_"+idx+"_col_"+valIdx}>{value}</td>)
                                            }
                                            {
                                                (props.deleteRow || props.editRow) ? 
                                                    <td  style={{width: "120px",paddingLeft: "0"}}>
                                                        {this.renderEditMode(props, idx, props.editing.indexOf(idx)>=0)}
                                                    </td>
                                                :
                                                null
                                            }
                                        </tr>
                                        </Fragment>
                                    )
                                }
                            </tbody>
                        </table>
        
                        {/* Pagination */}
                        {(() => {
                            if (props.data && props.data.length>0 && props.totalPages>1){
                                return <Pagination
                                        prev
                                        next
                                        first
                                        last
                                        ellipsis
                                        boundaryLinks
                                        items={props.totalPages}
                                        maxButtons={5}
                                        activePage={props.activePage || 1}
                                        onSelect={props.onPageChange} />
                            }
                        })()}      
                    </Fragment>          
                :
 

                
             <Loader/>
     
           

                }
            </Fragment>
        )
    }
    
}