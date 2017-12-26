import React from 'react';
import { Route, IndexRoute } from 'react-router';
import forEach from 'lodash/forEach';
import config from './config';
import { getType } from './utils/funcGlobal';

// if (typeof System.import === 'undefined') System.import = module => Promise.resolve(require(module));
if (typeof require.ensure !== 'function') require.ensure = (d, c) => { c(require); };

if (typeof console !== 'undefined' && typeof console.errorbk === 'undefined') {
  console.errorbk = console.error;
  console.error = function () {
    let i, isWarning = false, obj;
    for (i = 0; i < arguments.length; i++) {
      obj = arguments[i];
      if (isWarning === false && typeof obj === 'string') {
        isWarning = obj.indexOf('Warning: ') > -1
        if (isWarning) {
          break
        }
      }
    }
    if (isWarning) {
      return;
    }
    // console.log('%c' + sum, 'background: #222; color: red');
    console.errorbk.apply(this, arguments);
  };
}
export default (store, useragent) => {
  /* const requireAuth = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user } } = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace({
          pathname: '/auth',
          state: {
            requireLogin: true,
          }
        });
        cb(null, require('containers/Mobile/Auth/'));
      } else {
        cb();
      }
    }
    if (store.getState().app.data && store.getState().app.data.sid && !isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
    // checkAuth();
    // if (!isAuthLoaded(store.getState())) {
    //   store.dispatch(loadAuth()).then(checkAuth);
    // } else {
    //   checkAuth();
    // }
  };*/

  const requireLogin = (nextState, replace, cb) => {
    if (typeof localStorage === 'undefined') { // || (typeof window !== 'undefined' && window.location.hostname.indexOf('marrybaby') < 0 )
      return cb();
    }
    try {
      const key = localStorage.getItem('key');
      if (key !== 'i·×møç') {
        replace('/splash');
      }
    } catch (e) {}
    cb();
  };

  function shouldRemoveHoverCSSRule() {
    if ('createTouch' in document) {
      try {
        const ignore = /:hover/;
        for (let i = 0; i < document.styleSheets.length; i++) {
          const sheet = document.styleSheets[i];
          if (!sheet.cssRules) {
            continue;
          }
          for (let j = sheet.cssRules.length - 1; j >= 0; j--) {
            const rule = sheet.cssRules[j];
            if (rule.type === CSSRule.STYLE_RULE && ignore.test(rule.selectorText)) {
              sheet.deleteRule(j);
            }
          }
        }
      }
      catch(e) { // eslint-disable-line
      }
    }
  }
  let isMob = undefined;
  const isMobile = () => {
    if (typeof useragent === 'undefined') {
      return;
    }
    if (typeof isMob !== 'undefined') {
      return isMob;
    }
    isMob = useragent.indexOf(' mobile ') > -1 ? true : false;
    return isMob;
  };
  const getStates = () => {
    // sua phan nay de tai du lieu tu store, sau nay dung redux de lay du lieu
    const { serverData } = store.getState();
    return serverData;
  }

  let template = (typeof window !== 'undefined' && typeof localStorage !== 'undefined') ? localStorage.getItem('template') : '';
  if (typeof template === 'undefined' || template === null) {
    template = '';
  }
  let language = (typeof window !== 'undefined' && typeof localStorage !== 'undefined') ? localStorage.getItem('language') : '';
  if (typeof language === 'undefined' || language === null) {
    language = '';
  }
  let device = '';
  isMobile();
  let type = config.type;
  let refMain;
  const getInfo = () => {
    return {
      template: template,
      language: language,
      device: isMobile() ? 'mobile' : 'desktop',
      type: type,
    };
  }
  const setInfo = (obj) => {
    let isExists = false;
    if (obj.name === 'language') {
      language = obj.val;
      localStorage.setItem(obj.name, obj.val);
      isExists = true;
    } else if (obj.name === 'template') {
      template = obj.val;
      localStorage.setItem(obj.name, obj.val);
      isExists = true;
    }
    return isExists;
  }
  const openProduct =  (obj) => {
    if (typeof obj === 'undefined') {
      refMain.setData({ type: 'product', data: 1 })
      return;
    }
    if (typeof obj.type === 'undefined') {
      refMain.setData({ type: 'price', isOpen: true, data: obj });
      return;
    }
    if (typeof obj.isOpen === 'undefined' || obj.isOpen !== true) {
      obj.isOpen = true;
    }
    return refMain.setData(obj);
  }
  const setOpenProduct =  (obj) => {
    if (typeof obj === 'undefined') {
      return;
    }
    refMain = obj;
  }

  return ({
    path: '/',
    hasMobile: config.hasMobile,
    hasHeader: config.hasHeader,
    countEnter: 0,
    subroutes: {
      path: '*',
      type: '',
      getInfo() {
        return getInfo();
      },
      setInfo(obj) {
        return setInfo(obj);
      },
      openProduct: (obj) => {
        return openProduct(obj);
      },
      getStates() {
        // sua phan nay de tai du lieu tu store, sau nay dung redux de lay du lieu
        //const { serverData } = store.getState();
        const serverData = getStates();
        return serverData;
      },
      getType(location) {
        let path = '';
        if (typeof location === 'undefined') {
          if (typeof window !== 'undefined') {
            path = window.location.pathname;
          } else {
            path = '';
          }
          
        } else {
          path = location.location.pathname;
        }
        const type = getType(path);
        return type === 'Product' ? 'Category' : type;
      },
      headerContent(types) {
        let type = types.toString();
        /*const isMob = isMobile();
        const version = (isMob ? 'Mobile' : 'Desktop');*/
        const content = '' + type + ((type === 'Home' || type === 'Account') ? '/index' : (type === 'Profile' || type ==='Account' ? '/Main/index' : '/Global')).toString();
        const obj = {
          /* PostPage: {
            header: '' + version + '/Search/SearchHeader'
          },*/
          Home: {
            header: 'Header/index',
          },
        };
        if (typeof obj[type] === 'undefined') {
          type = 'Home';
        }
        return { header: obj[type].header, content };
      },
      getComponent(location, cb) {
        // const enhancer = compose(
        //   applyMiddleware(thunk),
        // );
        // const store = createStore(reducer, enhancer);
        // const data = store.getState().reduxRouter;
        
        let type = '';
        const { state } = location.location;
        console.log('123123213', state, this.type);
        if (typeof state !== 'undefined' && typeof state.reload !== 'undefined' && state.reload === true) {

          if (state.isDesktop === false && isMob === false) {
            isMob = !isMob;
          } else {
            type = this.type;
          }
        }
        if (type === '') {
          type = this.getType(location);
          this.type = type;
        }
        if (type === '') {
          cb(null);
        }
        const returnResult = this.headerContent(type);
        try {
          console.log('result', returnResult);
          require.ensure([], (require) => {
            cb(null, {
              header: require('components/' + returnResult.header),
              content: require('containers/' + returnResult.content),
              footer: require('components/Footer/index'),
              // content: require('containers/Desktop/Home/')
            });
          });
        } catch (e) {
          cb(null);
        }
      },
      getIndexRoute(location, cb) {
        const type = this.getType(location);
        if (type !== 'Profile') {
          return cb(null);
        }
        let pathname = '';
        if (typeof location === 'undefined') {
          pathname = window.location.pathname;
        } else {
          pathname = location.location.pathname;
        }
        const splitLocation = pathname.split('/');
        const typeTab = splitLocation[splitLocation.length - 1];
        const avaiables = ['wall', 'notice', 'user', 'guide', 'newfeed', 'friend', 'department'];
        let pos = avaiables.indexOf(typeTab);
        if ( pos < 0) {
          pos = 0;
        }
        require.ensure([], (require) => {
          cb(null, {
            path: '*',
            type: '',
            getInfo() {
              return getInfo();
            },
            setInfo(obj) {
              return setInfo(obj);
            },
            openProduct: (obj) => {
              return openProduct(obj);
            },
            getComponent(location, cb) {
              /*let ComContent;

              const subType = avaiables[pos];
              // console.log('subType', subType)
              if (subType === 'notice') {
                ComContent = require('containers/Profile/Notice/');
              } else if (subType === 'user') {
                ComContent = require('containers/Profile/User/');
              } else if (subType === 'guide') {
                ComContent = require('containers/Profile/Guide/');
              } else if (subType === 'notifications') {
                ComContent = require('containers/Profile/Notifications/');
              } else if (subType === 'newfeed') {
                ComContent = require('containers/Profile/Newfeed/');
              } else if (subType === 'friend') {
                ComContent = require('containers/Profile/Friends/');
              } else {
                ComContent = require('containers/Profile/Wall/');
              }
              cb(null, {
                header: require('containers/Profile/Header/'),
                content: ComContent,
              });*/
            }
          });
        });
      },
    },
    getInfo() {
      return getInfo();
    },
    setInfo(obj) {
      return setInfo(obj);
    },
    openProduct: (obj) => {
      return openProduct(obj);
    },
    setOpenProduct: (obj) => {
      return setOpenProduct(obj);
    },
    onEnter(nextState, replace, cb) {
      this.countEnter = 0;
      if (typeof window !== 'undefined') {
        shouldRemoveHoverCSSRule();
        isMob = undefined;
        isMobile();
        
        /*if (isMob === false && window.innerWidth < 960) {
          isMob = true;
        }*/
        cb();
      } else {
        cb();
      }
    },
    isEnter() {
      return (this.countEnter > 0 ? false : true);
    },
    getStates() {
      const serverData = getStates();
      return serverData;
    },
    getComponent(location, cb) {
      require.ensure([], (require) => {
        cb(null, require('containers/Main/'));
      });
    },
    getChildRoutes(location, cb) {
      this.countEnter += 1;
      require.ensure([], (require) => {
        cb(null, this.subroutes);
      });
    },
    getIndexRoute(location, cb) {
      this.countEnter += 1;
      require.ensure([], (require) => {
        cb(null, this.subroutes);
      });
    }
  });
};
