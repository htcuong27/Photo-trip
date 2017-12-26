


const CLEAR = 'Person/CLEAR';
const ORDER = 'Person/ORDER';
const ORDER_CALLBACK = 'Person/ORDER_CALLBACK';
const CLEAR_ORDER = 'Person/CLEAR_ORDER';

const initialState = {
  queue: {},
  loading: false,
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
        orderError: null,
      };
    case ORDER:
      return {
        ...state,
        loading: true,
        orderError: null,
      };
    case ORDER_CALLBACK:
      if (action.result.status !== 'success') {
        return {
          ...state,
          loading: false,
          data: {},
          orderError: action.error,
        };
      }
      return {
        ...state,
        loading: false,
        data: action.result.data,
        orderError: null,
      };
    case CLEAR_ORDER:
      return initialState;
    default:
      return state;
  }
}

export function clear(errorType) {
  return {
    type: CLEAR,
    errorType
  };
}
export function clearOrder(errorType) {
  return {
    type: CLEAR_ORDER,
  };
}

export function getOrder({ code }) {
  return {
    types: [ORDER, ORDER_CALLBACK, ORDER_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-order',
        ctype: 'function',
        get: '',
        params: {
          code,
        }
      },
      headers: {
        expire: 0,
      }
    })
  };
}
