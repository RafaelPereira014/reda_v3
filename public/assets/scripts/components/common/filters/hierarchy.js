'use strict';

import React from 'react';
import { PureComponent, Fragment } from 'react';

// Components
import Collapsible from '#/components/common/collapse';
import {CheckboxGroup, Checkbox} from 'react-checkbox-group';

export default class HierarchyFilters extends PureComponent {
    constructor(props){
        super(props);

        this.state = {
            selected: [],
            isOpenDefault: false
        }

        //
        //  Renders
        //
        this.renderTaxs = this.renderTaxs.bind(this);
        this.renderTerms = this.renderTerms.bind(this);

        //
        //  Helpers
        //
        this.reorderTerms = this.reorderTerms.bind(this);
        this.getChildren = this.getChildren.bind(this);

        //
        //  Event handlers
        //
        this.setTerms = this.setTerms.bind(this);
    }

    componentDidMount(){

    }

    setTerms(group){
        this.setState({
            selected: group
        });

        this.props.onFilterChange({terms: group});
    }

    reorderTerms(terms){
        let finalStructure = [];

        if(terms && terms.lenght>0){
            terms.map(term => {
                let curTerm = Object.assign({}, term);
                if(!term.parent_id){
                    curTerm.children = this.getChildren(terms, term);
                    finalStructure.push(curTerm);
                }
            })
        }
        
        return finalStructure;
    } 
    
    getChildren(terms, term){
        let children = [];

        terms.map( curTerm => {
            let thisChild = Object.assign({}, curTerm);
            thisChild.children = thisChild.children || [];

            if(curTerm.parent_id && curTerm.parent_id == term.id){

                thisChild.children = thisChild.children.concat(this.getChildren(terms, curTerm));
                children.push(thisChild);
            }
        })

        return children;
    }

    renderTerms(terms){
        return terms.map((item) => {      
                  
            return (
                <Fragment key={item.id}>
                    <div className="col-xs-12">
                        <Checkbox value={item.id} id={"category-"+item.id}/> 
                        <label htmlFor={"category-"+item.id}>{item.title}</label>
                    </div>
                    {item.children && item.children.length>0 && <div className="margin__left--10">
                        {this.renderTerms(item.children)}    
                    </div>}
                </Fragment>
            )                        		                
        })
        
    }

    renderTaxs(){
        const { taxs } = this.props;
        const { selected } = this.state;

        return taxs.map(tax => {
            const terms = this.reorderTerms(tax.Terms);

            return (
                <Collapsible key={tax.id} title={tax.title} iconOpen="fa fa-chevron-up" iconClosed="fa fa-chevron-down" isOpen={this.state.isOpenDefault}>
                    <CheckboxGroup
                            name="terms"
                            value={selected}
                            onChange={this.setTerms}
                        >
                                <div className="row">
                                    {this.renderTerms(terms)}
                                </div>
                    </CheckboxGroup>
                </Collapsible>
            )
        })
    }

    render(){
        const { taxs } = this.props;

        if(!taxs || taxs.length==0){
            return null;
        }

        return(
        <div className="app__filter apps">
            <div className="row filters__list">
                <div className="col-xs-12 filters__list--elements">
                    {this.renderTaxs()}
                </div>
            </div>
        </div>
        );
    }
}