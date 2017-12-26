// import { createSelector } from 'reselect';// const LOAD = 'cm/Product/LOAD';
import findKey from 'lodash/findKey';
import { deepFind } from '../../utils/utils';
import { map } from '../../utils/object';
// const LOAD_SUCCESS = 'cm/Product/LOAD_SUCCESS';
// const LOAD_FAIL = 'cm/Product/LOAD_FAIL';
const CLEAN = 'cm/Product/CLEAN';
const LOAD_ARTICAL = 'Product/LOAD_ARTICAL';
const LOAD_ARTICAL_CALLBACK = 'Product/LOAD_ARTICAL_CALLBACK';
const OK_BANNER = 'Product/OK_BANNER';
const CANCEL_BANNER = 'Product/CANCEL_BANNER';
const CANCEL_NOTI = './Product/CANCEL_NOTI';
const REQUEST_VICE = './Product/REQUEST_VICE';
const REQUEST_VICE_CALLBACK = './Product/REQUEST_VICE_CALLBACK';
const OK_NOTI = './Product/OK_NOTI';
const REQUEST_PROJECT = './Product/REQUEST_PROJECT';
const REQUEST_PROJECT_CALLBACK = './Product/REQUEST_PROJECT_CALLBACK';
const LOAD_LIST_INVESTOR_EXCHANGE = './Product/LOAD_LIST_INVESTOR_EXCHANGE';
const LOAD_LIST_INVESTOR_EXCHANGE_CALLBACK = './Product/LOAD_LIST_INVESTOR_EXCHANGE_CALLBACK';
const ADD_DATA_PRODUCT = './Product/ADD_DATA_PRODUCT';
const CLEAR_URL_PRODUCT = './Product/CLEAR_URL_PRODUCT';
const GET_MATRIX_PRICE = './Product/GET_MATRIX_PRICE';
const GET_MATRIX_PRICE_CALLBACK = './Product/GET_MATRIX_PRICE_CALLBACK';
const CLEAR = './Product/CLEAR';

const initialState = {
  loading: true,
  loaded: false,
  product: {},
  brands: [],
  variantKey: {},
};

export default function product(state = initialState, action = {}) {
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
    case OK_BANNER:
      return {
        ...state,
        okBanner: true
      };
    case CANCEL_BANNER:
      return {
        ...state,
        okBanner: false
      };
    case LOAD_ARTICAL: {
      return {
        ...state,
        /* promise: (client, dispatch, getState) => {
          console.log(60, getState());
          return true;
        },*/
        /* ...createSelector(
        [
          _state => {
            return (_state);
          }
        ],
        (product) => {
          return ({
            product,
            // cartTotalPrice: items.reduce((prev, next) => prev + next.count * next.price, 0)
            // menu
          })
        }
      )(state),*/
        statusProduct: 0,
      };
    }
    case LOAD_ARTICAL_CALLBACK:
      if (action.result.status !== 'success') {
        return {
          ...state,
          statusProduct: 2,
          loading: false,
          loaded: false,
          productError: action.error
        };
      }
      let brands = [];
      try {
        const key = deepFind(state.product.filter, 2, findKey, (f) => f.name_code === 'thuong-hieu');
        brands = map(state.product.filter_value[key], o => o.name);
      } catch (e) {}
      return {
        ...state,
        statusProduct: 1,
        loading: false,
        loaded: true,
        brands,
        product: action.result
      };
    /* case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      {
        return {
          ...state,
          loading: false,
          loaded: true,
          product: action.result
        };
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };*/
    case OK_NOTI:
      return {
        ...state,
        notification: action.error
      };
    case ADD_DATA_PRODUCT:
      {
        return {
          ...state,
          addUrlProduct: action.url,
          idProduct: action.idProduct,
          product: action.product,
        };
      }
    case GET_MATRIX_PRICE: {
      return {
        ...state,
        loadingGetMatrix: true,
      }
    }
    case GET_MATRIX_PRICE_CALLBACK: {
      if (action.result.status !== 'success') {
        return {
          ...state,
          loadingGetMatrix: false,
          loadedGetMatrix: false,
          matrixError: action.error
        };
      }
      return {
        ...state,
        loadingGetMatrix: false,
        loadedGetMatrix: true,
        matrixPriceProduct: action.result.data,
      };
    }
    case CLEAR_URL_PRODUCT:
      {
        return {
          ...state,
          addUrlProduct: undefined,
          // product: {},
        };
      }
    case CANCEL_NOTI:
      return {
        ...state,
        notification: undefined,
      };
    case CLEAR:
      return {
        ...state,
        investorExchangeLoaded: false,
      };
    case CLEAN:
      return initialState;
    default:
      return state;
  }
}
export function getMatrixPrice({ aid, vid }) {
  return {
    types: [GET_MATRIX_PRICE, GET_MATRIX_PRICE_CALLBACK, GET_MATRIX_PRICE_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-matrix-price',
        ctype: 'function',
        get: '',
        params: {
          aid,
          vid,
        }
      },
      headers: {
        expire: 60,
      }
    })
  }
}
// lay thong tin chi tiet san pham
export function load({ path, id = 0 }) {
  return {
    types: [LOAD_ARTICAL, LOAD_ARTICAL_CALLBACK, LOAD_ARTICAL_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'article',
        ctype: 'page',
        get: [{
          'article-detail': [{
            ...(id > 0 ? {id: id} : {'name-code': path}),
            filter: 1,
            extend: 1,
            breadcrumb: 1,
            combo: 1,
            location: 1,
            real_estate: 1,
          }]
        }]
      },
      headers: {
        expire: 300,
      }
    }).then(result => {
      let data = result && result.data && result.data['article-detail'] ? result.data['article-detail'][0] : {};
      if (Object.keys(data).length === 0) {
        data = {};
      }
      data.status = result.status;
      return data;
    })
  };
}
export function addDataProduct(product) {
  let url;
  try {
    const protomatch = /^(https?|ftp):\/\//;
    url = product.path.replace(protomatch, '');
    const position = url.indexOf('/');
    url = product.path.slice(position);
  } catch (e) {}
  return {
    type: ADD_DATA_PRODUCT,
    url,
    idProduct: product.id,
    product,
  };
}
export function clearUrlProduct(url) {
  return {
    type: CLEAR_URL_PRODUCT,
  };
}
export function cancelNoti() {
  return {
    type: CANCEL_NOTI
  };
}
export function okBanner() {
  return {
    type: OK_BANNER
  };
}
export function cancelBanner() {
  return {
    type: CANCEL_BANNER
  };
}
export function clearProps() {
  return {
    type: CLEAR
  };
}
export function clean() {
  return {
    type: CLEAN
  };
}
