import React, { Component, Fragment } from 'react';

//  Components
import TableView from '%/components/common/table'

//  Utils
import { withPlural, scrollToTop, setDateFormat } from '#/utils';
import { setQueryString, parseQS } from '#/utils/history';
import _ from 'lodash';

export default class UsersOverview extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    
    this.resetState = {
			activePage: 1,
			limit: 12,
      update: false
    }
        
    this.state = this.resetState;

    //
    //  Handlers
    //
    this.onPageChange = this.onPageChange.bind(this);

    //
    //  Helpers
    //
    this.requestData = this.requestData.bind(this);

    //
    //  Renders
    //
    this.renderList = this.renderList.bind(this);
  }
  
  async componentDidMount() {
    this._isMounted = true;
    scrollToTop();


    let initialData = {
      activePage: this.state.activePage,
      limit: this.state.limit
    };
        
        // Has queryString?
    if (this.props.location && this.props.location.search && !_.isEmpty(this.props.location.search)){
      const query = parseQS(this.props.location.search);

      const { pagina, limite } = query;
      
      initialData = {
          ...initialData,
          activePage: parseInt(pagina) || initialData.activePage,
          limit: parseInt(limite) || initialData.limit,
      };
    
    }
    if(this._isMounted){
      await this.requestData(false, initialData);
      this.setState(initialData);

      setQueryString(initialData, {history: this.props.history}, this.props.location);
    }        
  }

  componentDidUpdate(prevProps) {
    if(this.state.update &&
    this.props.location.pathname == prevProps.location.pathname &&
    this.props.location.key == prevProps.location.key && this._isMounted){
       
        this.requestData(false);
        this.setState({update: false});

        setQueryString(this.state, {history: this.props.history}, this.props.location);
    }
}

  shouldComponentUpdate(nextProps, nextState) {
    return this._isMounted && (nextProps.users.fetched || nextState.update===true);
  }

  componentWillUnmount(){
    this._isMounted = false;
    this.props.resetUsers();
  }

  requestData(reset = false, state = null){
    if(this._isMounted){
      let tempState = state || this.state;

      let initialData = {
          activePage: tempState.activePage,
          limit: tempState.limit,
      };

      //Reset page?
      if (reset){
          initialData = {
              activePage: this.resetState.activePage,
              limit: this.resetState.limit,
          };

          this.setState(initialData);
      }

      return this.props.searchMonthUsers(initialData);
    }
  }

  onPageChange(page){
    this.setState({
      activePage: page,
      update: true
    })
  }

  renderList(){
    const { props } = this;

    let header = [
      'Nome',
      'E-mail',
      'Organização',
      'Criado a',
      'Tipo de utilizador'
    ]

    return(
      <TableView
        data={props.users.data}
        header={header}
        responsive={true}
        tableClass="stripped"
        totalPages={props.users.totalPages}
        onPageChange={this.onPageChange}
        activePage={this.state.activePage}
        RenderRow={
          (
              {
                  el
              }
          ) => (
              <Fragment>
                  <td>
                      {el.name} <small><strong><em>(ID: {el.id})</em></strong></small>
                  </td>
                  <td>{el.email}</td>
                  <td>{el.organization}</td>
                  <td>{setDateFormat(el.created_at, "LLL")}</td>
                  <td>{el.Role.value}</td>
              </Fragment>
          )
        }
      />
    )
  }
  
  
  render() {
    const { users } = this.props;

    if( !users.data || users.data.length===0){
      return null;
    }

    return (
      <section className="container-fluid">
        <h1 className="margin__bottom--30">Novos utilizadores do mês</h1>
        <div className="row">
          {users.fetched && users.data && users.data.length>0 ?
						<div className="col-xs-12">
							<h2 className="margin__bottom--30">{users.total} {withPlural(users.total, "resultado", "resultados")}</h2>
                            
              {this.renderList()}
						</div>
					:
						<div className="row">
							<p className="text-center">Não foram encontrados resultados.</p>
						</div>
					}
				</div>
      </section>
    )
  }
}
