import React, { Component } from 'react';

//  Utils
import { withPlural, scrollToTop } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import _ from 'lodash';

//  Components
import { Tabs, Tab } from '%/components/common/linkTabs';

import ToolsList from '%/components/tools/pending/list';

import Filters from '#/containers/filters/filtersGeneric';

// Portals
import UndoPortal from '#/components/common/portals/undo';

export default class ToolsPendingList extends Component{
    _isMounted = false;

    constructor(props) {
        super(props);

        this.scope = "pendentes";
        this.activeKey = "all";

        this.resetState = {
			activePage: 1,
			limit: 12,
			tags: [],
			order: "recent",
            filters: { terms: [] },
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
        this.requestTools = this.requestTools.bind(this);
        this.setActive = this.setActive.bind(this);
        this.getTaxList = this.getTaxList.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;
        scrollToTop();

        const approval = this.setActive();

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
            await this.requestTools(false, initialData);
            this.setState(initialData);
    
            /* await this.props.fetchMessages(null, 'disapprove'); */
            setQueryString(initialData, {history: this.props.history}, this.props.location);
        } 

    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location && this.props.match.params.type!==prevProps.match.params.type) {
            this.onRouteChanged();
        }else if(this.state.update &&
        this.props.location.pathname == prevProps.location.pathname &&
        this.props.location.key == prevProps.location.key){
            this.requestTools();
            this.setState({update: false});

            setQueryString(this.state, {history: this.props.history}, this.props.location);
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
        this.props.resetTools();
    }

    async getTaxList(){

        const approval = this.setActive();
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
                value: approval==='scientific' ? 'toApproveScientific' : (approval==='linguistic' ? 'toApproveLinguistic' : 'pending')
            }
        ]       
        

        this.props.fetchTaxonomies(fetchFilters, true);
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

        this.getTaxList();
    }

    //	Request new resources
	async requestTools(reset = false, state = null){
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

		await this.props.fetchPending(initialData);

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
		await this.props.setApproved({status, message, messagesList}, el.id)
		this.requestTools(true);

		this.setState({
			lastApprovalEl: el,
			showUndo: true
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
			.then(() => this.requestTools(true));
	
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
        const { tools } = this.props;
        if(!tools.data){
            return null
        }

        return (
            <section className="container-fluid">
                <h1 className="margin__bottom--30">Ferramentas pendentes de aprovação</h1>
                <UndoPortal 
					open={this.state.showUndo}
					onUndo={this.undoApproval}
                    close={this.closeUndo}
				/>
                <Tabs
                    activeKey={this.activeKey}
                    >
                    <Tab eventKey="all" title="Todos" link="/dashboard/ferramentas/pendentes">
                        Todos
                    </Tab>
                    <Tab eventKey="scientific" title="Científica" link="/dashboard/ferramentas/pendentes/cientificamente">
                        Científica
                    </Tab>
                    <Tab eventKey="linguistic" title="Linguística" link="/dashboard/ferramentas/pendentes/linguisticamente">
                        Linguística
                    </Tab>
                </Tabs>

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
                    <ToolsList 
                        list={this.props.tools}
                        onPageChange={this.onPageChange}
                        activePage={this.state.activePage}
                        activeKey={this.activeKey}
                        setApprove={this.setApprove}
                        disapproveMessages={this.props.messages}
                        />
                </section>
            </section>
        )
    }
    
}