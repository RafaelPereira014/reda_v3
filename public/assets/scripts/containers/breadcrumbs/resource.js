import React from 'react';
import { connect } from 'react-redux';

const PureResourceBreadcrumb = ({ resource }) => {
    if(resource.fetched && resource.data){
        return <span>{resource.data.title}</span>
    }
    return null;
};

const mapStateToProps = (state) => ({
    resource: state.resource,
});

export default connect(mapStateToProps)(PureResourceBreadcrumb);