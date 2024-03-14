import React, { Component } from 'react';

//  Utils
import { withPlural, scrollToTop } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import _ from 'lodash';

//  Components
import { Tabs, Tab } from '%/components/common/linkTabs';

import AppsList from '%/components/apps/pending/list';

import Filters from '#/containers/filters/filtersGeneric';

// Portals
import UndoPortal from '#/components/common/portals/undo';

export default class AppsPendingList extends Component{
    _isMounted = false;
    constructor(props) {
        super(props);

        this.scope = "pendentes";
        this.activeKey = "all";

        this.resetState = {
			activePage: 1,
			limit: 12,
			tags: [],
            filters: {
                terms: []
            },
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

        //
        //  Event handlers
        //
        this.onPageChange = this.onPageChange.bind(this);
        this.setApprove = this.setApprove.bind(this);
        this.undoApproval = this.undoApproval.bind(this);
        this.closeUndo = this.closeUndo.bind(this);
        this.toggleFilters = this.toggleFilters.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.onRouteChanged = this.onRouteChanged.bind(this);

        //
        //  Helpers
        //
        this.requestApps = this.requestApps.bind(this);
        this.setActive = this.setActive.bind(this);
        this.getTaxList = this.getTaxList.bind(this);
    }

    async componentDidMount() {
        scrollToTop();

        const approval = this.setActive();
        this._isMounted = true;

        this.getTaxList();

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
            await this.requestApps(false, initialData);
            this.setState(initialData);
    
            /* await this.props.fetchMessages(null, 'disapprove'); */
            setQueryString(initialData, {history: this.props.history}, this.props.location);
        } 
    }

    componentDidUpdate(prevProps) {
        if(this._isMounted){
            if (this.props.location !== prevProps.location  && this.props.match.params.type!==prevProps.match.params.type) {
                this.onRouteChanged();
            }else if(this.state.update &&
            this.props.location.pathname == prevProps.location.pathname &&
            this.props.location.key == prevProps.location.key){
                this.requestApps();
                this.setState({update: false})

                setQueryString(this.state, {history: this.props.history}, this.props.location);
            }
        }
        
    }

    shouldComponentUpdate(){
        return this._isMounted;
    }

    componentWillUnmount(){
        this._isMounted = false;
        this.props.resetApps();
    }

    async getTaxList(){
        if(this._isMounted){
            const approval = this.setActive(false);

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
                    value: approval==='scientific' ? 'toApproveScientific' : (approval==='linguistic' ? 'toApproveLinguistic' : 'pending')
                }
            ]       
            

            this.props.fetchTaxonomies(fetchFilters, true);
        }
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
            activePage: this.state.activePage,
            limit: this.state.limit,
            tags: this.state.tags,
			order: this.state.order,
            filters: this.state.filters,
            approval,
            update: true
        };
        
        if(this._isMounted){
            this.setState(initialData);
        }

        this.getTaxList();
    }

    //	Request new resources
	requestApps(reset, state = null){

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
            this.setState({
                activePage: page,
                update: true
            })
        }
    }

    // Approve or not
	setApprove(status, el, message, messagesList){
		this.props.setApproved({status, message, messagesList}, el.id)
		.then(() => this.requestApps(true));

		this.setState({
			lastApprovalEl: el,
			showUndo: true
		})
    }

        // Approve or not
	setHidden(el){
		this.props.setHiddenUndo(el.id);

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
			.then(() => this.requestApps(true));
	
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

    
    render() {
        const { apps } = this.props;
        if(!apps.data){
            return null
        }

        if (apps.fetching){
			return <p className="margin__top--30 margin__bottom--60">A carregar...</p>;
		}

		if(!apps || !apps.data || apps.data.length==0){
			return <p className="text-center margin__top--30 margin__bottom--60">Não foram encontrados resultados.</p>;
		}

        return (
            <section className="container-fluid">
                <h1 className="margin__bottom--30">Aplicações pendentes de aprovação</h1>
                <UndoPortal 
					open={this.state.showUndo}
					onUndo={this.undoApproval}
                    close={this.closeUndo}
				/>
                <Tabs
                    activeKey={this.activeKey}
                    >
                    <Tab eventKey="all" title="Todos" link="/dashboard/aplicacoes/pendentes">
                        Todos
                    </Tab>
                    <Tab eventKey="scientific" title="Científica" link="/dashboard/aplicacoes/pendentes/cientificamente">
                        Científica
                    </Tab>
                    <Tab eventKey="linguistic" title="Linguística" link="/dashboard/aplicacoes/pendentes/linguisticamente">
                        Linguística
                    </Tab>
                </Tabs>

                <section className="apps__list margin__top--40">
                    <Filters
                        location={this.props.location}
                        onFilterChange={this.onFilterChange}
                        type="apps"
                        taxonomies={this.props.taxonomies}
                        className="margin__top--15"
                        searchText={"Filtrar palavras"}
                        />
                    <h2 className="margin__bottom--30">{this.props.apps.total} {withPlural(this.props.apps.total, "resultado", "resultados")}</h2>
                    <AppsList 
                        list={this.props.apps}
                        onPageChange={this.onPageChange}
                        activePage={this.state.activePage}
                        activeKey={this.activeKey}
                        setApprove={this.setApprove}
                        setHidden={this.setHidden}
                        disapproveMessages={this.props.messages}
                        />
                </section>
            </section>
        )
    }
    
}