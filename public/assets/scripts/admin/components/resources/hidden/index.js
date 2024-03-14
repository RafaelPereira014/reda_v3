import React, { Component } from 'react';

//  Utils
import { withPlural, scrollToTop } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import _ from 'lodash';

//  Components
import { Tabs, Tab } from '%/components/common/linkTabs';

import ResList from '%/components/resources/pending/list';
import ResListHidden from '%/components/resources/pending/listHidden';

import SearchContainer from '#/containers/search';
import AdvancedSearch from '#/containers/search/advancedSearch';

// Portals
import UndoPortal from '#/components/common/portals/undo';

export default class HiddenList extends Component{
    _isMounted = false;
    constructor(props) {
        super(props);

        this.scope = "pendentes";
        this.activeKey = "all";

        this.resetState = {
			activePage: 1,
			limit: 12,
			tags: [],
            filters: { terms: []},
            toApprove: false,
			showUndo: false,
            lastApprovalEl: null,
            openFilters: false,
            update: false
        }
        
        this.state = this.resetState;
        
        //
        //  Renders
        //        
        this.renderFilters = this.renderFilters.bind(this);

        //
        //  Event handlers
        //
        this.onPageChange = this.onPageChange.bind(this);
        this.setApprove = this.setApprove.bind(this);
        this.undoHidden = this.undoHidden.bind(this);
        this.undoApproval = this.undoApproval.bind(this);
        this.closeUndo = this.closeUndo.bind(this);
        this.toggleFilters = this.toggleFilters.bind(this);
        this.onTermsSubmit = this.onTermsSubmit.bind(this);
        this.onChangeTags = this.onChangeTags.bind(this);
        this.onRouteChanged = this.onRouteChanged.bind(this);

        //
        //  Helpers
        //
        this.requestResources = this.requestResources.bind(this);
        this.setActive = this.setActive.bind(this);
        
    }

    async componentDidMount() {
        this._isMounted = true;
        scrollToTop();

        const approval = this.setActive();

        let initialData = {
            activePage: this.state.activePage,
            limit: this.state.limit,
            tags: this.state.tags,
			order: this.state.order,
            filters: this.state.filters,
            approval
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
            await this.requestResources(false, initialData);
            this.setState(initialData);
    
            await this.props.fetchMessages(null, 'disapprove');
            setQueryString(initialData, {history: this.props.history}, this.props.location);
        }        
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.key !== prevProps.location.key && this.props.match.params.type!==prevProps.match.params.type) {            
            this.onRouteChanged();
            
        }else if(this.state.update &&
        this.props.location.pathname == prevProps.location.pathname &&
        this.props.location.key == prevProps.location.key && this._isMounted){
           
            this.requestResources(false);
            this.setState({update: false});

            setQueryString(this.state, {history: this.props.history}, this.props.location);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
		return this._isMounted && (nextProps.resources.fetched || nextState.update===true);
    }
    
    componentWillUnmount(){
        this._isMounted = false;
        this.props.resetResources();
        this.props.resetMessages();
    }

    setActive(){
        let approval = null;

        if(this.props.match.params && this.props.match.params.type){
            switch(this.props.match.params.type){
                case "cientificamente":
                    approval =  "scientific";
                    break;
                case "linguisticamente":
                    approval =  "linguistic";
                    break;
            }

            this.activeKey = approval;
        }

        if(approval){
            this.setState({approval});
        }

        return approval;
    }

    async onRouteChanged() {
        let approval = this.setActive();
        let initialData = {
            activePage: this.resetState.activePage,
            limit: this.resetState.limit,
            tags: this.resetState.tags,
            order: this.resetState.order,
            filters: this.resetState.filters,
            approval,
            update: true
        };

        if(this._isMounted){
            this.setState(initialData);
        }
    }

    //	Request new resources
	requestResources(reset=false, state = null){
        if(this._isMounted){
            let tempState = state || this.state;

            let initialData = {
                activePage: tempState.activePage,
                limit: tempState.limit,
                tags: tempState.tags,
                filters: tempState.filters,
                approval: tempState.approval
            };

            //Reset page?
            if (reset){
                initialData = {
                    activePage: this.resetState.activePage,
                    limit: this.resetState.limit,
                    tags: this.resetState.tags,
                    order: this.resetState.order,
                    filters: this.resetState.filters,
                    approval: tempState.approval
                };

                this.setState(initialData);
            }

            return this.props.fetchMyResources({ type: "hidden" }, initialData);
        }
	}

    onPageChange(page){
        if(page){
            this.setState({
                activePage: page,
                update: true
            })
        }
    }

    // Approve or not
	async setApprove(status, el, message, messagesList){
		await this.props.setApproved({status, message, messagesList}, el.id);
		this.requestResources(true);

		this.setState({
			lastApprovalEl: el,
			showUndo: true
		})
    }

    async undoHidden(el){

		await this.props.setHiddenUndo({}, el.id);
        this.requestResources(true);
		this.setState({
			lastApprovalEl: el,
		})

    }



    
    // Undo approval action
    undoApproval(){
		if (this.state.lastApprovalEl && this.state.showUndo){
			this.props.setApprovedUndo({
				approvedScientific: this.state.lastApprovalEl.approvedScientific,
				approvedLinguistic: this.state.lastApprovalEl.approvedLinguistic,
				approved: this.state.lastApprovalEl.approved,
				status: this.state.lastApprovalEl.status
			},
			this.state.lastApprovalEl.id)
			.then(() => this.requestResources(true));
	
			this.setState({
				lastApprovalEl:null,
				showUndo: false
			})
		}		
    }

    closeUndo(){
        this.setState({
            lastApprovalEl:null,
            showUndo: false
        })
    }

    toggleFilters(){
        this.setState({openFilters: !this.state.openFilters});
    }
    
    onTermsSubmit(terms){
        this.setState({
            filters: terms,
            update: true
        })
    }

    onChangeTags(tags){
        this.setState({
            tags,
            update: true
        })
    }
    
    renderFilters(){
		return(
			<div className="margin__bottom--30">
										
				{/*<SearchContainer key="search-container"
					submitOnUpdate={true}
					shouldInit={true}
					location={this.props.location}
					placeholder="Procurar recursos..."
					onSubmit={this.onChangeTags}
					/>


                <div className={"advanced-search__open text-right" + (this.state.openFilters ? " open" : "")}>
                    <button 
                        type="button" 
                        className="cta no-border no-bg" 
                        onClick={this.toggleFilters}
                    >																
                        Pesquisa avançada 
                        { this.state.openFilters ? <i className="fa fa-chevron-up margin__left--15"></i> : <i className="fa fa-chevron-down margin__left--15"></i>}
                    </button>
        </div>*/}

                {/*<AdvancedSearch
                    location={this.props.location}
                    open={this.state.openFilters}
                    toggleFilters={this.toggleFilters}
                    onSubmit={this.onTermsSubmit}
                    fetchFilters={{
                        type: "rec",
                        scope: this.activeKey==='scientific' ? 'toApproveScientific' : (this.activeKey==='linguistic' ? 'toApproveLinguistic' : 'pending'),
                        required: true
                    }}
                />*/}
			</div>
		)
	}
    
    render() {
        const { resources } = this.props;

        if(!resources.data){
            return null
        }

        return (
            <section className="container-fluid">
                <h1 className="margin__bottom--30">Recursos Ocultos</h1>
                <Tabs
                    activeKey={this.activeKey}
                    >
                    <Tab eventKey="all" title="Todos" link="/dashboard/recursos/ocultos">
                        Todos
                    </Tab>  
                </Tabs>

                <section className="resources__list margin__top--40">
                    {this.renderFilters()}
                    <h2 className="margin__bottom--30">{this.props.resources.total} {withPlural(this.props.resources.total, "resultado", "resultados")}</h2>
                    <ResListHidden
                        list={this.props.resources}
                        onPageChange={this.onPageChange}
                        activePage={this.state.activePage}
                        activeKey={this.activeKey}
                        setApprove={this.setApprove}
                        undoHidden={this.undoHidden}

                        disapproveMessages={this.props.messages}
                        />
                </section>
            </section>
        )
    }
    
}