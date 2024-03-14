'use strict';

import _ from 'lodash';

//
//  Check if selected has related and get the list
//
export const getRelated = (selected, taxonomies) => {
    let finalStruct = [];

    //  Get taxonomies that have elements with relationships
   
    const withRelationships = taxonomies && Object.keys(taxonomies)
    .filter(key => taxonomies[key].topRelLevel && taxonomies[key].topRelLevel > 0)
    .reduce((obj, key) => ({ ...obj, [key]: taxonomies[key] }), {});

    // For each tax
    if(withRelationships && !_.isEmpty(withRelationships)){
        Object.values(withRelationships).map((tax) => {
            
            finalStruct['pos_' + parseInt(tax.topRelLevel)] = [];
            const termsToFilter = tax.terms || tax.Terms || []; 

            /* if (
                parseInt(tax.topRelLevel) == 1 ||
                (parseInt(tax.topRelLevel) > 1 &&
                    finalStruct['pos_' + (parseInt(tax.topRelLevel) - 1)] &&
                    finalStruct['pos_' + (parseInt(tax.topRelLevel) - 1)].length > 0)
            ) { */
                
                // Get terms that are the same as the selected one
                let selectedTerms = termsToFilter.filter(
                    term => selected.indexOf(term.id) >= 0
                );
                
                selectedTerms.map(terms => {
                    terms.Relationship.map(rel =>
                        finalStruct['pos_' + tax.topRelLevel].push(parseInt(rel.id))
                    );
                });
            /* } */
        });
    }

    return finalStruct;
}

//
//  Get terms that are visible based on given active relationships and state
//
export const toggleTermsVisibility = (active_rels, state) => {
    const { years, subjects, domains, subdominios, hashtags } = state;

    // Get future visible
    const subjectsList = getDownRelated(
        subjects.terms,
        subjects.topRelLevel,
        active_rels
    );
    const yearsList = getDownRelated(
        years.terms,
        years.topRelLevel,
        active_rels
    );
    const domainsList = getDownRelated(
        domains.terms,
        domains.topRelLevel,
        active_rels
    );
    const subdominiosList = getDownRelated(
        subdominios.terms,
        subdominios.topRelLevel,
        active_rels
    );
    const hashtagsList = getDownRelated(
        hashtags.terms,
        hashtags.topRelLevel,
        active_rels
    );
    return (subjectsList || [])
        .concat(domainsList || [])
        .concat(yearsList || [])
        .concat(subdominiosList || [])
        .concat(hashtagsList || [])
        .reduce((acc, cur) => [...acc, cur.id], []);
}
//
//  Based on active relations, get rest of related taxs in next level
//
export const getDownRelated = (terms, topRelLevel, rels = null) => {
    const active_rels = rels;

    if (active_rels && terms) {
        let list = terms
            .map(term => {
                let rels = null;
                if (term.Relationship.length > 0) {
                    rels = term.Relationship.filter(rel => {
                        let exists = true;

                        for (var i = parseInt(topRelLevel) - 1; i >= 1; i--) {
                            if (
                                active_rels['pos_' + i] &&
                                active_rels['pos_' + i].length > 0
                            ) {
                                exists = exists
                                    ? active_rels['pos_' + i].indexOf(parseInt(rel.id)) >= 0
                                    : exists;
                            } else {
                                exists = false;
                            }
                        }

                        return exists;
                    });
                }

                if (
                    topRelLevel == 1 ||
                    topRelLevel == null ||
                    (rels !== null && rels.length > 0)
                ) {
                    return term;
                }

                return null;
            })
            .filter(el => el != null);

        return list;
    }

    return null;
}

export const getRelatedItems = (activeTerms, group, state) => {
    // Get relationships of selected terms
    let active_rels = getRelated(activeTerms, state);

    // Get visible terms in order to get those that are actually valid to submit
    let visible_terms = toggleTermsVisibility(active_rels, state).concat(
      group || []
    );

    // Set terms valid for submittion
    let valid_terms = visible_terms.filter(
      value => -1 !== activeTerms.indexOf(value)
    );

    return {
        active_rels,
        visible_terms,
        valid_terms
    };
}