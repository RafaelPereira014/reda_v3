'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from "react-router-dom";
import { reset, initialize, destroy } from 'redux-form';
import { fetchConfig } from '#/actions/config';

// Components
import FormBody from '%/components/taxonomies/details/forms/form';

class NewTaxFormContainer extends Component {
  constructor(props) {
    super(props)

    //
    //  Event handlers
    //

    //
    //  Helpers
    //
    this.initForm = this.initForm.bind(this);
  }

  componentDidMount(){
    const { slug } = this.props.match.params;

    //
    //  If to edit, get tax
    //
    if (slug){
        const { taxonomy } = this.props;

      // If errors, go back
      if (taxonomy.errorMessage){
        this.props.history.push('/dashboard/taxonomias');
      }else{          
        this.initForm();
      }
    }
  }

  // On exit, reset states
  componentWillUnmount(){
    this.props.resetForm();
    this.props.destroy();
  }


  //
  //  INIT form after server fetch
  //
  initForm(){
    const { taxonomy } = this.props;

    const fields = [ 
      'title',
      'type',
    ]

    let initValues = {
      title: taxonomy && taxonomy.data ? taxonomy.data.title : null,
      type: taxonomy && taxonomy.data ? taxonomy && taxonomy.data.Type.id : [],
    }

    this.props.initForm(initValues, fields);          
  }

  render() {
    return (
        <FormBody {...this.props}/>
    )
  }
}


function mapStateToProps(state) {
  return { 
      taxonomy: state.taxonomy,
      config: state.config,
  };
}

function mapDispatchToProps(dispatch) { 
  return bindActionCreators({ 
    fetchConfig,
    resetForm: () => dispatch(reset('newTax')),
    destroy: () => dispatch(destroy('newTax')),
    initForm: (initValues, fields) => dispatch(initialize('newTax', initValues, fields))
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewTaxFormContainer));