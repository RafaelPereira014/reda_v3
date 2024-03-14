'use strict';

import React from 'react';
import { Component } from 'react';

// Meta
import DocHead from "#/components/common/docHead";

// Components
import Header from '#/containers/header';
import FeedbackForm from '#/containers/generic/feedback';
import BottomNav from '#/components/navigation/bottomNav';

// Utils
import { scrollToTop } from '#/utils';

export default class NewResourcePage extends Component {
  componentDidMount() {
    scrollToTop();
  }

  render() {
    let data = {
      title: "Fale connosco - REDA"
    }

    return (
      <div>
        <DocHead data={data} location={this.props.location}/>
        <Header location={this.props.location}/>
        <FeedbackForm />
        <BottomNav location={this.props.location}/>
      </div>
    );
  }
}