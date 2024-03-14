'user strict';

import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';

// Routes
import { routesServer } from '%/routes/routes';

// App Wrapper
import MainWrapper from '%/wrappers';
import App from '%/layouts/app';

class Routes extends Component {
  constructor(props){
    super(props);

    
    this.printRoutes = this.printRoutes.bind(this);

    this.routeIdx = 0;
  }

  /**
   * Get routes configuration and print routes structure
   */
  printRoutes(routes, Parent = null){
    return routes.map(({ routes, path, exact, strict, component: Comp }) =>{

      if(routes){
        return this.printRoutes(routes, Comp);
      }else{
        return (
          <Route
            key={path}
            path={`${path}`}
            exact={exact}
            strict={strict}
            render={
              props => {
                if (Parent){
                  return (
                    <App {...props}>
                      <Parent {...props}>
                        <Comp {...props} />
                      </Parent>                      
                    </App>
                  )
                }else{
                  return (
                    <App {...props}>
                      <Comp {...props} />
                    </App>
                  )
                }
                
              }
            }
          />
        );
      }
    });      
  }

  // ...
  render(){
    return (
      <BrowserRouter>
        <MainWrapper>
          <Switch>
            {this.printRoutes(routesServer)}
          </Switch>
        </MainWrapper>
      </BrowserRouter>
    )
  }
}

export default withRouter(Routes);