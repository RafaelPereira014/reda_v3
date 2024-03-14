import React, { Component } from 'react';

// Components
import Dropdown from '#/components/common/dropdown';
import ConfirmDelete from '#/components/common/deleteSingle';
import UserSearch from '#/components/dashboard/users/search/searchForm';

// Bootstrap
import Pagination from 'react-bootstrap/lib/Pagination';

// Utils
import { scrollToTop } from '#/utils';
import { setQueryString } from '#/utils/history';

export default class UsersList extends Component{
	constructor(props){
		super(props);

		this.initialState = {
			activePage: 1,
			forceUpdate: false
		}

		this.state = this.initialState;

		//
		//	Renders
		//
		this.renderUsersList = this.renderUsersList.bind(this); 

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
		this.props.searchUsers(this.state);
		!roles.fetched && this.props.fetchRoles();
	}

	componentDidUpdate(prevProps, prevState) {
		const { activePage } = this.state;

		// Request new resources if there is any change
		if (JSON.stringify(prevState) !== JSON.stringify(this.state)){

			this.requestNewData();

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
		return nextProps.users.fetched;
	}

	// Request new data on update
	requestNewData(reset){
		this.props.searchUsers(reset ? this.initialState : this.state);
	}

	// Pagination page change
	onChangePage(page) {
		if (page){
			this.setState({
				activePage: page
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
			activePage: this.initialState.activePage
		});
	}

	renderUsersList(){
		const { users, roles, auth } = this.props;

		if (users && users.data && users.data.result.length>0){
			return(
				<div className="table-responsive user-list">
					<table className="table table-striped">
						<thead>
							<tr>
								<th>Nome</th>
								<th>E-mail</th>
								<th>Organização</th>
								<th>Tipo de utilizador</th>
							</tr>
						</thead>
						<tbody>
							{users.data.result.map(user => {
								return (
									<tr key={user.id}>
										<td>{user.name || (user.Registration && user.Registration.name) || null}</td>
										<td>{user.email || null}</td>
										<td>{user.organization || (user.Registration && user.Registration.department) || null}</td>
										<td style={{minWidth: '120px'}}>
											{user.id!=auth.data.user.id && roles.data && roles.data.length>0 ? 
												<Dropdown
													list={roles.data}
													listValue="type"
													listTitle="value"
													startValue={user.Role.type}
													onChange={this.onDropdownChange}
													onChangeParams={{userId: user.id}}
												/>
												:
												<span className="text-center">{user.Role.value}</span>
											}
										</td>
										<td>
											<ConfirmDelete
												item={user.id}
												deleteSingle={this.deleteUser}
												className="cta primary no-bg small delete-action"
												title="Remover utilizador"
											>
												<i className="fa fa-close"></i> 
											</ConfirmDelete>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			)
		}
	}

	render(){
		const { fetched, fetching, data } = this.props.users;
		const { data:roles } = this.props.roles;

		if (!fetched && fetching)
			return (
				<div className="users__page">
					<div className="row">
						<div className="col-xs-12">
							<h2 className="pannel-title">Gerir utilizadores da plataforma</h2>
						</div>
					</div>
					<div className="row">
						<p className="text-center">A carregar...</p>
					</div>
				</div>
			);

		return (
			<div className="users__page">
				<div className="row">
					<div className="col-xs-12">
						<h2 className="pannel-title">Gerir utilizadores da plataforma</h2>
					</div>
				</div>
				<div className="row">
					{ roles && roles.length>0 &&
						<div className="col-xs-12">
							<UserSearch 
								roles={roles}
								onSearch={this.onSearch}
							/>
						</div>
					}
					{fetched && data && data.result && data.result.length>0 ?
						<div className="col-xs-12">
							<h6 className="border-bottom">{data.total} resultados</h6>
							{this.renderUsersList()}

							{/* Pagination */}
							{(() => {
								if (data.totalPages>1){
									return <Pagination
										prev
										next
										first
										last
										ellipsis
										boundaryLinks
										items={data.totalPages}
										maxButtons={5}
										activePage={this.state.activePage}
										onSelect={this.onChangePage} />
								}
							})()}
						</div>
					:
						<div className="row">
							<p className="text-center">Não foram encontrados resultados.</p>
						</div>
					}
				</div>
			</div>
		)
	}
}