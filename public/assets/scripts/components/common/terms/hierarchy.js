'use strict';

import React, { Fragment } from 'react';

// Components
import {CheckboxGroup, Checkbox} from 'react-checkbox-group';
import Collapsible from '#/components/common/collapse';

const reorderTerms = (terms) => {
    let finalStructure = [];

    terms && terms.map(term => {
        let curTerm = Object.assign({}, term);
        if(!term.parent_id){
            curTerm.children = getChildren(terms, term);
            finalStructure.push(curTerm);
        }
    })
    return finalStructure;
} 

const getChildren = (terms, term) => {
    let children = [];

    terms.map( curTerm => {
        let thisChild = Object.assign({}, curTerm);
        thisChild.children = thisChild.children || [];

        if(curTerm.parent_id && curTerm.parent_id == term.id){

            thisChild.children = thisChild.children.concat(getChildren(terms, curTerm));
            children.push(thisChild);
        }
    })

    return children;
}

let renderTerms = (terms, props) =>{
    return terms.map((item) => {
        return (
            <div key={item.id} className={!item.parent_id ? "col-xs-12 col-sm-6 col-md-4 col-lg-3" : ""}>

                {props.collapsed ?
                    item.children && item.children.length>0 ?
                            <Collapsible
                            title={item.title}
                            iconOpen={"fa fa-chevron-down"}
                            iconClosed={"fa fa-chevron-up"}
                            RenderTitle={() => (
                                <div>
                                    <Checkbox value={item.id} id={"category-"+item.id}/>
                                    <label htmlFor={"category-"+item.id}>{item.title}</label>
                                </div>
                            )}>
                                <div className="margin__left--30">
                                    {renderTerms(item.children, props)}
                                </div>
                            </Collapsible>
                    :
                        <div>
                            <Checkbox value={item.id} id={"category-"+item.id}/>
                            <label htmlFor={"category-"+item.id}>{item.title}</label>
                        </div>
                    
                :
                    <Fragment>
                        <div>
                            <Checkbox value={item.id} id={"category-"+item.id}/>
                            <label htmlFor={"category-"+item.id}>{item.title}</label>
                        </div>
                        {item.children && item.children.length>0 ?
                            <div className="margin__left--30">
                            {renderTerms(item.children, props)}
                            </div>
                        : null
                        }
                    </Fragment>
                }
            </div>
        )
    })
}

let renderTaxs = (props) => {
    const { taxs, selected, setTerms } = props;

    return(
        taxs.map(tax => {
            const terms = reorderTerms(tax.Terms);
            
            return (
                <div className="col-xs-12" key={tax.id}>
                    <label className="input-title required">{tax.title}</label>
                    <CheckboxGroup
                            name="terms"
                            value={selected}
                            onChange={setTerms}
                        >
                            <div className="row">
                                {renderTerms(terms, props)}
                            </div>
                    </CheckboxGroup>
                </div>
            )
        })
    )
    
}


export default (props) => {
    const { taxs } = props;

    if(!taxs || taxs.length==0){
        return null;
    }

    return(
        <div className={"row list__collapsible " + (props.wrapperClassname || "")}>
            {renderTaxs(props)}
        </div>
    );
}