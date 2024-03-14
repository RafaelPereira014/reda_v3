'use strict';

import React from 'react';
import { Component } from 'react';
import _ from 'lodash';

// Components
import Tags from '#/components/common/tags';

import { parseQS } from '#/utils/history';


/* const others = ["outras","outros","outra","outro","n/a", "outros, legendado em português"]; */

export default class SearchForm extends Component {
	constructor(props){
		super(props);
		if(this.props.location.state != undefined || this.props.location.state != null){
			this.state= {
				tags: [this.props.location.state.hashtag],
			}
		}else if(props.filtersResources.data != undefined || props.filtersResources.data != null){
			this.state= {
				tags: props.filtersResources.data.tags,
			}
		}else{
			this.state= {
				tags: [],
			}
		}
		


		//
		//	Event handlers
		//
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.changeTags = this.changeTags.bind(this);

		this.setInitialState = this.setInitialState.bind(this);

		//
		//	Renders
		//
	}

	componentDidMount(){
		this.setInitialState();	 
	}

	componentDidUpdate(prevProps){
  
		// If change was made during resources list
		if (this.props.location.key == prevProps.location.key && this.props.location.pathname === '/recursos'){	 

			if (JSON.stringify(prevProps.filtersResources)!==JSON.stringify(this.props.filtersResources) && this.props.filtersResources.data==null){
				this.setState({tags: []})
			}
		}

		// If page changed and returned to resources
		if (this.props.location.key != prevProps.location.key && this.props.location.pathname === '/recursos'){
			this.setInitialState();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return JSON.stringify(nextState)!==JSON.stringify(this.state) || JSON.stringify(nextProps)!==JSON.stringify(this.props) || this.props.location.key != nextProps.location.key;
	}

	// Reset form on unmount
	componentWillUnmount() {
		//this.props.resetAllFormats();
	}

	setInitialState(){
		// Has queryString? Save validation type if so
		// 
		// ALSO CHANGE IN myResources.js TO UPDATE STATE
		// 
		if(this.props.location && this.props.location.search && !_.isEmpty(this.props.location.search) && (this.props.shouldInit==null || this.props.shouldInit===true)){
			var query = parseQS(this.props.location.search);
			const { 
				palavras: tags
			} = query;

			if(tags){
	
				this.setState({tags});
			}			
		}
	}

	// Submit search
	onFormSubmit(event = null, data) {
		if(event){
			event.preventDefault();
		}
		this.props.onSubmit(data || this.state);
	}

	// Handle tags change
	changeTags(tags){
		this.setState({
			tags: tags
		});
		if(this.props.submitOnUpdate==null || this.props.submitOnUpdate===true){
			this.onFormSubmit(null, {tags})
		}
	
	}

	calcColCount(cols){
		return Math.floor(12/cols);
	}

	render() {
		// Count total cols
		/* let maxcol = 6; */

		const {iconClass, buttonText, placeholder, showIcon} = this.props;
 
		return (
			<section className="search-container margin__top--15">
				<form className="input-group search-form" method="get" onSubmit={this.onFormSubmit}>
					<div className="row">
							
						<div className={"col-xs-12 col-sm-9"}>    
							<Tags setTags={this.changeTags} hashtag={this.props.hashtag} tags={this.state.tags} className="tags-search" placeholder={placeholder || "Palavras-chave"}/>
						</div>			

						<div className={"col-xs-12 col-sm-3"}>
							<button type="submit" className="cta primary search-submit">{showIcon && <i className={iconClass || "fa fa-search"} aria-hidden="true"></i>}
								{buttonText || "Pesquisar"}
							</button>
						</div>
					</div>
				</form>
			</section>
		);
	}
}

SearchForm.defaultProps = {
	searchTags: false,
	searchApproval: false,
	showIcon: true
}