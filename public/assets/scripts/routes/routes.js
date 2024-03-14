"use strict";
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Pages
import App from '#/layouts/app';
import Empty from '#/layouts/empty';

// Pages
import IndexPage from '#/pages/indexPage';

// Resources
import DiscoverPage from '#/pages/resources/discoverPage';
import ResourceDetailsPage from '#/pages/resources/resourceDetailsPage';
import MyResourcesDashboardPage from '#/pages/resources/myResourcesDashboardPage';
import NewResourcePage from '#/pages/resources/newResourcePage';

// Scripts
import NewScriptPage from '#/pages/scripts/newScriptPage';
import NewSingleScriptPage from '#/pages/scripts/newSingleScriptPage';
import MyScriptsDashboardPage from '#/pages/scripts/myScriptsDashboardPage';
import PendingScriptsDashboardPage from '#/pages/scripts/myScriptsDashboardPage';

// Auth
import SignupFormPage from '#/pages/auth/signupFormPage';
import SignupConfirmPage from '#/pages/auth/signupConfirm';
import RecoverPasswordPage from '#/pages/auth/recoverPassword';
import SubmitPasswordRecoverPage from '#/pages/auth/submitRecover';

// Apps
import AppsDashboardPage from '#/pages/apps/appsDashboardPage';
import AppsPage from '#/pages/apps/appsPage';
import NewAppPage from '#/pages/apps/newAppPage';

// Tools
import ToolsDashboardPage from '#/pages/tools/toolsDashboardPage';
import ToolsPage from '#/pages/tools';
import NewToolPage from '#/pages/tools/newToolPage';

// User
import ProfileDashboardPage from '#/pages/user/profileDashboardPage';

// Users management
import UsersManageDashboardPage from '#/pages/user/usersManageDashboardPage';

// Comments
import CommentsDashboardPage from '#/pages/comments/commentsDashboardPage';

// Messages
import MessagesDashboardPage from '#/pages/messages/messagesDashboardPage';
import MessagesDetailsDashboardPage from '#/pages/messages/messagesDetailsDashboardPage';

// About
import AboutPage from '#/pages/about/aboutPage';

// Help
import HelpPage from '#/pages/help';

// News
import NewsPage from '#/pages/news';
import NewsDetailsPage from '#/pages/news/details';

// Others
import NotFoundPage from '#/pages/notFoundPage';
import FeedbackPage from '#/pages/generic/feedbackPage';
import TermsPage from '#/pages/terms/termsPage';
import TechFilePage from '#/pages/generic/techPage';
import PrivacyPolicy from '#/pages/generic/privacyPolicy';

// High Order Components
import { requireAuth } from '#/containers/auth/requireAuth';
import { resetAll } from '#/containers/filters/resetAll';

/**
 * SET THIS FOR FRONT-END
 */

export default () => (
  <Switch>
    <App>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route exact path="/recursos" component={DiscoverPage} />

        <Route path="/aplicacoes" component={AppsPage} />
        <Route path="/ferramentas" component={ToolsPage} />

        {/* User specific  */}
        <Route path="/registar" component={resetAll(SignupFormPage)} />   
        <Route path="/perfil" component={requireAuth(ProfileDashboardPage)} />
        <Route path="/registo/:token" component={resetAll(SignupConfirmPage)} />  

        {/* DASHBOARD  */}
        {/* Resources and scripts  */}
        <Route 
          path="/novorecurso" 
          component={requireAuth(NewResourcePage, {
                roles: ['admin', 'teacher', 'editor']
            })} />
        <Route 
          path="/editarrecurso/:resource" 
          component={requireAuth(NewResourcePage, {
              roles: ['admin', 'teacher', 'editor']
          })} />
        <Route 
          path="/gerirpropostas/:resource" 
          component={requireAuth(NewScriptPage, {
              roles: ['admin', 'teacher', 'editor']
          })} />
        <Route 
          path="/novaproposta/:resource" 
          component={requireAuth(NewSingleScriptPage, {
              roles: ['admin', 'teacher', 'editor']
          })} />
        <Route 
          path="/editarproposta/:script" 
          component={requireAuth(NewSingleScriptPage, {
              roles: ['admin', 'teacher', 'editor']
          })} />

        {/* Apps */}
        <Route 
          path="/novaaplicacao" 
          component={requireAuth(NewAppPage, {
              roles: ['admin', 'teacher', 'editor']
          })} />
        <Route 
          path="/editarapp/:app" 
          component={requireAuth(NewAppPage, {
              roles: ['admin', 'teacher', 'editor']
          })} />

        {/* Tools */}
        <Route 
          path="/novaferramenta" 
          component={requireAuth(NewToolPage, {
              roles: ['admin', 'teacher', 'editor']
          })} />

        <Route 
          path="/editarferramenta/:tool" 
          component={requireAuth(NewToolPage, {
              roles: ['admin', 'teacher', 'editor']
          })} />

        {/* About */}
        <Route path="/sobre" component={AboutPage} />

        {/* Help */}
        <Route path="/ajuda" component={HelpPage} />

        {/* News */}
        <Route path="/noticias" component={NewsPage} />
        <Route path="/noticias/:slug" component={NewsDetailsPage} />

        {/* Password */}
        <Route path="/recuperarpalavrapasse/:token" component={SubmitPasswordRecoverPage} />
        <Route path="/recuperarpalavrapasse" component={RecoverPasswordPage} />        

        <Route path="/faleconnosco" component={resetAll(FeedbackPage)} />
        <Route path="/termosecondicoes" component={resetAll(TermsPage)} />
        <Route path="/fichatecnica" component={TechFilePage} />
        <Route path="/politica-privacidade" component={PrivacyPolicy} />

        <Empty>
          <Switch>
            <Route path="/recursos/detalhes-recurso/:resource" component={ResourceDetailsPage} />

            <Route
              path="/painel/utilizadores"
              component={requireAuth(UsersManageDashboardPage, {
                roles: ['admin']
              })} />   
            <Route 
              path="/painel/meusrecursos/:type" 
              component={requireAuth(MyResourcesDashboardPage)} /> 
            <Route 
              path="/painel/meusrecursos" 
              component={requireAuth(MyResourcesDashboardPage, {
                roles: ['admin', 'teacher', 'editor']
              })} />
            <Route 
              path="/painel/minhaspropostas" 
              component={requireAuth(MyScriptsDashboardPage, {
                roles: ['admin', 'teacher', 'editor']
              })} /> 
            <Route 
              path="/painel/mensagens/:resource" 
              component={requireAuth(MessagesDetailsDashboardPage)} /> 
            <Route 
              path="/painel/mensagens" 
              component={requireAuth(MessagesDashboardPage)} />                    
            <Route 
              path="/painel/comentarios/pendentes" 
              component={requireAuth(CommentsDashboardPage, {
                  roles: ['admin', 'teacher', 'editor']
              })} />
            <Route 
              path="/painel/propostas/pendentes" 
              component={requireAuth(PendingScriptsDashboardPage, {
                  roles: ['admin', 'teacher', 'editor']
              })} />
            <Route 
              path="/painel/recursos/:type" 
              component={requireAuth(MyResourcesDashboardPage, {
                  roles: ['admin', 'teacher', 'editor']
              })} />
            <Route 
              path="/painel/aplicacoes" 
              component={requireAuth(AppsDashboardPage, {
                  roles: ['admin', 'teacher', 'editor']
              })} />
            <Route 
              path="/painel/ferramentas" 
            component={requireAuth(ToolsDashboardPage, {
                  roles: ['admin', 'teacher', 'editor']
              })} />
              
              {/* 404 */}
              <Route component={NotFoundPage} />
            </Switch>
        </Empty>

        {/* 404 */}
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
    path: "/",
    exact: true,
    component: IndexPage
  },
  {
    path: "/recursos",
    exact: true,
    component: DiscoverPage
  },
  {
    path: "/aplicacoes",
    component: AppsPage
  },
  {
    path: "/ferramentas",
    component: ToolsPage
  },
  {
    path: "/registar",
    component: resetAll(SignupFormPage)
  },
  {
    path: "/perfil",
    component: requireAuth(ProfileDashboardPage)
  },
  {
    path: "/registo/:token",
    component: resetAll(SignupConfirmPage)
  },
  {
    path: "/novorecurso",
    component: requireAuth(NewResourcePage, {
        roles: ['admin', 'teacher', 'editor']
    })
  },
  {
    path: "/editarrecurso/:resource",
    component: requireAuth(NewResourcePage, {
          roles: ['admin', 'teacher', 'editor']
      })
  },
  {
    path: "/gerirpropostas/:resource",
    component: requireAuth(NewScriptPage, {
          roles: ['admin', 'teacher', 'editor']
      })
  },
  {
    path: "/novaproposta/:resource",
    component: requireAuth(NewSingleScriptPage, {
          roles: ['admin', 'teacher', 'editor']
      })
  },
  {
    path: "/editarproposta/:script",
    component: requireAuth(NewSingleScriptPage, {
          roles: ['admin', 'teacher', 'editor']
      })
  },
  {
    path: "/novaaplicacao",
    component: requireAuth(NewAppPage, {
          roles: ['admin', 'teacher', 'editor']
      })
  },
  {
    path: "/editarapp/:app",
    component: requireAuth(NewAppPage, {
          roles: ['admin', 'teacher', 'editor']
      })
  },
  {
    path: "/novaferramenta",
    component: requireAuth(NewToolPage, {
          roles: ['admin', 'teacher', 'editor']
      })
  },
  {
    path: "/editarferramenta/:tool",
    component: requireAuth(NewToolPage, {
          roles: ['admin', 'teacher', 'editor']
      })
  },
  {
    path: "/sobre",
    component: AboutPage
  },
  {
    path: "/ajuda",
    component: HelpPage
  },
  {
    path: "/noticias",
    exact: true,
    component: NewsPage
  },
  {
    path: "/noticias/:slug",
    component: NewsDetailsPage
  },
  {
    path: "/recuperarpalavrapasse/:token",
    component: SubmitPasswordRecoverPage
  },
  {
    path: "/recuperarpalavrapasse",
    component: RecoverPasswordPage
  },  
  {
    path: "/faleconnosco",
    component: resetAll(FeedbackPage)
  },
  {
    path: "/termosecondicoes",
    component: resetAll(TermsPage)
  },
  {
    path: "/fichatecnica",
    component: TechFilePage
  },
  {
    path: "/politica-privacidade",
    component: PrivacyPolicy
  }, 
  {
    component: Empty,
    routes: [
      {
        path: "/recursos/detalhes-recurso/:resource",
        component: ResourceDetailsPage
      },
      {
        path: "/painel/utilizadores",
        component: requireAuth(UsersManageDashboardPage, {
            roles: ['admin']
          })
      },
      {
        path: "/painel/meusrecursos/:type",
        component: requireAuth(MyResourcesDashboardPage)
      },
      {
        path: "/painel/meusrecursos",
        component: requireAuth(MyResourcesDashboardPage, {
            roles: ['admin', 'teacher', 'editor']
          })
      },
      {
        path: "/painel/minhaspropostas",
        component: requireAuth(MyScriptsDashboardPage, {
            roles: ['admin', 'teacher', 'editor']
          })
      },
      {
        path: "/painel/mensagens/:resource",
        component: requireAuth(MessagesDetailsDashboardPage)
      },  
      {
        path: "/painel/mensagens",
        component: requireAuth(MessagesDashboardPage)
      },             
      {
        path: "/painel/comentarios/pendentes",
        component: requireAuth(CommentsDashboardPage, {
              roles: ['admin', 'teacher', 'editor']
          })
      },
      {
        path: "/painel/propostas/pendentes",
        component: requireAuth(PendingScriptsDashboardPage, {
              roles: ['admin', 'teacher', 'editor']
          })
      },
      {
        path: "/painel/recursos/:type",
        component: requireAuth(MyResourcesDashboardPage, {
              roles: ['admin', 'teacher', 'editor']
          })
      },
      {
        path: "/painel/aplicacoes",
        component: requireAuth(AppsDashboardPage, {
              roles: ['admin', 'teacher', 'editor']
          })
      },
      {
        path: "/painel/ferramentas",
        component: requireAuth(ToolsDashboardPage, {
              roles: ['admin', 'teacher', 'editor']
          })
      },
      {
        path: "/*",
        component: NotFoundPage
      }
    ]
  },
  {
    path: "/*",
    component: NotFoundPage
  }
];