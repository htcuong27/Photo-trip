

const VALIDATEACCESS = 'Auth/VALIDATEACCESS';
const VALIDATEACCESS_CALLBACK = 'Auth/VALIDATEACCESS_CALLBACK';
const LOAD = 'Auth/LOAD';
const LOAD_CALLBACK = 'Auth/LOAD_CALLBACK';
const CLEAR = 'Auth/CLEAR';
const EMIT_ERROR = 'Auth/EMIT_ERROR';
const LOGIN = 'Auth/LOGIN';
const LOGIN_CALLBACK = 'Auth/LOGIN_CALLBACK';
const LOGOUT = 'Auth/LOGOUT';
const LOGOUT_CALLBACK = 'Auth/LOGOUT_CALLBACK';
const REGISTER = 'Auth/REGISTER';
const REGISTER_CALLBACK = 'Auth/REGISTER_CALLBACK';
const RECOVER = 'Auth/RECOVER';
const RECOVER_CALLBACK = 'Auth/RECOVER_CALLBACK';
const RESET = 'Auth/RESET';
const RESET_CALLBACK = 'Auth/RESET_CALLBACK';
// const CHANGE_ACCOUNT = 'Auth/CHANGE_ACCOUNT';
// const CHANGE_ACCOUNT_CALLBACK = 'Auth/CHANGE_ACCOUNT_CALLBACK';
// const CLEAR_CHANGE_ACCOUNT = 'Auth/CLEAR_CHANGE_ACCOUNT';
const CLEAR_EMAIL_SENT = 'Auth/CLEAR_EMAIL_SENT';
const CLEAN = 'Auth/CLEAN';
const GETUSERINFO = 'Auth/GETUSERINFO';
const GETUSERINFO_CALLBACK = 'Auth/GETUSERINFO_CALLBACK';

const initialState = {
  user: {},
  queue: {},
  validateStatus: 0,
  validateResult: '',
};

export default function reducer(state = initialState, action = {}) {
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
    case VALIDATEACCESS:
      return {
        ...state,
        validateStatus: 0,
      };
    case VALIDATEACCESS_CALLBACK:
      return {
        ...state,
        validateStatus: 2,
        validateResult: action.result,
      };
    case LOAD:
      return {
        ...state,
        statusAuth: 0,
        ukeyAuth: action.ukey,
      };
    case LOAD_CALLBACK:
      if (action.result.status !== 'success') {
        return {
          ...state,
          statusAuth: 2,
          errorAuth: 'Đã xảy ra lỗi khi tải thông tin thành viên' || action.result.message,
        };
      }
      return {
        ...state,
        statusAuth: 1,
        user: action.result.data,
      };
    case GETUSERINFO: {
      return {
        ...state,
        statusUserInfo: 0,
      };
    }
    case GETUSERINFO_CALLBACK: {
      return {
        ...state,
        statusUserInfo: 2,
        user: action.result.data,
      };
    }
    /* case CHANGE_ACCOUNT:
      return {
        ...state,
        changeAccountLoading: true
      };
    case CHANGE_ACCOUNT_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            changeAccountLoading: false,
            changeAccountLoaded: false,
            changeAccountError: action.error
          };
        }
        return {
          ...state,
          changeAccountLoading: false,
          changeAccountLoaded: true,
          user: action.result.data,
        };
      }*/
    case CLEAR:
      if (action.errorType) {
        return {
          ...state,
          [action.errorType]: null
        };
      }
      return {
        ...state,
        error: null,
        errorLogin: null,
        errorLogout: null,
        errorRegister: null
      };
    /* case CLEAR_CHANGE_ACCOUNT:
      return {
        ...state,
        changeAccountLoaded: false,
      };*/
    case EMIT_ERROR:
      return {
        ...state,
        [action.field ? `${action.field}Error` : 'error']: action.error,
      };
    case LOGIN:
      return {
        ...state,
        statusLogin: 0,
        errorLogin: null,
      };
    case LOGIN_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusLogin: 2,
            user: {},
            errorLogin: action.result.message,
          };
        }
        return {
          ...state,
          statusLogin: 1,
          user: action.result.data,
          errorLogin: null,
          error: null,
        };
      }
    case REGISTER:
      return {
        ...state,
        statusRegister: 0
      };
    case REGISTER_CALLBACK:
      if (action.result.status !== 'success') {
        return {
          ...state,
          statusRegister: 2,
          errorRegister: action.result.messgage,
        };
      }
      return {
        ...state,
        statusRegister: 1,
        user: action.result.data,
      };
    case LOGOUT:
      return {
        ...state,
        statusLogout: 0,
        ukeyLogout: action.ukey,
      };
    case LOGOUT_CALLBACK:
      if (action.result.status !== 'success') {
        return {
          ...state,
          statusLogout: 2,
          errorLogout: action.error
        };
      }
      return {
        ...state,
        statusLogout: 1,
        user: {}
      };
    case RECOVER:
      return {
        ...state,
        statusRecover: 0,
        ukeyRecover: action.ukey,
      };
    case RECOVER_CALLBACK:
      if (action.result.status !== 'success') {
        return {
          ...state,
          statusRecover: 2,
          errorRecover: action.error
        };
      }
      return {
        ...state,
        resultSendEmail: action.result.data,
        statusRecover: 1,
      };
    case RESET:
      return {
        ...state,
        statusReset: 0,
        ukeyReset: action.ukey,
      };
    case RESET_CALLBACK:
      if (action.result.status !== 'success') {
        return {
          ...state,
          statusReset: 2,
          errorReset: action.error
        };
      }
      return {
        ...state,
        statusReset: 1,
        emailSent: action.result.data,
      };
    case CLEAR_EMAIL_SENT:
      {
        return {
          ...state,
          emailSent: false,
        };
      }
    case CLEAN:
      return initialState;
    default:
      return state;
  }
}

/* export function isLoaded(state = initialState) {
  const output = (state && state.loaded);
  return output;
}
*//*
export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}
*/

export function load(iObj) {
  if (typeof iObj !== 'object') {
    iObj = {};
  }
  if (typeof iObj.reKey !== 'undefined') {
    iObj.ukey = iObj.reKey;
    const queue = initialState.queue[iObj.ukey] || {};
    iObj = queue.data;
  }
  if (typeof iObj.isCache === 'undefined' || iObj.isCache !== false) {
    iObj.isCache = true;
  }
  if (typeof iObj.ukey === 'undefined') {
    iObj.ukey = new Date().getTime();
    initialState.queue[iObj.ukey] = {
      name: 'load',
      data: iObj,
    };
  }
  return (dispatch) => dispatch({
    types: [LOAD, LOAD_CALLBACK, LOAD_CALLBACK],
    ukey: iObj.ukey,
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'check-login',
        ctype: 'function',
        get: '',
        params: ''
      },
      headers: {
        checkCache: iObj.isCache,
        expire: 24 * 3600,
      }
    }).then(result => {
      if (!result.data || !result.data.info || !result.data.info.uid) {
        return { ...result, data: null };
      }
      if (result.status === "success" && iObj.isCache === false && result.data.info && result.data.info.uid)
      {
        saveInfoUser(client, result.data)
      }
      return result;
    })
  });
}

export function clear(errorType) {
  return {
    type: CLEAR,
    errorType
  };
}

export function emitError(field, error) {
  return {
    type: EMIT_ERROR,
    field,
    error
  };
}
export function putUserInfo(user) {
  return {
    type: GETUSERINFO_CALLBACK,
    result: user,
  };
}
export function getUserInfo(user) {
  return {
    types: [GETUSERINFO, GETUSERINFO_CALLBACK, GETUSERINFO_CALLBACK],
    // ukey: iObj.ukey,
    promise: (client, dispatch) => client.get('', {
      headers: {
        local: true,
        key: 'userinfo',
      }
    })
  };
}

export function login(iObj) {
  /* if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('userinfo');
  } else {
  }*/
  /* if (typeof iObj !== 'object') {
    iObj = {};
  }
  if (typeof iObj.reKey !== 'undefined') {
    iObj.ukey = iObj.reKey;
    const queue = initialState.queue[iObj.ukey] || {};
    iObj = queue;
  }
  if (typeof iObj.ukey === 'undefined') {
    iObj.ukey = new Date().getTime();
    initialState.queue[iObj.ukey] = {
      name: 'login',
      data: iObj,
    };
  }*/
  return {
    types: [LOGIN, LOGIN_CALLBACK, LOGIN_CALLBACK],
    // ukey: iObj.ukey,
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'login',
        ctype: 'function',
        get: '',
        params: {
          email: iObj.username,
          passwd: iObj.password
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      if (result.status === 'success') {
        // store user and pass
        console.log('login success', result);
        saveInfoUser(client, result.data)
        //sessionStorage.clear();
        return result;
      }
      return result;
    })
  };
}


function saveInfoUser(client, userinfo) {
  let uid = 0;
  let password = '';
  if (userinfo !== null && typeof userinfo.info != 'undefined') {
      if (typeof userinfo.info.uid != 'undefined') {
          uid = userinfo.info.uid;
      }
      if (typeof userinfo.info.remember_pass != 'undefined') {
          password = userinfo.info.remember_pass;
      } 
  }// save to cach
  console.log('userinfo', userinfo)
  client.post('', {
    data: {
      uid: uid,
      passwd: password,
      data: userinfo
    },
    headers: {
      local: true,
      key: 'userinfo',
      expire: 365 * 24 *3600,
    }
  });
}

export function quickLogin({ username, sid }) {
  /* if (typeof iObj !== 'object') {
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
      name: 'quickLogin',
      data: {
        username,
        sid,
      },
    };
  }*/
  return {
    types: [LOGIN, LOGIN_CALLBACK, LOGIN_CALLBACK],
    // ukey: iObj.ukey,
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'buy-notlogin',
        ctype: 'function',
        get: '',
        params: {
          email: username,
          fullname: 'Guest',
          quick_login: 1,
        },
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function validateAccessToken({ provider, token }) {
  if (typeof provider !== 'string' && provider !== 'facebook' && provider !== 'gmail') {
    return {
      type: VALIDATEACCESS_CALLBACK,
      result: {
        status: 'error',
        message: 'no provider',
      }
    };
  }
  return {
    types: [VALIDATEACCESS, VALIDATEACCESS_CALLBACK, VALIDATEACCESS_CALLBACK],
    promise: (client) => client.post('http://www.vipn.net/Auth/' + provider + '/{hostname}/{sid}', {
      data: {
        token,
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
/* export function changeAccount(gid) {
  return {
    types: [CHANGE_ACCOUNT, CHANGE_ACCOUNT_CALLBACK, CHANGE_ACCOUNT_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'change-account',
        ctype: 'function',
        get: '',
        params: {
          gid
        },
      }
    }).then(result => {
        if (result.status === 'success') {
            // store user and pass
            const userinfo = result.data;
            let uid = 0;
            let password = '';
            if (userinfo !== null && typeof userinfo.info != 'undefined') {
                if (typeof userinfo.info.uid != 'undefined') {
                    uid = userinfo.info.uid;
                }
                if (typeof userinfo.info.remember_pass != 'undefined') {
                    password = userinfo.info.remember_pass;
                }
            }
            localStorage.setItem('userinfo', JSON.stringify({
              uid: uid,
              passwd: password,
              userinfo
            }));
            //sessionStorage.clear();
            return result;
          }
          return result;
    })
  };
}*/
export function logout(iObj) {
  if (typeof iObj !== 'object') {
    iObj = {};
  }
  if (typeof iObj.reKey !== 'undefined') {
    iObj.ukey = iObj.reKey;
    const queue = initialState.queue[iObj.ukey] || {};
    iObj = queue;
  }
  if (typeof iObj.ukey === 'undefined') {
    iObj.ukey = new Date().getTime();
    initialState.queue[iObj.ukey] = {
      name: 'logout',
      data: iObj,
    };
  }
  return {
    types: [LOGOUT, LOGOUT_CALLBACK, LOGOUT_CALLBACK],
    ukey: iObj.ukey,
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'logout',
        ctype: 'function',
        get: '',
        params: ''
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      // clear all data cache
      client.post('', {
        headers: {
          deleteAll: true,
        }
      });
      return result;
    })
  };
}

export function register({ fullname, email, username, password, captcha, sid, provider, social, phone_number }) {
  /* if (typeof iObj !== 'object') {
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
      name: 'register',
      data: {
        fullname,
        email,
        username,
        password,
        captcha,
        sid,
        provider,
        social,
      },
    };
  }*/
  if (typeof phone_number === 'undefined') {
    phone_number = '';
  }
  return {
    types: [REGISTER, REGISTER_CALLBACK, REGISTER_CALLBACK],
    // ukey: iObj.ukey,
    promise: (client, dispatch) => client.post('/tools/api.php', {
      data: (provider && social) ? {
        call: 'register',
        ctype: 'function',
        get: '',
        params: {
          fullname,
          email,
          username,
          passwd: password,
          captcha,
          provider,
          social,
          phone_number,
        },
        sid
      } : {
        call: 'register',
        ctype: 'function',
        get: '',
        params: {
          fullname,
          email,
          username,
          passwd: password,
          captcha,
          phone_number,
        },
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      if (result.status === 'success') {
        // store user and pass
        saveInfoUser(client, result.data)
        //sessionStorage.clear();
        return result;
      }
      return result;
    })
  };
}

export function recover({ email }) {
  /* if (typeof iObj !== 'object') {
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
      name: 'recover',
      data: {
        email,
      },
    };
  }*/
  return {
    types: [RECOVER, RECOVER_CALLBACK, RECOVER_CALLBACK],
    // ukey: iObj.ukey,
    promise: client => client.post('/tools/api.php', {
      data: {
        call: 'forgot-password',
        ctype: 'function',
        get: '',
        params: {
          email
        }
      },
      headers: {
        expire: 0,
      }
    })
  };
}

export function reset({ code, captcha, password, rePassword }) {
  if (code === '') {
    console.log('132')
    return {
      type: RESET_CALLBACK,
      error: 'Vui lòng nhập mã kích hoạt',
    }
  } else if (captcha === '') {
    return {
      type: RESET_CALLBACK,
      error: 'Vui lòng nhập mã xác thực',
    }
  } else if (password !== rePassword) {
    return {
      type: RESET_CALLBACK,
      error: 'Mật khẩu lặp lại không trùng khớp',
    }
  }
  /* if (typeof iObj !== 'object') {
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
      name: 'reset',
      data: {
        code,
        captcha,
        password,
        rePassword,
      },
    };
  }*/
  return {
    types: [RESET, RESET_CALLBACK, RESET_CALLBACK],
    // ukey: iObj.ukey,
    promise: client => client.post('/tools/api.php', {
      data: {
        call: 'forgot-password',
        ctype: 'function',
        get: '',
        params: {
          active_code: code,
          captcha,
          password,
          re_password: rePassword
        }
      },
      headers: {
        expire: 0,
      }
    })
  };
}
export function clearEmailSent() {
  return {
    type: CLEAR_EMAIL_SENT
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
/* export function clearPropsChangeAccount() {
  return {
    type: CLEAR_CHANGE_ACCOUNT
  };
}*/
export function clean() {
  return {
    type: CLEAN
  };
}
