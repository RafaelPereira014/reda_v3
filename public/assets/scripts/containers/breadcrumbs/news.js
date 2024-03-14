import React from 'react';
import { connect } from 'react-redux';

const PureNewsBreadcrumb = ({ newsDetail }) => {
    if(newsDetail.fetched && newsDetail.data){
        return <span>{newsDetail.data.title}</span>
    }
    return null;
};

const mapStateToProps = (state) => ({
    newsDetail: state.newsDetail,
});

export default connect(mapStateToProps)(PureNewsBreadcrumb);