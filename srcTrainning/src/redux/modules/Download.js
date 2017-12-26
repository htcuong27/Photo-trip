

const LOAD = 'Download/LOAD';
const LOAD_CALLBACK = 'Download/LOAD_CALLBACK';
const COUNTLOAD = 'Download/COUNTLOAD';
const COUNTLOAD_CALLBACK = 'Download/COUNTLOAD_CALLBACK';

const CLEAN = 'Download/CLEAN';

const initialState = {
  result: {},
  statusLoad: 0,
  statusCountLoad: 0,
  resultCountLoad: {},
  dataCountLoad: 0,
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
    case LOAD: {
      return {
        ...state,
        errorLoad: null,
        statusLoad: 0,
      };
    }
    case LOAD_CALLBACK: {
      return {
        ...state,
        statusLoad: 2,
        result: action.result,
      };
    }
    case COUNTLOAD:
      return {
        ...state,
        statusCountLoad: 0,
      };
    case COUNTLOAD_CALLBACK: {
      return {
        ...state,
        statusCountLoad: 2,
        resultCountLoad: action.result
      };
    }
    case CLEAN:
      return initialState;
    default:
      return state;
  }
}

export function load(iObj) {
  if (typeof iObj !== 'object') {
    iObj = {};
  }
  if (typeof iObj.method === 'undefined' || iObj.method !== 'post') {
    iObj.method = 'get';
  }
  if (typeof iObj.expire === 'undefined' || iObj.expire < 0) {
    iObj.expire = 0;
  }
  if (typeof iObj.timeout === 'undefined' || iObj.timeout < 200) {
    iObj.timeout = 8000;
  }
  if (typeof iObj.type !== 'string') {
    iObj.type = undefined;
  }
  if (typeof iObj.limit === 'undefined') {
    iObj.limit = 10;
  }
  const sendData = {
    headers: {
      type: iObj.type,
      expire: iObj.expire,
      timeout: iObj.timeout,
    }
  };
  if (iObj.method === 'post') {
    sendData.data = iObj.data;
  }
  initialState.dataCountLoad += 1;
  const dataCountLoad = initialState.dataCountLoad;
  if (dataCountLoad > iObj.limit) {
    return {
      type: LOAD_CALLBACK,
      promise: (client) => client.get('', {
        headers: {
          local: true
        }
      }).then(() => {
        const result = {
          status: 'waiting',
          data: dataCountLoad
        };
        initialState.dataCountLoad -= 1;
        return result;
      })
    };
  }
  return {
    types: [LOAD, LOAD_CALLBACK, LOAD_CALLBACK],
    promise: (client) => client[iObj.method](iObj.uri, sendData).then((result) => {
      initialState.dataCountLoad -= 1;
      return result;
    })
  };
}

export function countLoad() {

  // { keyword, page = 1, pageSize = 40, category_id = '' }
  return {
    types: [COUNTLOAD, COUNTLOAD_CALLBACK, COUNTLOAD_CALLBACK],
    promise: (client) => client.get('', {
      headers: {
        local: true,
        isCount: true,
      }
    })
  };
}

export function abortAll() {

  // { keyword, page = 1, pageSize = 40, category_id = '' }
  return {
    types: [COUNTLOAD, COUNTLOAD_CALLBACK, COUNTLOAD_CALLBACK],
    promise: (client) => client.get('', {
      headers: {
        abortAll: true,
      }
    })
  };
}

export function deleteAll() {

  // { keyword, page = 1, pageSize = 40, category_id = '' }
  return {
    types: [COUNTLOAD, COUNTLOAD_CALLBACK, COUNTLOAD_CALLBACK],
    promise: (client) => client.get('', {
      headers: {
        deleteAll: true,
      }
    })
  };
}

export function clean() {
  return {
    type: CLEAN
  };
}
