"use strict";
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Wrappers
import App from '%/layouts/app';

//
// Pages
//
import IndexPage from '%/pages/indexPage';

//  Overview
import ResourcesOverview from '%/pages/overview/resources';
import AppsOverview from '%/pages/overview/apps';
import ToolsOverview from '%/pages/overview/tools';
import UsersOverview from '%/pages/overview/users';

//  Resources
import ResourcesPendingList from '%/pages/resources/pending';
import ScriptsPendingList from '%/pages/scripts/pending';
import ResourcesHiddenListPage from '%/pages/resources/hidden';

//  Apps
import AppsPendingList from '%/pages/apps/pending';
import AppsList from '%/pages/apps';

//  Tools
import ToolsPendingList from '%/pages/tools/pending';
import ToolsList from '%/pages/tools';

//  Comments
import CommentsPendingList from '%/pages/comments/pending';
import BadwordsList from '%/pages/comments/badwords';

//  Users
import UsersList from '%/pages/users';

//  Taxonomies
import TaxonomiesList from '%/pages/taxonomies';
import TaxonomyDetails from '%/pages/taxonomies/details';
import TaxonomyRels from '%/pages/taxonomies/relationships';

//  Messages
import MessagesList from '%/pages/messages';
import MessageDetails from '%/pages/messages/details';

//  News
import NewsList from '%/pages/news';
import NewsForm from '%/pages/news/form';

// Not found page
import NotFoundPage from '%/pages/notFoundPage'

// High Order Components
import { requireAuth } from '#/containers/auth/requireAuth';

/**
 * SET THIS FOR FRONT-END
 */

export default () => (
  <Switch>
    <App>
      <Switch>        
        <Route 
          path="/dashboard" 
          exact
          component={requireAuth(IndexPage, {
                roles: ['admin']
            })} />    

        <Route 
          path="/dashboard/resumo/recursos" 
          exact
          component={requireAuth(ResourcesOverview, {
                roles: ['admin']
            })} />   
        
        <Route 
          path="/dashboard/resumo/aplicacoes" 
          exact
          component={requireAuth(AppsOverview, {
                roles: ['admin']
            })} /> 

        <Route 
          path="/dashboard/resumo/ferramentas" 
          exact
          component={requireAuth(ToolsOverview, {
                roles: ['admin']
            })} /> 
          
        <Route 
          path="/dashboard/resumo/utilizadores" 
          exact
          component={requireAuth(UsersOverview, {
                roles: ['admin']
            })} /> 

        <Route 
          path="/dashboard/recursos/pendentes/:type" 
          exact
          component={requireAuth(ResourcesPendingList, {
                roles: ['admin']
            })} />

        <Route 
          path="/dashboard/recursos/pendentes" 
          component={requireAuth(ResourcesPendingList, {
                roles: ['admin']
            })} />  

            <Route
            path="/dashboard/recursos/ocultos"
            component={requireAuth(ResourcesHiddenListPage, {
                roles: ['admin']
            })} />




        <Route 
          path="/dashboard/recursos/po/pendentes/:type" 
          exact
          component={requireAuth(ScriptsPendingList, {
                roles: ['admin']
            })} />     

        <Route 
          path="/dashboard/recursos/po/pendentes" 
          component={requireAuth(ScriptsPendingList, {
                roles: ['admin']
            })} /> 

        <Route 
          path="/dashboard/aplicacoes" 
          exact
          component={requireAuth(AppsList, {
                roles: ['admin']
            })} />  

        <Route 
          path="/dashboard/aplicacoes/pendentes/:type" 
          exact
          component={requireAuth(AppsPendingList, {
                roles: ['admin']
            })} />     

        <Route 
          path="/dashboard/aplicacoes/pendentes" 
          component={requireAuth(AppsPendingList, {
                roles: ['admin']
            })} />   

        <Route 
          path="/dashboard/ferramentas" 
          exact
          component={requireAuth(ToolsList, {
                roles: ['admin']
            })} /> 

        <Route 
          path="/dashboard/ferramentas/pendentes/:type" 
          exact
          component={requireAuth(ToolsPendingList, {
                roles: ['admin']
            })} />     

        <Route 
          path="/dashboard/ferramentas/pendentes" 
          component={requireAuth(ToolsPendingList, {
                roles: ['admin']
            })} />   

        <Route 
          path="/dashboard/comentarios/pendentes" 
          component={requireAuth(CommentsPendingList, {
                roles: ['admin']
            })} />   
        <Route 
          path="/dashboard/comentarios/palavras" 
          component={requireAuth(BadwordsList, {
                roles: ['admin']
            })} />

        <Route 
          path="/dashboard/utilizadores" 
          component={requireAuth(UsersList, {
                roles: ['admin']
            })} />

        <Route 
          path="/dashboard/taxonomias/relacoes" 
          component={requireAuth(TaxonomyRels, {
                roles: ['admin']
            })} />

        <Route 
          path="/dashboard/taxonomias/criar" 
          component={requireAuth(TaxonomyDetails, {
                roles: ['admin']
            })} />

        <Route 
          path="/dashboard/taxonomias/:slug" 
          component={requireAuth(TaxonomyDetails, {
                roles: ['admin']
            })} />  

        <Route 
          path="/dashboard/taxonomias" 
          component={requireAuth(TaxonomiesList, {
                roles: ['admin']
            })} /> 

        <Route 
          path="/dashboard/mensagens/:resource" 
          component={requireAuth(MessageDetails, {
                roles: ['admin']
            })} />

        <Route 
          path="/dashboard/mensagens" 
          component={requireAuth(MessagesList, {
                roles: ['admin']
            })} />
        
        <Route 
          path="/dashboard/artigos" 
          exact
          component={requireAuth(NewsList, {
                roles: ['admin']
            })} /> 
        
        <Route 
          path="/dashboard/artigos/criar" 
          exact
          component={requireAuth(NewsForm, {
                roles: ['admin']
            })} />

        <Route 
          path="/dashboard/artigos/:slug"
          component={requireAuth(NewsForm, {
                roles: ['admin']
            })} /> 

        {/* //404 */}
        <Route component={NotFoundPage} />
      </Switch>
    </App>
  </Switch>
);

/**
 * SET THIS FOR SERVER
 */

export const routesServer = [  
  {
    path: "/dashboard",
    exact: true,
    component: requireAuth(IndexPage, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/resumo/recursos",
    exact: true,
    component: requireAuth(ResourcesOverview, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/resumo/aplicacoes",
    exact: true,
    component: requireAuth(AppsOverview, {
          roles: ['admin']
      })
  }, 
  {
    path: "/dashboard/resumo/ferramentas",
    exact: true,
    component: requireAuth(ToolsOverview, {
          roles: ['admin']
      })
  }, 
  {
    path: "/dashboard/resumo/utilizadores",
    exact: true,
    component: requireAuth(UsersOverview, {
          roles: ['admin']
      })
  }, 
  {
    path: "/dashboard/recursos/pendentes/:type",
    exact: true,
    component: requireAuth(ResourcesPendingList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/recursos/pendentes",
    component: requireAuth(ResourcesPendingList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/recursos/ocultos",
    component: requireAuth(ResourcesHiddenListPage, {
          roles: ['admin']
      })
  },

  {
    path: "/dashboard/recursos/po/pendentes/:type",
    exact: true,
    component: requireAuth(ScriptsPendingList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/recursos/po/pendentes",
    component: requireAuth(ScriptsPendingList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/aplicacoes",
    exact: true,
    component: requireAuth(AppsList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/aplicacoes/pendentes/:type",
    exact: true,
    component: requireAuth(AppsPendingList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/aplicacoes/pendentes",
    component: requireAuth(AppsPendingList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/ferramentas",
    exact: true,
    component: requireAuth(ToolsList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/ferramentas/pendentes/:type",
    exact: true,
    component: requireAuth(ToolsPendingList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/ferramentas/pendentes",
    component: requireAuth(ToolsPendingList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/comentarios/pendentes",
    component: requireAuth(CommentsPendingList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/comentarios/palavras",
    component: requireAuth(BadwordsList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/utilizadores",
    component: requireAuth(UsersList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/taxonomias/relacoes",
    component: requireAuth(TaxonomyRels, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/taxonomias/criar",
    component: requireAuth(TaxonomyDetails, {
          roles: ['admin']
      })
  },  
  {
    path: "/dashboard/taxonomias/:slug",
    component: requireAuth(TaxonomyDetails, {
          roles: ['admin']
      })
  }, 
  {
    path: "/dashboard/taxonomias",
    component: requireAuth(TaxonomiesList, {
          roles: ['admin']
      })
  }, 

  {
    path: "/dashboard/mensagens/:resource",
    component: requireAuth(MessageDetails, {
          roles: ['admin']
      })
  }, 
  {
    path: "/dashboard/mensagens",
    component: requireAuth(MessagesList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/artigos",
    exact: true,
    component: requireAuth(NewsList, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/artigos/criar",
    exact: true,
    component: requireAuth(NewsForm, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/artigos/:slug",
    component: requireAuth(NewsForm, {
          roles: ['admin']
      })
  },
  {
    path: "/dashboard/*",
    component: NotFoundPage
  }
];