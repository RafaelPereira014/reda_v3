import React, { Component } from 'react';

// Components
import List from '%/components/users/list';
import UserSearch from '#/components/dashboard/users/search/searchForm';

// Utils
import { scrollToTop, withPlural } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import Loader from '../../../utils/loader';

export default class UsersList extends Component{
    _isMounted = false;
	constructor(props){
		super(props);

		this.resetState = {
            activePage: 1,
            limit:12, 
            term: '',
            role: [],
			forceUpdate: false
		}

		this.state = this.resetState;

		//
		//	Renders
		//

		//
		//	Event Handlers
		//
		this.onChangePage = this.onChangePage.bind(this);
		this.onDropdownChange = this.onDropdownChange.bind(this);
		this.requestNewData = this.requestNewData.bind(this);
		this.deleteUser = this.deleteUser.bind(this);
		this.onSearch = this.onSearch.bind(this);
	}

	componentDidMount() {
        const { roles } = this.props;
		this._isMounted = true;
		
		scrollToTop();
		
		!roles.fetched && this.props.fetchRoles();

		let initialData = this.resetState;
		
		// Has queryString?
		if (this.props.location && this.props.location.search && !_.isEmpty(this.props.location.search)){
			const query = parseQS(this.props.location.search);


			const { pagina, termo, tipo_utilizador } = query;
			
			initialData = {
				...initialData,
				activePage: parseInt(pagina) || initialData.activePage,
				term: termo && termo.length>0 ? termo : initialData.term,
				role: tipo_utilizador && tipo_utilizador.length>0 ? tipo_utilizador : initialData.role,
				limit: (query && query.limite && parseInt(query.limite)) || initialData.limit,
			};
			
		}

        if(this._isMounted){
            this.props.searchUsers(initialData);

            this.setState(initialData);

            setQueryString(initialData, {history: this.props.history}, this.props.location);
        }
        
	}

	componentDidUpdate(prevProps, prevState) {
		const { activePage } = this.state;

		// Request new resources if there is any change
		if (JSON.stringify(prevState) !== JSON.stringify(this.state) || this.state.forceUpdate){

             this.requestNewData();
             this.setState({forceUpdate: false})

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
		return nextProps.users.fetched || this.state.forceUpdate;
    }
    
	componentWillUnmount(){
			this._isMounted = false;
	}

	// Request new data on update
	requestNewData(reset){
		this._isMounted && this.props.searchUsers(reset ? this.initialState : this.state);
	}

	// Pagination page change
	onChangePage(page) {
		if (page){
			this.setState({
                activePage: page,
                forceUpdate: true
			});
		}
    }

    // Dropdown change
    onDropdownChange(evt, data){
		if (evt.target.value && evt.target.value.length>0){
			this.props.setRole(
				{
					type: evt.target.value
				},
				data.userId
			)
		}	
	}

    // Delete user
    deleteUser(userId){
		this.props.deleteUser(userId)
		.then(() => this.requestNewData(true));
    }

    // On search submit
    onSearch(filters){
		this.setState({
			term: filters.term,
			role: filters.role,
			activePage: this.resetState.activePage
		});
    }

	render(){
		const { users } = this.props;
		const { data:roles } = this.props.roles;

		if (!users.fetched && users.fetching)
			return (
				<div className="users__page">
					<div className="row">
						<div className="col-xs-12">
							<h1 className="margin__bottom--30">Gestão de utilizadores</h1>
						</div>
					</div>





<Loader />


				</div>
			);

		return (
			<div className="users__page">
				<div className="row">
					<div className="col-xs-12">
						<h1 className="margin__bottom--30">Gestão de utilizadores</h1>
					</div>
				</div>
				<div className="row">
					{ roles && roles.length>0 &&
						<div className="col-xs-12">
							<UserSearch 
								roles={roles}
								onSearch={this.onSearch}
                location={this.props.location}
							/>
						</div> 
					}
					{users.fetched && users.data && users.data.length>0 ?
						<div className="col-xs-12">
							<h2 className="margin__bottom--30">{users.total} {withPlural(users.total, "resultado", "resultados")}</h2>
                            
							<List 
									list={this.props.users}
									onPageChange={this.onChangePage}
									activePage={this.state.activePage}
									otherData={this.props}
									events={{
											onDropdownChange: this.onDropdownChange,
											deleteUser: this.deleteUser
									}}
							/>
						</div>
					:

	 
					
				 <Loader />
		 
			   

					}
				</div>
			</div>
		)
	}
}