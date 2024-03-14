'use strict';

import React from 'react';
import { Component } from 'react';

// Containers
import HeaderContainer from '#/containers/header';
import RecentContainer from '#/containers/resources/recent';
import BottomNav from '#/components/navigation/bottomNav';

import Testimonials from '#/containers/blocks/testimonials';

// Actions
/*import { fetchConfig } from '#/actions/config';
import { fetchHighlights, fetchResources } from '#/actions/resources';
import { fetchRecTerms } from '#/actions/recterms';
import { fetchTaxonomies } from '#/actions/taxonomies';*/

export default class IndexPage extends Component {
  render() {   
    return (
      <div>
        

					


            <HeaderContainer location={this.props.location} />
         <RecentContainer /> 
            {/* <div className="container-fluid">
                <div className="row">
                    <TeacherBlockContainer />
                    <ExploreBlock />
                </div>                
            </div>    */}    
            <Testimonials />   
                       
          <BottomNav location={this.props.location} /> 
        </div>
    );
  }
}

