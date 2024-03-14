/* eslint-disable no-console */
/* eslint-disable no-inner-declarations */
const { debug } = require('./utils/dataManipulation');
const logger = require('../server/utils/logger').Logger;
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
const serialize = require('serialize-javascript');

// Routes
var routes = require('./routes/index');

// React
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { StaticRouter, matchPath } from 'react-router-dom';

/* var history             = require('history'); */
var Provider            = require('react-redux').Provider;
var createStore         = require('redux').createStore;
var applyMiddleware     = require('redux').applyMiddleware;
var thunkMiddleware     = require('redux-thunk').default;
var apiMiddleware       = require('../public/assets/scripts/middleware/api').default;
var multi               = require('redux-multi').default;
var reducers            = require('../public/assets/scripts/reducers').default;

import RoutesObj, {routesServer} from '../public/assets/scripts/routes/routes';

var fetchComponentData  = require('./utils/fetchComponentData').default;
var buildMeta           = require('./utils/serverRender').buildMeta;
var DocTitle            = require('react-document-title');
var DocMeta             = require('react-doc-meta');

// Utils
var jwtUtil = require('./utils/jwt');
var utils   = require('./utils');
const listEndpoints = require('express-list-endpoints')
const { getUser } = require('./services/usesUser')

// Init Express
var app = express();

//  Get user helpers for return object
const UserController = require('./controllers/userController');

// Read JSX
require('node-jsx').install();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// CORS
app.use(cors());
app.use(bodyParser.json({limit:'100mb', type:'application/json'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: false }));
app.use(passport.initialize());

//
//  Download file
//
app.use('/files', express.static(path.join(__dirname, '../public/files'), { maxAge: '30 days' }));
app.use('/config', express.static(path.join(__dirname, '../public/config'), { maxAge: '30 days' }));


/**
 * LOG ACCESS FOR GPDR PURPOSE
 */
app.use(async function(req, res, next) {
  let curUser = await getUser(req.headers.redauid);

  let logData = {
    user: curUser.data ? curUser.data.id : null,
    user_email: curUser.data ? curUser.data.email : null,
    url: req.url,
    method: req.method,
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params
  }

  logger.access(JSON.stringify(logData));
  
  next();
});

// Init routes
routes(app);

app.use('/api/description', function(req, res){

	return res.json({result: listEndpoints(app)});
});

// Refresh token if any given
var prevJson = app.response.json;
app.response.json = function(obj) {
  var _this = this;
  
  if (_this.req.headers.redauid) {

     obj.new_token = jwtUtil.refreshToken(_this.req.headers.redauid || _this.req.headers.authentication);

     debug(obj.new_token, "AppInit","New Token");

     // Get user from token if any
     UserController.getUserInfoFromToken(_this.req.headers.redauid)
     .then(function(user){
        debug(user, "AppInit","Get user info from token");
        if (user && obj.new_token){
          obj.user = user
        }

        prevJson.call(_this, obj);
     })
  }else{
    prevJson.call(_this, obj);
  }
};

//
//  React Server Render
//
app.use(function(req, res){
  debug(req.url, "AppInit");
  

  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
    console.log('favicon requested');
    return;
  }else if(req.url.indexOf('/files')<0 && req.url.indexOf('/config')<0){
    let isDashboard = req.url.indexOf('/dashboard')>=0;
    let store = null;

    if(!isDashboard){
      store    = applyMiddleware(multi, thunkMiddleware, apiMiddleware)(createStore)(reducers);
    }
    let params = {},
      components = [];
    

    /*if(err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }*/

    /**
     * Get match of routes
     */
    function routerMatch(req, routes = null) {

      routes.map(route => {

        if(route.routes && !route.path){
          routerMatch(req, route.routes);

        }else{
          // use `matchPath` here
          const match = matchPath(req.path, route);
          debug(match, "AppInit", "Match of "+req.path+":");
          debug(components, "AppInit", "Current components object");
          
          if (match && components.length==0){
            Object.assign(params, match.params);
            components.push(route.component);
          }
        }
      });
    }

    /**
     * Render view with data
     */
    function renderView() {
      const context = {};
      let InitialView = null;
      let componentHTML = null;
      let initialState = {};

      if(!isDashboard){
        InitialView = (
          <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
                <RoutesObj />
            </StaticRouter>
          </Provider>
        );      

        if (context.url) {
          res.redirect(context.url);
          return;
        }

        componentHTML = ReactDOMServer.renderToString(InitialView);     
        initialState = store.getState();
        debug(initialState, "AppInit");
      }

      // Create meta tags
      var pageHeadData = DocMeta.rewind();
      var pageTitleData = DocTitle.rewind();

      // Set styles and scripts  
      var docStyles = '';
      var docScripts = '';

      if(!isDashboard){
        docStyles = utils.fetchAssets(path.join(__dirname, '../dist/assets/styles'), '/assets/styles/');
        docScripts = utils.fetchAssets(path.join(__dirname, '../dist/assets/scripts'), '/assets/scripts/');
      }else{
        docStyles = utils.fetchAdminAssets(path.join(__dirname, '../dist/assets/styles'), '/assets/styles/');
        docScripts = utils.fetchAdminAssets(path.join(__dirname, '../dist/assets/scripts'), '/assets/scripts/');
      }

      // Add styles for dev if is the case
      if (app.get('env') != 'production' && app.get('env') != 'staging') {
        if(!isDashboard){
          docStyles = '<link rel="stylesheet" href="/assets/styles/main.css">';
          docScripts = '<script src="/assets/scripts/vendor.js"></script>'+
                      '<script src="/assets/scripts/bundle.js"></script>';
        }else{
          docStyles = '<link rel="stylesheet" href="/assets/styles/admin-main.css">';
          docScripts = '<script src="/assets/scripts/vendor.js"></script>'+
                      '<script src="/assets/scripts/admin-bundle.js"></script>';
        }        
      }


      const HTML = `
      <!DOCTYPE html>
        <!--[if lt IE 10]> <html class="lt-ie10 no-js"  lang=""> <![endif]-->
        <!--[if gt IE 9]><!--> <html class="no-js" lang=""> <!--<![endif]-->
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="theme-color" content="#83ae03" />
          ${buildMeta(pageHeadData, pageTitleData)}

          <!-- Web Fonts -->
          <link href='https://fonts.googleapis.com/css?family=Lato:400,300,700' rel='stylesheet' type='text/css'>
          <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700,600,300' rel='stylesheet' type='text/css'>
          ${isDashboard ? 
            `<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">`
          :
            `<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">`
          }
          
          <!-- /Web Fonts -->

          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
          
          ${docStyles}
          
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />

          <script src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js"></script>

          <!-- FAV ICON -->
          <link rel="apple-touch-icon" sizes="57x57" href="/assets/graphics/favicon/apple-icon-57x57.png">
          <link rel="apple-touch-icon" sizes="60x60" href="/assets/graphics/favicon/apple-icon-60x60.png">
          <link rel="apple-touch-icon" sizes="72x72" href="/assets/graphics/favicon/apple-icon-72x72.png">
          <link rel="apple-touch-icon" sizes="76x76" href="/assets/graphics/favicon/apple-icon-76x76.png">
          <link rel="apple-touch-icon" sizes="114x114" href="/assets/graphics/favicon/apple-icon-114x114.png">
          <link rel="apple-touch-icon" sizes="120x120" href="/assets/graphics/favicon/apple-icon-120x120.png">
          <link rel="apple-touch-icon" sizes="144x144" href="/assets/graphics/favicon/apple-icon-144x144.png">
          <link rel="apple-touch-icon" sizes="152x152" href="/assets/graphics/favicon/apple-icon-152x152.png">
          <link rel="apple-touch-icon" sizes="180x180" href="/assets/graphics/favicon/apple-icon-180x180.png">
          <link rel="icon" type="image/png" sizes="192x192"  href="/assets/graphics/favicon/android-icon-192x192.png">
          <link rel="icon" type="image/png" sizes="32x32" href="/assets/graphics/favicon/favicon-32x32.png">
          <link rel="icon" type="image/png" sizes="96x96" href="/assets/graphics/favicon/favicon-96x96.png">
          <link rel="icon" type="image/png" sizes="16x16" href="/assets/graphics/favicon/favicon-16x16.png">
          <link rel="manifest" href="/assets/graphics/favicon/manifest.json">
          <meta name="msapplication-TileColor" content="#ffffff">
          <meta name="msapplication-TileImage" content="/assets/graphics/favicon/ms-icon-144x144.png">

          <!--[if lt IE 9]>
          <script>
          (function(){
            var ef = function(){};
            window.console = window.console || {log:ef,warn:ef,error:ef,dir:ef};
          }());
          </script>
          <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv-printshiv.min.js"></script>
          <script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-shim.js"></script>
          <script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/3.4.0/es5-sham.js"></script>
          <![endif]-->

          <script>
            window.__INITIAL_STATE__ = ${serialize(initialState)};
          </script>
        </head>
        <body>
          <!--[if lt IE 10]>
              <div id="nocando" class="alert alert-danger">
                <h1>Atenção!</h1>
                <p>Está a utilizar uma versão <strong>desatualizada</strong> do seu navegador. Por favor <a href="http://browsehappy.com/">atualize o navegador</a> para melhorar a sua experiência.</p>
              </div>
            <![endif]-->

          ${!isDashboard ? 
            `<!--<script language="javascript" charset="ISO-8859-1" src="http://www.azores.gov.pt/PortalAzoresgov/external/comum/barra/2018/barraLive.center.static.div.pt.https.js" type="text/javascript" ></script>-->
            <style type="text/css">
            .barra_boot_portal_azores_gov_pt {
              background-color: rgba(242, 242, 242, 1) !important;
              height: 34px;
            }
            .texto_barra_portal {
              font-family: Arial, Helvetica, sans-serif !important;
              font-size: 11px;
              color: #000000 !important;
            }
            .span_barra_portal {
              font-family: Arial, Helvetica, sans-serif !important;
              font-size: 11px;
              color: #000000 !important;
            }
            A.link_barra_portal {
              text-decoration: underline;
              color: #1e396e;
              margin-bottom: 0px;
              font-family: Arial, Helvetica, sans-serif !important;
              font-size: 11px;
              opacity: 1;
            }
            A.link_barra_portal:visited {
              text-decoration: underline;
              color: #1e396e;
              margin-bottom: 0px;
              font-family: Arial, Helvetica, sans-serif !important;
              font-size: 11px;
              opacity: 1;
            }
            A.link_barra_portal:hover {
              text-decoration: underline;
              color: #1e396e;
              opacity: 0.4;
            }
            A.link_barra_portal:visited:hover {
              margin-left: 10px;
            }
          </style>
      
          <div
            class="container-fluid barra_boot_portal_azores_gov_pt texto_barra_portal"
            bis_skin_checked="1"
          >
            <div class="container" bis_skin_checked="1">
              <a
                target="_blank"
                href="https://www.azores.gov.pt/Portal/pt/principal/homepage.htm"
                ><img
                  src="https://www.azores.gov.pt/PortalAzoresgov/external/comum/barra/2018/logo.GOV-AZORES.2019.png"
                  title="Azores.gov.pt - Portal do Governo dos Açores"
                  alt="Azores.gov.pt - Portal do Governo dos Açores"
                  width="150"
                  height="34"
                  border="0" /></a
              ><span class="span_barra_portal"
                >Esta é uma presença online oficial do
                <a
                  href="https://www.azores.gov.pt/Portal/pt/principal/homepage.htm"
                  target="_blank"
                  class="link_barra_portal"
                  style="color: #000000"
                  >Governo dos Açores</a
                >
                |
                <a
                  href="https://covid19.azores.gov.pt/"
                  target="_blank"
                  class="link_barra_portal"
                  style="color: #c13744; text-decoration: underline"
                  >COVID-19</a
                ></span
              >
            </div>
          </div>`
            //`<script language="javascript" charset="ISO-8859-1" src="https://www.azores.gov.pt/PortalAzoresgov/external/comum/barra/2018/test.center.dynamic.div.pt.https.js" type="text/javascript" ></script>`
            :
            ``
          }
          <div id="site-canvas"><div>${!isDashboard ? componentHTML : ''}</div></div>

          <!-- Load jQuery(1.7+) -->
          <script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>

          ${docScripts}
        </body>
       </html>`;

      return HTML;
    }

    debug(isDashboard, "AppInit");

    if (!isDashboard){
      debug(routesServer, "AppInit", "Routes");

      routerMatch(req, routesServer);

      debug(components, "AppInit", "Components");
      debug(params, "AppInit", "Params");

      fetchComponentData(store.dispatch, components, params)
        .then(renderView)
        .then(html => res.end(html))
        .catch(err => res.json({
          message:err.message,
          stack: app.get('env') === 'development' || app.get('env') === 'staging' && err.stack ? err.stack : null
        }));
    }else{
      let html = renderView()
      res.end(html);
    }
  }else{
    return;
  }
});

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development' || app.get('env') === 'staging') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      stack: err.stack || null,
    });

    logger.error(JSON.stringify({
        message: err.message,
        stack: err.stack || null,
      }));
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });

  logger.error(JSON.stringify({
    message: err.message,
    stack: err.stack || null,
  }));
});

module.exports = app;