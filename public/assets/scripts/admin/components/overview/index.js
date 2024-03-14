import React, { Component, Fragment } from 'react';

import moment from 'moment';

//  Utils
import { scrollToTop } from '#/utils';

//  Components
import OverviewItem from '%/components/overview/item';
import TableView from '%/components/common/table';
import { Link } from 'react-router-dom';

export default class Overview extends Component{
    constructor(props) {
        super(props)
        
        //
        //  Renders
        //
        this.renderResume = this.renderResume.bind(this);
        this.renderActiveUsers = this.renderActiveUsers.bind(this);
    }

    async componentDidMount() {
        scrollToTop();
        await this.props.fetchDashboardResume();
    }

    renderActiveUsers(){
        const { dashboard } = this.props;
        let thisMonth = moment().format('MMMM YYYY');

        let users = dashboard.data.thisMonthActiveUsers;

        if(!users || users.length==0)
            return null;

        users = users.map(user => [
            user.totalResources,
            user.name,
            user.email
        ]);

        return(
            <section className="container-fluid overview">
                <h1 className="margin__bottom--30">Utilizadores mais ativos - {thisMonth}</h1>   
                <TableView
                    data={users}
                    header={[
                        'Nº recursos',
                        'Nome',
                        'E-mail'
                    ]}
                    responsive={true}
                    tableClass="stripped"
                    />
            </section>
        )
    }

    renderResume(){
        const { dashboard } = this.props;
        let thisMonth = moment().format('MMMM YYYY');

        return (
            <section className="container-fluid overview">                
                <h1 className="margin__bottom--30">Resumo da REDA - {thisMonth}</h1>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-3">
                        {/* Resources this month */}
                        {dashboard.data.thisMonthResources>0 ? 
                            <Link to={'/dashboard/resumo/recursos'} title={`Novos recursos de ${thisMonth}`}>
                                <OverviewItem
                                    type="1"
                                    icon="far fa-list-alt"
                                    data={dashboard.data.thisMonthResources}
                                    label="novos recursos"/>
                            </Link>
                        :
                            <OverviewItem
                                type="1"
                                icon="far fa-list-alt"
                                data={dashboard.data.thisMonthResources}
                                label="novos recursos"/>
                        }
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3">
                        {/* Apps this month */}
                        {dashboard.data.thisMonthApps>0 ? 
                            <Link to={'/dashboard/resumo/aplicacoes'} title={`Novas aplicações de ${thisMonth}`}>
                                <OverviewItem
                                    type="2"
                                    icon="fas fa-mobile-alt"
                                    data={dashboard.data.thisMonthApps}
                                    label="novas aplicações"/>
                            </Link>
                        :
                            <OverviewItem
                                type="2"
                                icon="fas fa-mobile-alt"
                                data={dashboard.data.thisMonthApps}
                                label="novas aplicações"/>
                        }
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3">
                        {/* Tools this month */}
                        {dashboard.data.thisMonthTools>0 ? 
                            <Link to={'/dashboard/resumo/ferramentas'} title={`Novas ferramentas de ${thisMonth}`}>
                                <OverviewItem
                                    type="3"
                                    icon="fas fa-toolbox"
                                    data={dashboard.data.thisMonthTools}
                                    label="novas ferramentas"/>
                            </Link>
                        :
                            <OverviewItem
                                type="3"
                                icon="fas fa-toolbox"
                                data={dashboard.data.thisMonthTools}
                                label="novas ferramentas"/>
                        }
                        
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3">
                        {/* Users this month */}
                        {dashboard.data.thisMonthUsers>0 ? 
                            <Link to={'/dashboard/resumo/utilizadores'} title={`Novos utilizadores de ${thisMonth}`}>
                                <OverviewItem
                                    type="4"
                                    icon="fas fa-users"
                                    data={dashboard.data.thisMonthUsers}
                                    label="novos utilizadores"/>
                            </Link>
                        :
                            <OverviewItem
                                type="4"
                                icon="fas fa-users"
                                data={dashboard.data.thisMonthUsers}
                                label="novos utilizadores"/>
                        }                        
                    </div>
                </div>                
            </section>
        )
    }
    
    render() {
        const { dashboard } = this.props;

        if(!dashboard.data){
            return null
        }

        return (
            <Fragment>
                {this.renderResume()}
                {this.renderActiveUsers()}
            </Fragment>
        )
    }
    
}