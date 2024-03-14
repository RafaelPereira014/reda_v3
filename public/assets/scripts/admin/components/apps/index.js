import React, { Component } from 'react';

// Components
import List from '%/components/apps/list';
import Filters from '#/containers/filters/filtersGeneric';
/* import {Link} from 'react-router-dom'; */

// Utils
import { scrollToTop, withPlural } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import _ from 'lodash';

export default class AllAppsList extends Component{
  _isMounted = false;
	constructor(props){
		super(props);

		this.resetState = {
      activePage: 1,
      limit:12, 
      type: 'all',
      update: false,
      tags: [],
      filters: {
          terms: []
      },
      openFilters: false,
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
    this.onFilterChange = this.onFilterChange.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.getTaxList = this.getTaxList.bind(this);
	}

	componentDidMount() {
    this._isMounted = true;
		scrollToTop();
		
    let initialData = this.resetState;

    this.getTaxList();
        
        // Has queryString?
		if (this.props.location && this.props.location.search && !_.isEmpty(this.props.location.search)){
			const query = parseQS(this.props.location.search);

      const { pagina, termos, palavras } = query;

      initialData = {
          ...initialData,
          activePage: parseInt(pagina) || initialData.activePage,
          limit: (query && query.limite && parseInt(query.limite)) || initialData.limit,
          filters: {
            terms: termos ? termos.map(term => parseInt(term)) : initialData.filters.terms,
          },
          tags: palavras && palavras.length>0 && (typeof palavras === 'string' ? [palavras] : palavras) || initialData.tags,
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
		return nextProps.apps.fetched || this.state.update;
  }
    
  componentWillUnmount(){
    this._isMounted = false;
    this.props.resetApps();
  }

	// Request new data on update
	requestNewData(reset = false, state = null){
    if(this._isMounted){
      let tempState = state || this.state;
      
      let initialData = {
          activePage: tempState.activePage,
          limit: tempState.limit,
          tags: tempState.tags,
          filters: tempState.filters,
      };

      //Reset page?
      if (reset){
          initialData = {
              activePage: this.initialState.activePage,
              limit: this.initialState.limit,
              tags: this.initialState.tags,
              filters: this.initialState.filters,
          };

          this.setState(initialData);
      }

      this.props.searchApps(initialData);
    }
  }
  
  async getTaxList(){
    if(this._isMounted){

        let fetchFilters = [
            {
                key: "type",
                value: "apps"
            },
            {
                key: "terms",
                value: true
            },
            {
                key: "exclude",
                value: [
                    'sistemas_apps',
                    'tags_apps'
                ]
            },
            {
              key: "scope",
              value: "all"
            }
            /* 
            {
                key: "scope",
                value: approval==='scientific' ? 'toApproveScientific' : (approval==='linguistic' ? 'toApproveLinguistic' : 'pending')
            } */
        ]       
        

        this.props.fetchTaxonomies(fetchFilters, false);
    }
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
	
	//	Delete
	async deleteEl(id){
		this.props.deleteApp(id)
		.then(() => this.requestNewData(true));
  }
  
  toggleFilters(){
    this.setState({openFilters: !this.state.openFilters});
  }

  // When filters change
  onFilterChange(filters){
    this.setState({
        filters: {
            terms: filters.terms
        },
        tags: filters.tags,
        activePage: 1,
        update: true
    });
  }

	render(){
    const { apps } = this.props;
    

		return (
			<div className="apps__page">
				<div className="row">
          <div className="col-xs-12">
            <h1 className="margin__bottom--15">Todas as aplicações</h1>
            {/* <Link to="/novaaplicacao" className="cta primary no-bg margin__bottom--30"><i className="fas fa-plus"></i> Criar nova</Link> */}
            
            <Filters
              location={this.props.location}
              onFilterChange={this.onFilterChange}
              type="apps"
              taxonomies={this.props.taxonomies}
              className="margin__top--15"
              searchText={"Filtrar palavras"}
              />
            <h2 className="margin__bottom--30">{apps.total} {withPlural(apps.total, "resultado", "resultados")}</h2>
            
            {apps.fetching ?
              <p className="margin__top--30 margin__bottom--60">A carregar...</p>
            
            :
              !apps || !apps.data || apps.data.length==0 ?
                <p className="text-center margin__top--30 margin__bottom--60">Não foram encontrados resultados.</p>

            :
              <List 
                list={this.props.apps}
                onPageChange={this.onChangePage}
                activePage={this.state.activePage}
                otherData={this.props}
                deleteEl={this.deleteEl}
              />
            }
            
          </div>
				</div>
			</div>
		)
	}
}