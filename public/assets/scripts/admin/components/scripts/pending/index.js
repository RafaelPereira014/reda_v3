import React, { Component } from 'react';

//  Utils
import { withPlural, scrollToTop } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import _ from 'lodash';

//  Components
import { Tabs, Tab } from '%/components/common/linkTabs';

import ScriptsList from '%/components/scripts/pending/list';

import SearchContainer from '#/containers/search';
import AdvancedSearch from '#/containers/search/advancedSearch';

// Portals
import UndoPortal from '#/components/common/portals/undo';

export default class ScriptsPendingList extends Component{
    _isMounted = false;

    constructor(props) {
        super(props);

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
        this.undoApproval = this.undoApproval.bind(this);
        this.closeUndo = this.closeUndo.bind(this);
        this.toggleFilters = this.toggleFilters.bind(this);
        this.onTermsSubmit = this.onTermsSubmit.bind(this);
        this.onChangeTags = this.onChangeTags.bind(this);
        this.onRouteChanged = this.onRouteChanged.bind(this);

        //
        //  Helpers
        //
        this.requestScripts = this.requestScripts.bind(this);
        this.setActive = this.setActive.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;
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
            
            await this.requestScripts(false, initialData);
            this.setState(initialData);
    
            /* await this.props.fetchMessages(null, 'disapprove', 'scripts'); */
            setQueryString(initialData, {history: this.props.history}, this.props.location);
        }
        scrollToTop();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.key !== prevProps.location.key && this.props.match.params.type!==prevProps.match.params.type) {
            this.onRouteChanged();
            
        }else if(this.state.update &&
        this.props.location.pathname == prevProps.location.pathname &&
        this.props.location.key == prevProps.location.key){
            this.requestScripts();
            this.setState({update: false})

            setQueryString(this.state, {history: this.props.history}, this.props.location);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
		return this._isMounted && (nextProps.scripts.fetched || nextState.update===true);
    }

    componentWillUnmount(){
        this._isMounted = false;
        this.props.resetScripts();
    }

    setActive(update = true){
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

        if(approval && update){
            this.setState({approval});
        }

        return approval;
    }

    onRouteChanged() {
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
            this.setState(initialData)
        }
    }
    
    //	Request new scripts
	requestScripts(reset = false, state = null){
        if(this._isMounted){
            let tempState = state || this.state;
            
            let initialData = {
                activePage: tempState.activePage,
                limit: tempState.limit,
                tags: tempState.tags,
                order: tempState.order,
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

            this.props.fetchPending(initialData);
        }
    }

    onPageChange(page){
        if(page){
            this.setState({activePage: page, update: true})
        }
    }

    // Approve or not
	async setApprove(status, el, message, messagesList){
		await this.props.setApproved({status, message, messagesList}, el.id);
		this.requestScripts(true);

		this.setState({
			lastApprovalEl: el,
            showUndo: true,
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
			.then(() => this.requestScripts(true));
	
			this.setState({
				lastApprovalEl:null,
                showUndo: false,
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
            activePage: 1,
            filters: terms,
            update: true
        })
    }

    onChangeTags(tags){
        this.setState({
            activePage: 1,
            tags,
            update: true
        })
    }

    renderFilters(){
        let approval = this.setActive(false);
		return(
			<div className="margin__bottom--30">
										
				<SearchContainer key="search-container"
					submitOnUpdate={true}
					shouldInit={true}
					location={this.props.location}
					placeholder="Procurar propostas..."
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

                    
                </div>

                <AdvancedSearch
                    location={this.props.location}
                    open={this.state.openFilters}
                    toggleFilters={this.toggleFilters}
                    onSubmit={this.onTermsSubmit}
                    fetchFilters={{
                        type: "scripts",
                        scope: approval==='scientific' ? 'toApproveScientific' : (approval==='linguistic' ? 'toApproveLinguistic' : 'pending'),
                        required: true
                    }}
                    />
			</div>
		)
	}
    
    render() {
        return (
            <section className="container-fluid">
                <h1 className="margin__bottom--30">Propostas de operacionalização pendentes de aprovação</h1>
                <UndoPortal 
					open={this.state.showUndo}
					onUndo={this.undoApproval}
                    close={this.closeUndo}
				/>

                <Tabs
                    activeKey={this.activeKey}
                    >
                    <Tab eventKey="all" title="Todos" link="/dashboard/recursos/po/pendentes">
                        Todos
                    </Tab>
                    <Tab eventKey="scientific" title="Científica" link="/dashboard/recursos/po/pendentes/cientificamente">
                        Científica
                    </Tab>
                    <Tab eventKey="linguistic" title="Linguística" link="/dashboard/recursos/po/pendentes/linguisticamente">
                        Linguística
                    </Tab>
                </Tabs>

                <section className="scripts__list margin__top--40">
                    {this.renderFilters()}
                    <h2 className="margin__bottom--30">{this.props.scripts.total} {withPlural(this.props.scripts.total, "resultado", "resultados")}</h2>
                    <ScriptsList 
                        list={this.props.scripts}
                        onPageChange={this.onPageChange}
                        activePage={this.state.activePage}
                        activeKey={this.activeKey}
                        setApprove={this.setApprove}
                        disapproveMessages={this.props.messages}
                        config={this.props.config}
                        />
                </section>
            </section>
        )
    }
    
}