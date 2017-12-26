
const LOAD = 'Main/LOAD';
const LOAD_CALLBACK = 'Main/LOAD_CALLBACK';
const RENEWSID = 'Main/RENEWSID';
const RENEWSID_CALLBACK = 'Main/RENEWSID_CALLBACK';
const GET_DEVICE = 'Main/GET_DEVICE';
const GET_DEVICE_CALLBACK = 'Main/GET_DEVICE_CALLBACK';
const CLEAN = 'Main/CLEAN';
const LOAD_MENU = 'Main/LOAD_MENU';
const LOAD_MENU_CALLBACK = 'Main/LOAD_MENU_CALLBACK';
const GET_DOMAIN = 'Main/GET_DOMAIN';
const GET_DOMAIN_CALLBACK = 'Main/GET_DOMAIN_CALLBACK';
const LOAD_BANNER = 'Main/LOAD_BANNER';
const LOAD_BANNER_CALLBACK = 'Main/LOAD_BANNER_CALLBACK';
const REGISTER_TOKEN_ID = 'Notification/REGISTER_TOKEN_ID';
const REGISTER_TOKEN_ID_CALLBACK = 'Notification/REGISTER_TOKEN_ID_CALLBACK';
const CHECK_TOKEN_ID = 'Notification/CHECK_TOKEN_ID';
const CHECK_TOKEN_ID_CALLBACK = 'Notification/CHECK_TOKEN_ID_CALLBACK';

const GET_DATA = 'Notification/GET_DATA';
const GET_DATA_CALLBACK = 'Notification/GET_DATA_CALLBACK';

const SET_DATA = 'Notification/SET_DATA';
const SET_DATA_CALLBACK = 'Notification/SET_DATA_CALLBACK';

const GET_SID = 'Notification/GET_SID';
const GET_SID_CALLBACK = 'Notification/GET_SID_CALLBACK';

const CHANGE_COLINROW = 'Main/CHANGE_COLINROW';

const initialState = {
  getDevice: undefined,
  colInRow: 0,
  queue: {},
  sid: '',
};

export default function Main(state = initialState, action = {}) {
  if (typeof action === 'undefined') {
    action = {};
  }
  if (typeof action.result !== 'object') {
    let message = '';
    if (typeof action.result === 'string') {
      message = action.result;
    }
    action.result = {
      status: 'error',
      message
    };
    action.status = {
      message
    };
  }
  if (typeof action.result.status !== 'string') {
    action.result.status = 'error';
  }
  
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        statusSetData: 0,
      };
    case SET_DATA_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusSetData: 2,
            errorSetData: action.result.message,
          };
        }
        return {
          ...state,
          statusSetData: 1,
          restultSetData: action.result,
        };
      }
    case GET_SID:
      return {
        ...state,
        statusGetSid: 0,
      };
    case GET_SID_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusGetSid: 2,
            errorGetSid: action.result.message,
          };
        }
        return {
          ...state,
          statusGetSid: 1,
          restultGetSid: action.result,
        };
      }
    case GET_DATA:
      return {
        ...state,
        statusGetData: 0,
      };
    case GET_DATA_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusGetData: 2,
            errorGetData: action.result.message,
          };
        }
        return {
          ...state,
          statusGetData: 1,
          restultGetData: action.result,
        };
      }
    case CHECK_TOKEN_ID:
      return {
        ...state,
        statusCheckTokenId: 0,
      };
    case CHECK_TOKEN_ID_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusCheckTokenId: 2,
            errorCheckTokenId: action.result.message,
          };
        }
        return {
          ...state,
          statusCheckTokenId: 1,
          restultCheckTokenId: action.result,
        };
      }
    case GET_DEVICE:
      return {
        ...state,
        statusGetDevice: 0,
        getDevice: action.getDevice,
      };
    case GET_DEVICE_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusGetDevice: 2,
            errorGetDevice: action.result.message,
          };
        }
        return {
          ...state,
          statusGetDevice: 1,
          getDevice: action.result,
        };
      }
    case LOAD:
      {
        return {
          ...state,
          statusLoadMain: 0,
          ukeyLoadMain: action.ukey,
        };
      }
    case LOAD_CALLBACK:  // ok
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusLoadMain: 2,
            errorLoadMain: action.result.message
          };
        }
        else {
            const data = action.result.data;
            let sid = '';
            if (data !== null) {
                if (typeof data.sid != 'undefined') {
                    sid = data.sid;
                }
                return {
                  ...state,
                  statusLoadMain: 1,
                  sid,
                };
            }
            else {
                return {
                    ...state,
                    statusLoadMain: 2,
                    errorLoadMain: action.result.message || 'load main that bại',
                  };
            }
        }
      }
    case RENEWSID:
      {
        return {
          ...state,
        };
      }
    case RENEWSID_CALLBACK:  // ok
      {
        return {
          ...state,
        };
      }
    case GET_DOMAIN:
      return {
        ...state,
        statusDomain: 0,
        ukeyDomain: action.ukey,
      };
    case GET_DOMAIN_CALLBACK: // ok
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
          statusDomain: 2,
          errorDomain: 'Đã xảy ra lỗi khi tải domain' || action.result.message,
          };
        }
        return {
          ...state,
          statusDomain: 1,
          resultDomain: action.result.data,
        };
      }
    case LOAD_MENU: // ok
      return {
        ...state,
        statusMenu: 0,
        ukeyMenu: action.ukey,
      };
    case LOAD_MENU_CALLBACK:  // ok
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
          statusMenu: 2,
          errorMenu: action.result.message || 'Đã xảy ra lỗi khi tải danh sách menu',
          };
        }
        return {
          ...state,
          statusMenu: 1,
          menu: action.result.data['get-menu'][0],
          menuFooter: action.result.data['get-menu'][1],
          header: action.result.data['get-header']
        };
      }
    
    case LOAD_BANNER:
      return {
        ...state,
        statusBanner: 0,
        ukeyBanner: action.ukey,
      };
    case LOAD_BANNER_CALLBACK: {
      if (action.result && typeof action.result['banner'] === 'undefined') {
        return {
          ...state,
          statusBanner: 2,
          errorBanner: action.error
        };
      }
      return {
        ...state,
        statusBanner: 1,
        banner: action.result['banner'],
        bannerMenu: action.result['bannerMenu'],
        bannerMenuSmall: action.result['bannerMenuSmall'],
        category: action.result['category']
      };
    }
    case CHANGE_COLINROW: {
      return {
        ...state,
        colInRow: action.data
      };
    }
    case REGISTER_TOKEN_ID:
      return {
        ...state,
        statusRegisterTokenId: 0,
      };
    case REGISTER_TOKEN_ID_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusRegisterTokenId: 2,
            errorRegisterTokenId: action.result.message,
          };
        }
        return {
          ...state,
          statusRegisterTokenId: 1,
          resultRegisterTokenId: action.result.data,
        };
      }
    case CLEAN:
      return initialState;
    default:
      return state;
  }
}
export function getDevice(iObj) {
  const device_token = (typeof iObj.tokenId === 'string') ? iObj.tokenId : '';
  const device_platform = (typeof iObj.platform === 'string') ? iObj.platform : '';
  return {
    types: [GET_DEVICE, GET_DEVICE_CALLBACK, GET_DEVICE_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'init-device',
        ctype: 'function',
        get: '',
        params: {
          device_token,
          device_platform
        }
      },
      headers: {
        key: 'getDevice',
        expire: 365 * 24 * 3600,
        device_token: iObj.tokenId,
      }
    }).then(result => {
      return result;
    })
  };
}
export function load(iObj) {
  if (typeof iObj !== 'object') {
    iObj = {};
  }
  if (typeof iObj.reKey !== 'undefined') {
    iObj.ukey = iObj.reKey;
    const queue = initialState.queue[iObj.ukey] || {};
    iObj = queue.data;
  }
  if (typeof iObj.ukey === 'undefined') {
    iObj.ukey = new Date().getTime();
    initialState.queue[iObj.ukey] = {
      name: 'load',
      data: iObj,
    };
  }
  if (iObj.sid !== null && iObj.sid) {
    return {
      type: LOAD_CALLBACK,
      ukey: iObj.ukey,
      result: {
        status: 'success',
        data: {
          self: true,
          sid: iObj.sid,
        }
      }
    };
  }
  return {
    types: [LOAD, LOAD_CALLBACK, LOAD_CALLBACK],
    ukey: iObj.ukey,
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'init-session',
        ctype: 'function',
        get: '',
        params: ''
      },
      headers: {
        expire: 10 * 60,
        key: 'getSID',
        maxExpire: 24 * 3600// 30 * 24 * 3600
      }
    }).then(result => {
      /*if (result.status !== 'success' || typeof result.data === 'undefined' || result.data.sid === '') {
        throw Error('Error: not install init-session');
      }*/
      return result;
    })
  };
}
export function renewSID() {
  return {
    types: [RENEWSID, RENEWSID_CALLBACK, RENEWSID_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'renew-session',
        ctype: 'function',
        get: '',
        params: ''
      },
      headers: {
        expire: 0,
        maxExpire: 0,
      }
    }).then(result => {
      /*if (result.status !== 'success' || typeof result.data === 'undefined' || result.data.sid === '') {
        throw Error('Error: not install init-session');
      }*/
      return result;
    })
  };
}
export function getTypeDomain(iObj) {
  if (typeof iObj !== 'object') {
    iObj = {};
  }
  if (typeof iObj.reKey !== 'undefined') {
    iObj.ukey = iObj.reKey;
    const queue = initialState.queue[iObj.ukey] || {};
    iObj = queue.data;
  }
  if (typeof iObj.ukey === 'undefined') {
    iObj.ukey = new Date().getTime();
    initialState.queue[iObj.ukey] = {
      name: 'getTypeDomain',
      data: iObj,
    };
  }
  return {
    types: [GET_DOMAIN, GET_DOMAIN_CALLBACK, GET_DOMAIN_CALLBACK],
    ukey: iObj.ukey,
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-domain',
        ctype: 'function',
        get: '',
        params: {
          'name-code': iObj.domain,
        }
      },
      headers: {
        expire: 24 * 3600,
      }
    })
  };
}
export function loadMenu(iObj) {
  if (typeof iObj !== 'object') {
    iObj = {};
  }
  if (typeof iObj.reKey !== 'undefined') {
    iObj.ukey = iObj.reKey;
    const queue = initialState.queue[iObj.ukey] || {};
    iObj = queue.data;
  }
  if (typeof iObj.ukey === 'undefined') {
    iObj.ukey = new Date().getTime();
    initialState.queue[iObj.ukey] = {
      name: 'loadMenu',
      data: iObj,
    };
  }
  return {
    types: [LOAD_MENU, LOAD_MENU_CALLBACK, LOAD_MENU_CALLBACK],
    ukey: iObj.ukey,
    promise: (client) => client.post('/tools/api.php', {
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
        params: ''
      },
      headers: {
        expire: 24 * 3600,
      }
    })
  };
}
export function loadBanner(iObj) {
  if (typeof iObj !== 'object') {
    iObj = {};
  }
  if (typeof iObj.reKey !== 'undefined') {
    iObj.ukey = iObj.reKey;
    const queue = initialState.queue[iObj.ukey] || {};
    iObj.path = queue.data;
  }
  if (typeof iObj.ukey === 'undefined') {
    iObj.ukey = new Date().getTime();
    initialState.queue[iObj.ukey] = {
      name: 'loadBanner',
      data: iObj.data,
    };
  }
  return {
    types: [LOAD_BANNER, LOAD_BANNER_CALLBACK, LOAD_BANNER_CALLBACK],
    ukey: iObj.ukey,
    promise: (client) => client.post('/tools/api.php', {
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
      headers: {
        expire: 3600,
      }
    })
      .then(result => {
        if (result.status !== 'success') {
          throw new Error('Cannot get banner');
        }
        const obj = {
          banner: result.data['get-ads'][0],
          bannerMenu: result.data['get-menu'][0].value,
          bannerMenuSmall: result.data['get-menu'][1].value,
          category: result.data['category-detail'][0]
        };
        return obj;
      })
  };
}
export function reloadData(iObj) {
  if (typeof iObj !== 'object') {
    iObj = {};
  }
  const ukey = iObj.reKey;
  if (typeof ukey === 'undefined') {
    return;
  }
  const queue = initialState.queue[ukey];
  return (dispatch) => {
    const nameFunction = queue.name;
    eval('dispatch(' + nameFunction + '({reKey: ' + ukey + '}))');
  };
}
export function changeColInRow(result) {
  return {
    type: CHANGE_COLINROW,
    data: result,
  };
}

export function clean() {
  return {
    type: CLEAN
  };
}

export function checKTokenId() {
  return {
    types: [CHECK_TOKEN_ID, CHECK_TOKEN_ID_CALLBACK, CHECK_TOKEN_ID_CALLBACK],
    promise: client => client.get('', {
      headers: {
        local: true,
        key: 'getDevice',
      }
    }).then((result) => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    }),
  };
}
export function getSID() {
  return {
    types: [GET_SID, GET_SID_CALLBACK, GET_SID_CALLBACK],
    promise: client => client.get('', {
      headers: {
        local: true,
        key: 'getSID',
      }
    }).then((result) => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    }),
  };
}

export function getData(iObj) {
  return {
    types: [GET_DATA, GET_DATA_CALLBACK, GET_DATA_CALLBACK],
    promise: client => client.get('', {
      headers: {
        local: true,
        key: iObj.key,
      }
    }).then((result) => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    }),
  };
}
export function setData(iObj) {
  return {
    types: [SET_DATA, SET_DATA_CALLBACK, SET_DATA_CALLBACK],
    promise: client => client.post('', {
      data: {
        body: iObj.value,
      },
      headers: {
        local: true,
        key: iObj.key,
      }
    }).then((result) => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    }),
  };
}

export function registerTokenId(obj) {
  return {
    types: [REGISTER_TOKEN_ID, REGISTER_TOKEN_ID_CALLBACK, REGISTER_TOKEN_ID_CALLBACK],
    promise: client => client.post('/tools/api.php', {
      data: {
        call: 'register-device-token',
        ctype: 'function',
        get: '',
        params: {
          device_token: obj.device_token,
          device_platform: obj.device_platform,
        },
        headers: {
          expire: 0,
          device_token: obj.device_token,
        }
      },
    }).then((result) => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    }),
  };
}
