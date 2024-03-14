'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';

// Utils
import { scrollToTop } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import _ from 'lodash';

// Components
import List from '%/components/comments/badwords/list';
import AddInput from '%/components/common/textInput';


export default class BadwordsList extends Component {
	_isMounted = false;
	constructor(props){
		super(props);
		
		//
		//	Event handlers
		//
        this.onChangePage = this.onChangePage.bind(this);
        this.deleteWord = this.deleteWord.bind(this);
        this.handleWordInputChange = this.handleWordInputChange.bind(this);
        this.submitWord = this.submitWord.bind(this);

		//
		// Actions
		// 

		//
		//	Helpers
		//
		this.requestBadwords = this.requestBadwords.bind(this);

		//
		//	Set state
		//
		this.state = {
            activePage: 1,
            limit: 12,
            newWordInput: ''
		}

		this.firstRender = true;
	}

	async componentDidMount(){
		this._isMounted = true;

		// Set initial data
		let initialData = {
            ...this.state,
			activePage: this.state.activePage
		};


		// Has queryString?
		if(this.props.location.search && !_.isEmpty(this.props.location.search)){
			var query = parseQS(this.props.location.search);
			const { pagina } = query;

			initialData.activePage = parseInt(pagina) || initialData.activePage;

		}


        await this.requestBadwords(false, initialData);
		this.firstRender = false;
		
		if(this._isMounted){
			this.setState({
				activePage: this.props.badwords.curPage || initialData.activePage
			});
		}
		

		setQueryString(initialData, {history: this.props.history}, this.props.location);
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.badwords.fetched;
	}

	componentDidUpdate(prevProps, prevState) {

		const { activePage, order } = this.state;

		// Request new badwprds if there is any change
		if (((JSON.stringify(prevProps.badwords.data)!=JSON.stringify(this.props.badwords.data)) ||
			prevState.activePage !== activePage ||
			prevState.order !== order) && !this.firstRender){
			this.requestBadwords();
			scrollToTop();

			if (this.props.location.key == prevProps.location.key){	 			
				setQueryString(this.state, {history: this.props.history}, this.props.location);
			}
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		this.props.resetBadwords();
	}

	//	Request new badwords
	requestBadwords(reset = false, state = null){
		const { activePage } = state || this.state;

		if(this._isMounted){
			//Reset page?
			if (reset){
				this.setState({
					activePage: 1
				});
			}
			
			let finalObj = {
				activePage: reset ? 1 : activePage,
				...this.state
			}

			delete finalObj.newWordInput;
			
			this.props.fetchBadwords(finalObj);
		}
	}

	// Handle pagination
	onChangePage(page) {
		if (page){
			this.setState({
				activePage: page
			});
		}		
    }

    async submitWord(evt){
        evt.preventDefault();
        if(this.state.newWordInput.length>0 && this._isMounted){
            await this.props.addBadword(this.state.newWordInput);
			this.requestBadwords(true);
			this.setState({newWordInput: ''})
        }
        
    }

    handleWordInputChange(event){
		if(this._isMounted){
			this.setState({newWordInput: event.target.value});
		}
    }

    async deleteWord(word){
        await this.props.deleteBadword(word.id);
		this.requestBadwords(true);
    }

	render() {
		const { badwords } = this.props;		
		

		if (!badwords || !badwords.data)
			return (
				<div className="badwords__page">
					<div className="row">
						<div className="col-xs-12">
							<h2 className="pannel-title">Palavras proibidas</h2>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<p className="text-center">Não foram encontrados resultados.</p>
						</div>
					</div>
				</div>
			)

		return (
			<div className="badwords__page">
				<div className="row">
					<div className="col-xs-12 margin__bottom--30">
						<h2 className="pannel-title">Palavras proibidas</h2>
					</div>
				</div>
				<div className="row">
						<div className="col-xs-12">
								<AddInput
										handleChange={this.handleWordInputChange}
										onSubmit={this.submitWord}
										value={this.state.newWordInput}
										/>
						</div>
				</div>
				<div className="row">
				{this.props.badwords && this.props.badwords.data && this.props.badwords.data.length > 0 ?
					<div className="col-xs-12">					
						{/* Badwords List */}
						<List 
							list={this.props.badwords}
							onPageChange={this.onChangePage}
							activePage={this.state.activePage}
                            deleteWord={this.deleteWord}
						/>
					</div>
					:
					<div className="col-xs-12 text-center">
						<p>Não existem resultados a disponibilizar.</p>
					</div>
				}
				</div>					
			</div>
		);
	}
}

BadwordsList.propTypes = {
	badwords: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	location: PropTypes.object
}