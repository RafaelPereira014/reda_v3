'use strict';

import React, { Component } from 'react';

// Utils
import { scrollToTop, setDateFormat } from '#/utils';

//  Components
import GoBack from '#/components/common/goBack';

export default class NewsList extends Component{
	_isMounted = false;
	constructor(props){
		super(props);

		//
		//	Event handler
		//	
	}

	componentDidMount(){
		const { config } = this.props;

		this._isMounted = true;
		this.firstRender = false;

		this.requestNew();
		// Get configurations
		!config.fetched && this.props.fetchConfig();

		scrollToTop();
	}

	componentWillUnmount() {
		this._isMounted = false;
		this.props.resetNews();
	}

	//
	//	REQUEST NEW DATA
	//
	requestNew(){
		this.props.getNewsDetails(this.props.match.params.slug);
	}

	render() {
		const { data } = this.props.newsDetail;
    const {config} = this.props;

		if (!data || data.length==0 || !config || !config.data){
			return null;
    }
    
    const image = data.Thumbnail ? config.data.files+"/news"+"/"+data.slug + "/" + data.Thumbnail.name + "." + data.Thumbnail.extension : null;


    return (
			<section className="margin__topbottom--30 news__details">	
				<div className="container">         
					<div className="row">
            <GoBack />
            <article className="margin__top--30">
              <section>
                <header>
                  <h1>{data.title}</h1>
                  <small>{setDateFormat(data.created_at, 'LL')} às {`${setDateFormat(data.created_at, 'LT')}h`}</small>
                  {
                    image && <img src={image} className="img-responsive" />
                  }
                </header>
                <div dangerouslySetInnerHTML={{__html: data.description}}></div>
                
              </section>
            </article>	
					</div>
				</div>		
			</section>
		)
	}
}