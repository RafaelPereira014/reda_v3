'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import { matchPath, NavLink } from 'react-router-dom';

//  Dynamic Breadcrumbs
import PureResourceBreadcrumb from '#/containers/breadcrumbs/resource';
import PureNewsBreadcrumb from '#/containers/breadcrumbs/news';


// Utils
import { isReactComponent } from '#/utils';
import { removeSpecialChars } from '#/utils';

// Routes object
const breadcrumbsRoutes = [
  { path: '/', breadcrumb: 'Início' },
  { path: '/recursos', breadcrumb: 'Recursos' },
  { path: '/recursos/detalhes-recurso/:resource', breadcrumb: PureResourceBreadcrumb },
  { path: '/aplicacoes', breadcrumb: 'Aplicações' },
  { path: '/ferramentas', breadcrumb: 'Ferramentas' },
  { path: '/dicasutilidades', breadcrumb: 'Dicas e Utilidades' },
  { path: '/ajuda', breadcrumb: 'Ajuda' },
  { path: '/noticias', breadcrumb: 'Publicações' },
  { path: '/noticias/:slug', breadcrumb: PureNewsBreadcrumb }
];

// If BREADCRUMB property was given a function, return it with the match result
const renderer = ({ breadcrumb: Breadcrumb, match }) => {
  if (isReactComponent(Breadcrumb)) { return <Breadcrumb /> }
  if (typeof Breadcrumb === 'function') { return Breadcrumb({ match }); }
  return Breadcrumb;
};

// Check for matches and return them
const getBreadcrumbs = ({ routes, pathname }) => {
  const matches = [];

  pathname
    .replace(/\/$/, '')
    .split('/')
    .reduce((previous, current) => {
      const pathSection = `${previous}/${current}`;

      let breadcrumbMatch;

      routes.some(({ breadcrumb, path }) => {
        const match = matchPath(pathSection, { exact: true, path });

        if (match) {
          breadcrumbMatch = {
            breadcrumb: renderer({ breadcrumb, match }),
            path,
            match,
          };
          return true;
        }

        return false;
      });

      if (breadcrumbMatch) {
        matches.push(breadcrumbMatch);
      }

      return pathSection;
    });

  return matches;
};


// HOC function
const withBreadcrumbs = routes => Component => props => (
  <Component
    {...props}
    breadcrumbs={
      getBreadcrumbs({
        pathname: props.location.pathname,
        routes,
      })
    }
  />
);

// Component
const AppBreadcrumbs = ({ breadcrumbs }) => {
  return (
    <div className="breadcrumbs-container">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <section className="breadcrumbs">
              <NavLink to="/">
                Início
              </NavLink>
              <span>&gt;</span>
              {console.log(breadcrumbs)}

              {breadcrumbs.map((item, index) => {



                return (
                  <span key={index}>
                    <NavLink to={item.match.url}>
                      {item.match.params.resource ? removeSpecialChars(item.match.params.resource) : item.breadcrumb}
                    </NavLink>


                    {index < breadcrumbs.length - 1 &&
                      <span>&gt;</span>
                    }
                  </span>

                )

              })


              }



            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

AppBreadcrumbs.propTypes = {
  location: PropTypes.object.isRequired,
  customClass: PropTypes.string
}

export default withBreadcrumbs(breadcrumbsRoutes)(AppBreadcrumbs);