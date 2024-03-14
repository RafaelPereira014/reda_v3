import React, { Component } from 'react';

//  Utils
import { withPlural, scrollToTop } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import _ from 'lodash';

//  Components
import ToolsList from '%/components/tools/list';

import Filters from '#/containers/filters/filtersGeneric';


export default class ToolsAllList extends Component{
    _isMounted = false;

    constructor(props) {
        super(props);

        this.resetState = {
          activePage: 1,
          limit: 12,
          tags: [],
          filters: { terms: [] },
          openFilters: false,
          update: false
        }
        
        this.state = this.resetState;
        
        //
        //  Renders
        //        

        //
        //  Event handlers
        //
        this.onPageChange = this.onPageChange.bind(this);
        this.toggleFilters = this.toggleFilters.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.deleteEl = this.deleteEl.bind(this);

        //
        //  Helpers
        //
        this.requestTools = this.requestTools.bind(this);
        this.getTaxList = this.getTaxList.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;
        scrollToTop();

        this.getTaxList();
        

        let initialData = {
            activePage: this.state.activePage,
            limit: this.state.limit,
            tags: this.state.tags,
            filters: this.state.filters
        };

        // Has queryString?
		if (this.props.location && this.props.location.search && !_.isEmpty(this.props.location.search)){
			const query = parseQS(this.props.location.search);


      const { pagina, termos, palavras } = query;
      
      initialData = {
          ...initialData,
          activePage: parseInt(pagina) || initialData.activePage,
          filters: {
              terms: termos ? termos.map(term => parseInt(term)) : initialData.filters.terms,
          },
          tags: palavras && palavras.length>0 && (typeof palavras === 'string' ? [palavras] : palavras) || initialData.tags,
          limit: (query && query.limite && parseInt(query.limite)) || initialData.limit,
      };
  
    }
    
    if(this._isMounted){
        await this.requestTools(false, initialData);
        this.setState(initialData);

        /* await this.props.fetchMessages(null, 'disapprove'); */
        setQueryString(initialData, {history: this.props.history}, this.props.location);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { activePage } = this.state;
    // Request new resources if there is any change
		if (JSON.stringify(prevState) !== JSON.stringify(this.state) || this.state.update){
      this.requestTools();
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

  componentWillUnmount(){
      this._isMounted = false;
      this.props.resetTools();
  }

    async getTaxList(){

      let fetchFilters = [
        {
          key: "type",
          value: "tools"
        },
        {
          key: "terms",
          value: true
              },
        {
          key: "exclude",
          value: [
            'tags_tools'
          ]
        },
        {
            key: "scope",
            value: "all"
        }
      ]       
      

      this.props.fetchTaxonomies(fetchFilters);
    }

  //	Request new resources
  async requestTools(reset = false, state = null){
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
        activePage: this.resetState.activePage,
        limit: this.resetState.limit,
        tags: this.resetState.tags,
        filters: this.resetState.filters,
      };

      this.setState(initialData);
    }

		await this.props.searchTools(initialData);

	}

  onPageChange(page){
    if(page){
      this.setState({
        activePage: page,
        update: true
      })
    }
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
  
  //	Delete
	async deleteEl(slug){
		this.props.deleteTool(slug)
		.then(() => this.requestTools(true));
  }

    
  render() {
      const { tools } = this.props;
      if(!tools.data){
          return null
      }

      return (
        <section className="container-fluid">
          <h1 className="margin__bottom--30">Ferramentas</h1>

          <section className="tools__list margin__top--40">
            <Filters
                location={this.props.location}
                onFilterChange={this.onFilterChange}
                type="tools"
                taxonomies={this.props.taxonomies}
                className="margin__top--15"
                searchText={"Filtrar palavras"}
                />
            <h2 className="margin__bottom--30">{this.props.tools.total} {withPlural(this.props.tools.total, "resultado", "resultados")}</h2>

            {tools.fetching ?
              <p className="margin__top--30 margin__bottom--60">A carregar...</p>
            
            :
              !tools || !tools.data || tools.data.length==0 ?
                <p className="text-center margin__top--30 margin__bottom--60">Não foram encontrados resultados.</p>

            :
              <ToolsList 
                list={this.props.tools}
                onPageChange={this.onChangePage}
                activePage={this.state.activePage}
                otherData={this.props}
                deleteEl={this.deleteEl}
              />
            }
          </section>
      </section>
    )
  }    
}