import React, { Component } from 'react';

// Components
import List from '%/components/taxonomies/list';

// Utils
import { scrollToTop, withPlural } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import _ from 'lodash';

export default class TaxList extends Component{
    _isMounted = false;
	constructor(props){
		super(props);

		this.resetState = {
            activePage: 1,
            limit:12, 
			update: false
		}

		this.state = this.resetState;

		//
		//	Renders
		//

		//
		//	Event Handlers
		//
		this.onChangePage = this.onChangePage.bind(this);
		this.deleteEl = this.deleteEl.bind(this);
	}

	componentDidMount() {
        this._isMounted = true;
		scrollToTop();
		
        let initialData = this.resetState;
        
        // Has queryString?
		if (this.props.location && this.props.location.search && !_.isEmpty(this.props.location.search)){
			const query = parseQS(this.props.location.search);

            const { pagina } = query;
            
            initialData = {
                ...initialData,
                activePage: parseInt(pagina) || initialData.activePage,
                limit: (query && query.limite && parseInt(query.limite)) || initialData.limit,
            };
			
        }

        if(this._isMounted){
            this.requestNewData(false, initialData);

            this.setState(initialData);

            setQueryString(initialData, {history: this.props.history}, this.props.location);
        }
        
	}

	componentDidUpdate(prevProps, prevState) {
		const { activePage } = this.state;

		// Request new resources if there is any change
		if (JSON.stringify(prevState) !== JSON.stringify(this.state) || this.state.update){

             this.requestNewData();
             this.setState({update: false})

			// Scroll to top only on page change
			if (activePage != prevState.activePage){
				scrollToTop();
			}

			if (this.props.location.key == prevProps.location.key){	 			
				setQueryString(this.state, {history: this.props.history}, this.props.location);
			}
		}
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.taxonomies.fetched || this.state.update;
    }
    
    componentWillUnmount(){
		this._isMounted = false;
		this.props.resetTaxonomies();
    }

	// Request new data on update
	requestNewData(reset = false, state = null){
		this._isMounted && this.props.searchTaxonomies(
			reset ? this.initialState : (state || this.state),
			[
				{
					key: "exclude",
					value: [
						'tags_resources',
						'tags_apps',
						'tags_tools',
						'tags_students'
					]
				}
			]
		);
	}

	// Pagination page change
	onChangePage(page) {
		if (page){
			this.setState({
                activePage: page,
                update: true
			});
		}
	}
	
	//	Delete taxonomy
	async deleteEl(el){
		if(!el.locked){
			await this.props.deleteTaxonomy(el.slug);
			this.setState({
				update: true
			})
		}
	}

	render(){
		const { taxonomies } = this.props;

		return (
			<div className="taxs__page">
				{/* <div className="row">
					<div className="col-xs-12">
						<h1 className="margin__bottom--30">Gestão de taxonomias</h1>
						<Link to="/dashboard/taxonomias/criar" className="cta primary"><i className="fas fa-plus"></i> Criar nova</Link>
					</div>
				</div> */}
				<div className="row">
					<div className="col-xs-12">
						<h1 className="margin__bottom--30">Gestão de taxonomias</h1>
						<h2 className="margin__bottom--30">{taxonomies.total} {withPlural(taxonomies.total, "resultado", "resultados")}</h2>
						
						<List 
							list={this.props.taxonomies}
							onPageChange={this.onChangePage}
							activePage={this.state.activePage}
							otherData={this.props}
							deleteEl={this.deleteEl}
										/>
					</div>
				</div>
			</div>
		)
	}
}