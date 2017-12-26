import express from 'express';
import request from 'request';
import React from 'react';
import ReactDOM from 'react-dom/server';
import favicon from 'serve-favicon';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import httpProxy from 'http-proxy';
import path from 'path';
import PrettyError from 'pretty-error';
import http from 'http';
import { match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import { Provider } from 'react-redux';
import config from 'config';
import createStore from 'redux/create';
import ApiClient from 'helpers/ApiClient';
import Html from 'helpers/Html';
import getRoutes from 'routes';
// import { exposeInitialRequest } from 'app';

import fs from 'fs';
import fpath from 'path';
import CryptoJS from 'crypto-js';
import { getType } from './utils/funcGlobal';
import map from 'lodash/map';
import FilterClass from './redux/modules/Filter';
const filterClass = new FilterClass();

process.on('unhandledRejection', error => console.error(error));

const targetUrl = `http://${config.apiHost}:${config.apiPort}`;
const pretty = new PrettyError();
const app = express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});

app.use(cookieParser());
app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));
app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, '..', 'static', 'manifest.json')));

app.use(express.static(path.join(__dirname, '..', 'static')));

app.use((req, res, next) => {
  res.setHeader('Service-Worker-Allowed', '*');
  res.setHeader('X-Forwarded-For', req.ip);
  return next();
});

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl });
});

app.use('/ws', (req, res) => {
  proxy.web(req, res, { target: `${targetUrl}/ws` });
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' });
  }

  const json = { error: 'proxy_error', reason: error.message };
  res.end(JSON.stringify(json));
});

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  // sua phan nay, de load lai
  // req.headers['user-agent'] = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
  req.headers['user-agent'] = req.headers['user-agent'].toLowerCase();

  const isMobileRegExp = new RegExp(/iphone|ipod|(?=.*\bandroid\b)(?=.*\bmobile\b)|(?=.*\bandroid\b)(?=.*\bSD4930UR\b)|iemobile/i);
  const isMobile = isMobileRegExp.test(req.headers['user-agent']) ? true : false;
  if (isMobile) {
    req.headers['user-agent'] = ' mobile ' + req.headers['user-agent'];
  }
  const userAgent = req.headers['user-agent'];
  global.navigator = { userAgent: req.headers['user-agent'] };
  const arrBot = ['bot', 'google', 'facebook', 'twitter', 'linked'];
  let isBot = false;
  for (const i in arrBot) {
    if (userAgent.indexOf(arrBot[i]) < 0) {
      continue;
    }
    isBot = true;
    break;
  }
  let type = '', domain = '';
  const host = req.headers.host, pos = host.indexOf(':');
  domain = pos === -1 ? host : host.substr(0, pos);
  if (domain === 'localhost') {
    domain = 'umbala.vn';
  }
  req.domain = domain;
  if (isBot === true) {
    type = getType(req.originalUrl);
    const arrBot = ['Home', 'Product', 'Account'];
    if (arrBot.indexOf(type) === -1) {
      isBot = false;
    }
  }

  if (isBot) {
    // fetch data from basic api 
    // http://crypt.codemancers.com/posts/2016-09-16-react-server-side-rendering/
    const arrAPICallBack = {
      Global: {
        'banner': {
          processData: (result) => {
            if (result.status !== 'success') {
              return result;
            }
            try {
              const obj = {
                banner: result.data['get-ads'][0],
                bannerMenu: result.data['get-menu'][0].value,
                bannerMenuSmall: result.data['get-menu'][1].value,
                category: result.data['category-detail'][0]
              };
              return obj;
            } catch (err) {
              return result;
            }
          }
        }
      },
      Category: {
        productList: {
          processData: (result) => {
            if (result.status !== 'success') {
              return result;
            }
            try {
              let data = result.data['category-detail'][0];
              if (Object.keys(data).length === 0) {
                result = {};
                result.message = 'Không tìm thấy sản phẩm trong danh mục!';
                result.status = 'error';
                data = result;
              } else {
                data.listLinkSave = result.data['get-search-link'][0].data;
                data.status = result.status;
              }
              return data;
            }
            catch(err) {
              return result;
            }
          }
        }
      },
      Product: {
        productList: {
          processData: (result) => {
            if (result.status !== 'success') {
              return result;
            }
            try {
              let data = result.data['article-detail'][0];
              if (Object.keys(data).length === 0) {
                data = {};
              }
              data.status = result.status;
              return data;
            }
            catch(err) {
              return result;
            }
          }
        }
      }
    }
    
    const arrAPI = {
      Global: {
        'menu': {
          method: 'post',
          data: {
            call: 'general',
            ctype: 'page',
            get: [{
              'get-menu': [{
                mtype: 'main-menu'
              }, {
                mtype: 'footer'
              }]
            }, {
              'get-header': ''
            }],
            params: '',
            did: 'nrlkg62088fqd45crnd0rg3bg0',
          }
        },
        'domain': {
          method: 'post',
          data: {
            call: 'get-domain',
            ctype: 'function',
            get: '',
            params: {
              'name-code': domain,
            },
            'did': 'nrlkg62088fqd45crnd0rg3bg0',
          }
        },
        banner: {
          method: 'post',
          data: {
            call: 'general',
            ctype: 'page',
            get: [
              {
                'get-ads': [{
                  item_type: 'home',
                  item_path: '/'
                }]
              },
              {
                'get-menu': [{
                  mtype: 'banner-menu'
                }, {
                  mtype: 'banner-menu-small'
                }]
              },
              {
                'category-detail': [{
                  'name-code': '/',
                  extend: 0,
                  child: 0
                }]
              }
            ]
          },
        }
      },
      Home: {
      },
      Category: {
        productList: {
          method: 'post',
          data: {
            call: 'general',
            ctype: 'page',
            get: [
              {
                'category-detail': [{
                  'name-code': '{path}',
                  filter: 1,
                  extend: 1,
                  child: 1,
                  display: 'all',
                  search: {},
                  'list-article': {
                    page: 1,
                    order: '',
                    'page-size': 40,
                  },
                }]
              },
              {
                'get-search-link': [
                  {
                    'page': 1,
                    'page-size': 10,
                  }
                ]
              },
            ],
            did: 'nrlkg62088fqd45crnd0rg3bg0',
          }
        },
      },
      Product: {
        productList: {
          method: 'post',
          data: {
            call: 'article',
            ctype: 'page',
            get: [{
              'article-detail': [{
                'name-code': '{path}',
                filter: 1,
                extend: 1,
                breadcrumb: 1,
                combo: 1,
                location: 1,
                real_estate: 1,
              }]
            }],
            did: 'nrlkg62088fqd45crnd0rg3bg0',
          },
        },
      },
    }
    // merge api
    const arrGetAPI = {
      Global: arrAPI['Global'],
    };
    arrGetAPI[type] = arrAPI[type];
    if (type === 'Category') {
      const pathname = req.originalUrl;
      const tmpPath = filterClass.filterToPath({}, pathname, true);
      if (tmpPath !== pathname) {
        console.log('Redirect', tmpPath);
        // res.redirect(tmpPath);
        // return;
      }

      let filter = filterClass.pathToFilter(pathname);
      if (!filter) {
        filter = {};
      }
      let page = 1;
      if (filter.page && filter.page['value'][0]) {
        page = filter.page['value'][0];
        page *= 1;
      }
      if (page < 1) {
        page = 1;
      }
      const filterAfter = {};
      let order = '';
      if (filter) {
        map(filter, (val, key) => {
          filterAfter[key] = val;
        });
        if (filterAfter.order && filterAfter.order.value) {
          order = filterAfter.order.value[0].value;
          // delete filterAfter.order;
          _.omit(filterAfter, 'order');
        }
      }
      const filterAfter2 = {};
      map(filterAfter, (val, key) => {
         if (val.id === '' || typeof val.id === 'undefined') {
          filterAfter2[key] = [];
          map(val.value, data => {
            filterAfter2[key].push(data.value);
          });
        } else if (val.id) {
          filterAfter2[val.id] = [];
          map(val.value, data => {
            filterAfter2[val.id].push(data.id);
          });
        }
      });
      const search = {}
      if (Object.keys(filterAfter2).length > 0) {
        search.filter_type = 1;
        search.filter = filterAfter2;
      }
      const display = isMobile ? 'all' : 'child';
      const objType = arrGetAPI[type]['productList']['data']['get'][0]['category-detail'][0];
      objType['name-code'] = pathname.substr(0, pathname.lastIndexOf('/') + 1);
      objType['display'] = display;
      objType['search'] = search;
      objType['list-article']['page'] = page;
      objType['list-article']['order'] = order;

      arrGetAPI[type]['productList']['data']['get'][0]['category-detail'][0] = objType;
    } else if (type === 'Product') {
      const pathname = req.originalUrl;
      
      const objType = arrGetAPI[type]['productList']['data']['get'][0]['article-detail'][0];
      objType['name-code'] = pathname;

      arrGetAPI[type]['productList']['data']['get'][0]['article-detail'][0] = objType;
    }

    for (const typeAPI in arrGetAPI) {
      if ( !arrGetAPI.hasOwnProperty(typeAPI) ) {
        continue;
      }
      const contentAPI = arrGetAPI[typeAPI];
      if (typeof contentAPI === 'undefined' || contentAPI === null || Object.keys(contentAPI).length < 1) {
        delete arrGetAPI[typeAPI];
      }
      for (const keyContentAPI in contentAPI) {
        if ( !contentAPI.hasOwnProperty(keyContentAPI) ) {
          continue;
        }
        const valAPI = contentAPI[keyContentAPI];
        const key = JSON.stringify(valAPI);
        const md5 = CryptoJS.MD5(key).toString();
        valAPI.md5 = md5;
        arrGetAPI[typeAPI][keyContentAPI] = valAPI;
      }
    }

    loadAPI(arrGetAPI, arrAPICallBack, (data) => {
      loadStore(res, req, { serverData: data, userAgent: req.headers['user-agent'] });
    });
  } else {
    loadStore(res, req, { userAgent: req.headers['user-agent'] });
  }
});

function loadAPI(arrGetAPI, arrAPICallBack, cb) {
  const url = 'https://www.umbala.vn/tools/api.php';
  const dirSave = fpath.join(__dirname, '/../cacheAPI/');
  const loadedAPI = {};
  for (const typeAPI in arrGetAPI) {
    if ( !arrGetAPI.hasOwnProperty(typeAPI) ) {
      continue;
    }
    loadedAPI[typeAPI] = {};
    const contentAPI = arrGetAPI[typeAPI];
    for (const keyContentAPI in contentAPI) {
      if ( !contentAPI.hasOwnProperty(keyContentAPI) ) {
        continue;
      }
      const valAPI = contentAPI[keyContentAPI];
      const md5 = valAPI.md5;
      const filePath = fpath.join(dirSave, md5 + '.txt');

      if (fs.existsSync(filePath)) {
        const fcontent = fs.readFileSync(filePath)
        if (typeof fcontent !== 'undefined' && fcontent !== '') {
          let content = {};
          try {
            content = JSON.parse(fcontent);
          }
          catch(err) {
            content = {
              status: 'error'
            }
          }
          if (content.status !== 'success' || content.expireTime < new Date().getTime()) {
            fs.unlinkSync(filePath);
          } else {
            // console.log('cache true', md5);
            const data = content.data;

            delete arrGetAPI[typeAPI][keyContentAPI];
            if (Object.keys(arrGetAPI[typeAPI]).length < 1) {
              delete arrGetAPI[typeAPI];
            }
            loadedAPI[typeAPI][keyContentAPI] = data;
            continue;
          }
        }
      }
    }
  }
  if (Object.keys(arrGetAPI).length < 1) {
    cb(loadedAPI);
    return;
  }
  for (const typeAPI in arrGetAPI) {
    if ( !arrGetAPI.hasOwnProperty(typeAPI) ) {
      continue;
    }
    const contentAPI = arrGetAPI[typeAPI];
    for (const keyContentAPI in contentAPI) {
      if ( !contentAPI.hasOwnProperty(keyContentAPI) ) {
        continue;
      }
      const valAPI = contentAPI[keyContentAPI];
      const urlAPI = (typeof valAPI.url === 'undefined' || valAPI.url === '') ? url : valAPI.url;
      const data = valAPI.data;
      const method = (typeof valAPI.method === 'undefined' || valAPI.method !== 'post') ? 'get' : 'post';
      const md5 = valAPI.md5;
      const filePath = fpath.join(dirSave, md5 + '.txt');

      const obj = {
        method: method,
        url: urlAPI,
        timeout: 2000,
      }
      if (method === 'post') {
        obj.form = data;
      }
      request(obj, (error, response, body) => {
        const processData = (typeof arrAPICallBack[typeAPI] !== 'undefined' && typeof arrAPICallBack[typeAPI][keyContentAPI] !== 'undefined') ? arrAPICallBack[typeAPI][keyContentAPI].processData : undefined;
        const data = loadContentAPI(obj, body, filePath, processData);
        delete arrGetAPI[typeAPI][keyContentAPI];
        if (Object.keys(arrGetAPI[typeAPI]).length < 1) {
          delete arrGetAPI[typeAPI];
        }
        loadedAPI[typeAPI][keyContentAPI] = data;
        if (Object.keys(arrGetAPI).length < 1) {
          cb(loadedAPI);
        }
      });
    }
  }
}
function loadContentAPI(header, body, filePath, processData) {
  let data = {};
  try {
    data = JSON.parse(body);
  }
  catch(err) {
    data = {
      status: 'error'
    }
  }

  if (typeof data.status === 'undefined') {
    data = {
      status: 'error',
      content: data,
    }
  }

  if (typeof processData !== 'undefined') {
    // xu ly rieng cho category
    /*if (typeof header.form.get['category-detail'] !== 'undefined') {
      data.selectFilter = header.form.get['category-detail'][0]['search'];
    }*/
    data = processData(data);
  }

  data.header = header;
  let expireTime = 2 * 3600;
  if (data.status === 'error') {
    expireTime = 600;
  }
  const content = {
    status: 'success',
    data: data,
    expireTime: new Date().getTime() + expireTime * 1000 // vi getTime la microsecond
  };
  fs.writeFileSync(filePath, JSON.stringify(content));
  fs.chmodSync(filePath, '0777');
  return data;
}
function loadStore(res, req, data) {
  const client = new ApiClient(req);
  const memoryHistory = createHistory(req.originalUrl);
  const store = typeof data === 'undefined' ? createStore(memoryHistory, client) : createStore(memoryHistory, client, data);
  const history = syncHistoryWithStore(memoryHistory, store);

  function hydrateOnClient() {
    res.send(`<!doctype html>
      ${ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store} />)}`);
  }

  if (__DISABLE_SSR__) {
    return hydrateOnClient();
  }

  // Re-configure restApp for apply client cookies
  // exposeInitialRequest(req);

  match({
    history,
    routes: getRoutes(store, req.headers['user-agent']),
    location: req.originalUrl
  }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      loadOnServer({ ...renderProps, store, helpers: { client } }).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );

        res.status(200);
        const tmps = {...webpackIsomorphicTools.assets(), domain: req.domain};
        if (typeof data !== 'undefined' && typeof data.serverData !== 'undefined') {
          if (!__DEVELOPMENT__) {
            tmps.javascript = undefined;
          }

          // fs.writeFileSync('/home/tuanvh/app/web/a.txt', JSON.stringify(tmps));

          // console.log('-----server---', tmps.styles);
          // content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
          res.end(`<!doctype html isStatic>
          ${ReactDOM.renderToStaticMarkup(
            <Html assets={tmps} component={component} store={store} />
          )}`);
        } else {
          res.end(`<!doctype html>  
          ${ReactDOM.renderToString(
            <Html assets={tmps} component={component} store={store} />
          )}`); 
        }
        
      }).catch(mountError => {
        console.error('MOUNT ERROR:', pretty.render(mountError));
        res.status(500);
        hydrateOnClient();
      });
    } else {
      res.status(404).send('Not found');
    }
  });
}
if (config.port) {
  server.listen(config.port, err => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
