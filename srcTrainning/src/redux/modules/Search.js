import CryptoJS from 'crypto-js';
import { serialize } from '../../utils/utils';

const SEARCH = 'Search/SEARCH';
const SEARCH_CALLBACK = 'Search/SEARCH_CALLBACK';
const CLEAN = 'Search/CLEAN';

const initialState = {
  queue: {},
  result: {},
  statusSearch: 1,
  lastMd5: '',
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
    case SEARCH:
      return {
        ...state,
        errorSearch: null,
        statusSearch: 0,
      };
    case SEARCH_CALLBACK: {
      if (action.result.status !== 'success') {
        return {
          ...state,
        statusSearch: 2,
        result: null,
        errorSearch: action.error
        };
      }
      return {
        ...state,
        statusSearch: 1,
        keyword: action.result.keyword,
        result: action.result.data
      };
    }
    case CLEAN:
      return initialState;
    default:
      return state;
  }
}

export function search(iObj) {
  const data = {
    call: 'search-new',
    ctype: 'function',
    get: '',
    params: {
      keyword: iObj.keyword,
      category_id: iObj.category_id,
      filter: '',
      page: iObj.page || 1,
      page_size: iObj.pageSize || 40,
    }
  };
  const serializeData = serialize(data);
  const md5 = CryptoJS.MD5('/tools/api.php' + serializeData.length + serializeData).toString();
  const lastMd5 = initialState.lastMd5;
  initialState.lastMd5 = md5;

  // { keyword, page = 1, pageSize = 40, category_id = '' }
  return {
    types: [SEARCH, SEARCH_CALLBACK, SEARCH_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data,
      headers: {
        lastKey: lastMd5,
        key: md5,
        group: {
          timeWaiting: 1.2,
          name: 'loadSearch',
        },
        expire: 0,
      }
    }).then(result => {
      if (result.status !== 'success') {
        throw Error(result.message);
      }
      const data = result.data;
      if (!data || data.total_result === 0 || data.total_page === 0) {
        throw Error('Không tìm thấy kết quả phù hợp');
      }
      const status = result.status;
      return { keyword: iObj.keyword, data, status };
    })
  };
}


export function clean() {
  return {
    type: CLEAN
  };
}
