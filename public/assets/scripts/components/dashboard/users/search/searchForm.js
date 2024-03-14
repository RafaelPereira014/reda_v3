import React, { Component } from 'react';

//	Components
import Dropdown from '#/components/common/dropdown';

// Utils
import _ from 'lodash';
import { parseQS } from '#/utils/history';

export default class UsersSearch extends Component{
	constructor(props){
		super(props);

		this.resetState = {
			term: "",
			role: "",
			submitForm: false,
			update: false
		}

		this.state = this.resetState;
	
		//
		//	Renders
		//

		//
		//	Event handlers
		//
		this.onRoleChange = this.onRoleChange.bind(this);
		this.onTermChange = this.onTermChange.bind(this);
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.clearAll = this.clearAll.bind(this);
	}

	componentDidMount(){

		// Has queryString?
		if (this.props.location && this.props.location.search && !_.isEmpty(this.props.location.search)){
			const query = parseQS(this.props.location.search);


            const { termo, tipo_utilizador } = query;
            
            const initialData = {
                term: termo && termo.length>0 ? termo : this.resetState.term,
				role: tipo_utilizador && tipo_utilizador.length>0 ? tipo_utilizador : this.resetState.role,
				update: true
			};
			this.setState(initialData);
			
        }
	}

	componentDidUpdate(prevProps, prevState) {
		if (JSON.stringify(prevState) != JSON.stringify(this.state) || this.state.update || this.state.submitForm){

			if(this.state.submitForm){
				this.onFormSubmit(null);
			}

			this.setState({
				update:false,
				submitForm: false
			})
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.submitForm!=this.state.submitForm || nextState.update!=this.state.update || nextState.submitForm || nextState.update
	}

	//	On role select change
	onRoleChange(evt){
		this.setState({
			role: evt.target.value,
			update: true,
		})
	}

	//	On term change
	onTermChange(evt){
		this.setState({
			term: evt.target.value,
			update: true,
		});
	}

	//	Submit form
	onFormSubmit(evt){
		if (evt)
			evt.preventDefault();

		this.props.onSearch(this.state);
	}

	clearAll(){
		let newState = this.resetState;

		newState = {
			...newState,
			submitForm: true
		}

		this.setState(newState);
	}

	render(){
		const { 
			roles,
			buttonText,
			iconClass
		} = this.props;

		return(
			<section className="search-container">
				<form className="input-group search-form" onSubmit={this.onFormSubmit}>
					<div className="row">
						<div className={"col-xs-12 col-sm-4 col-md-4"}>
							<input type="text" className="form-control" value={this.state.term} onChange={this.onTermChange} placeholder="Nome de utilizador ou e-mail"/>
						</div>
							
						<div className={"col-xs-12 col-sm-4 col-md-4"}>
							<Dropdown
								list={roles}
								listValue="type"
								listTitle="value"
								startValue={this.state.role}
								defaultOption="Tipos de utilizador"
								onChange={this.onRoleChange}
							/>
						</div>
						<div className={"col-xs-12 col-sm-4 col-md-4"}>
							<button type="submit" className="cta primary">
								<i className={iconClass || "fa fa-search"} aria-hidden="true"></i>
								{buttonText || "Pesquisar"}
							</button>
						</div>
					</div>

					<div className="row">
						<div className="col-xs-12 filters__list--clear">
							<button className="cta primary outline " onClick={this.clearAll}>Limpar Filtros</button>
						</div>
					</div>
				</form>
			</section>
		)
	}
}