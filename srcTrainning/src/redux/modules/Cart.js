

import config from '../../config';
import findKey from 'lodash/findKey';
import { map } from '../../utils/object';
const SAVE_CART = 'Cart/SAVE_CART';
const SAVE_CART_CALLBACK = 'Cart/SAVE_CART_CALLBACK';
const INITIALIZE = 'Cart/INITIALIZE';
const INITIALIZE_CALLBACK = 'Cart/INITIALIZE_CALLBACK';
const INITIALIZEWITHUSER = 'Cart/INITIALIZEWITHUSER';
const INITIALIZEWITHUSER_CALLBACK = 'Cart/INITIALIZEWITHUSER_CALLBACK';
const REMOVE_ITEM = 'Cart/REMOVE_ITEM';
const REMOVE_ITEM_CALLBACK = 'Cart/REMOVE_ITEM_CALLBACK';
const LOAD_ADDRESS = 'Cart/LOAD_ADDRESS';
const LOAD_ADDRESS_CALLBACK = 'Cart/LOAD_ADDRESS_CALLBACK';
const REMOVE_ADDRESS = 'Cart/REMOVE_ADDRESS';
const REMOVE_ADDRESS_CALLBACK = 'Cart/REMOVE_ADDRESS_CALLBACK';
const SERVICE_PACKAGE = 'Cart/SERVICE_PACKAGE';
const SERVICE_PACKAGE_CALLBACK = 'Cart/SERVICE_PACKAGE_CALLBACK';
const SET_PREF = 'cm/Cart/SET_PREF';
const CLEAR_PREF_SERVICE = 'Cart/CLEAR_PREF_SERVICE';
const CLEAR_PREF_SERVICE_CALLBACK = 'Cart/CLEAR_PREF_SERVICE_CALLBACK';
const SELECT_SERVICE_PACKAGE = 'Cart/SELECT_SERVICE_PACKAGE';
const SELECT_SERVICE_PACKAGE_CALLBACK = 'Cart/SELECT_SERVICE_PACKAGE_CALLBACK';
const USE_DISCOUNT = 'Cart/USE_DISCOUNT';
const USE_DISCOUNT_CALLBACK = 'Cart/USE_DISCOUNT_CALLBACK';
const DELETE_USE_DISCOUNT = 'Cart/DELETE_USE_DISCOUNT';
const DELETE_USE_DISCOUNT_CALLBACK = 'Cart/DELETE_USE_DISCOUNT_CALLBACK';
const SEARCH_ADDRESS = 'Cart/SEARCH_ADDRESS';
const SEARCH_ADDRESS_CALLBACK = 'Cart/SEARCH_ADDRESS_CALLBACK';
const ADD_LOCATION = 'Cart/ADD_LOCATION';
const GET_TRANS_FEE = 'Cart/GET_TRANS_FEE';
const GET_TRANS_FEE_CALLBACK = 'Cart/GET_TRANS_FEE_CALLBACK';
const CLEAR_SUCCESS = 'Cart/CLEAR_SUCCESS';
const CHECKOUT = 'Cart/CHECKOUT';
const CHECKOUT_CALLBACK = 'Cart/CHECKOUT_CALLBACK';
const SELECT_ADDRESS = 'Cart/SELECT_ADDRESS';
const CLEAN_CART_FOR_NAME = 'Cart/CLEAN_CART_FOR_NAME';
const CLEAN_RESULT_SEARCH_ADDRESS = 'Cart/CLEAN_RESULT_SEARCH_ADDRESS';
const CLEAN = 'Cart/CLEAN';

const initialState = {
  items: [],
  statusSelectService: 0,
  statusCart: 0,
  ukey: {},
  queue: {},
  statusAddress: 0,
  addressList: [],
  selectedAddress: {
    bill: null,
    delivery: null,
  },
  pref: {
    payment: null,
    receiving: 0,
    receivingTime: [],
  },
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
    case INITIALIZE:
      return {
        ...state,
        statusCart: 0,
        ukeyCart: action.ukey,
      };
    case INITIALIZE_CALLBACK: {
      if (action.result && typeof action.result === 'object' && Object.keys(action.result) && !Object.keys(action.result).length) {
        return {
          ...state,
          statusCart: 2,
          errorCart: action.error && (action.error.message || action.error.error || JSON.stringify(action.error))
        };
      }
      let items, serviceFee, transFee, total_net_profit, total_profit, total_tax, total_amount, product_amount;
      if (typeof action.result !== 'undefined' && typeof action.result['get-cart'] !== 'undefined' &&
        typeof action.result['get-cart'][0] !== 'undefined' && action.result['get-cart'][0].status === 'success') {
        items = action.result['get-cart'][0].data.product || [];
        serviceFee = action.result['get-cart'][0].data.service_fee || {};
        transFee = action.result['get-cart'][0].data.transport_fee || {};
        total_net_profit = action.result['get-cart'][0].data.total_net_profit || 0;
        total_profit = action.result['get-cart'][0].data.total_profit || 0;
        total_tax = action.result['get-cart'][0].data.total_tax || 0;
        total_amount = action.result['get-cart'][0].data.total_amount;
        product_amount = action.result['get-cart'][0].data.product_amount;
      }
      return {
        ...state,
        statusWithUserCart: 1,
        items,
        serviceFee,
        transFee,
        total_net_profit,
        total_profit,
        total_tax,
        product_amount,
        total_amount
      };
    }
    case INITIALIZEWITHUSER:
      return {
        ...state,
        statusWithUserCart: 0,
      };
    case INITIALIZEWITHUSER_CALLBACK: {
      if (action.result && typeof action.result === 'object' && Object.keys(action.result) && !Object.keys(action.result).length) {
        return {
          ...state,
          statusWithUserCart: 2,
          errorCart: action.error && (action.error.message || action.error.error || JSON.stringify(action.error))
        };
      }
      let deliveryAddress, billAddress, payment, deliveryTime;
      if (typeof action.result !== 'undefined') {
        if (typeof action.result['get-delivery-time'] !== 'undefined') {
          deliveryTime = action.result['get-delivery-time'][0];
        }
        if (typeof action.result['get-payment'] !== 'undefined') {
          payment = action.result['get-payment'][0];
        }
        if (typeof action.result['get-delivery-address'] !== 'undefined' && 
          typeof action.result['get-delivery-address'][0] !== 'undefined' ) {
          billAddress = action.result['get-delivery-address'][0].bill;
          deliveryAddress = action.result['get-delivery-address'][0].delivery;
        }
      }
      if (typeof deliverTime !== 'undefined' && typeof deliveryTime.list_time === 'undefined') {
        return {
          ...state,
          statusWithUserCart: 2,
          errorCart: 'Error server' + JSON.stringify(deliveryTime)
        };
      }
      
      return {
        ...state,
        statusCart: 1,
        deliveryTime,
        deliveryAddress,
        billAddress,
        payment,
      };
    }
    case CLEAR_PREF_SERVICE: {
      return {
        ...state,
        statusClearPrefService: 0,
      }
    }
    case CLEAN_RESULT_SEARCH_ADDRESS: {
      return {
        ...state,
        searchAddressResult: {},
      }
    }
    case CLEAR_PREF_SERVICE_CALLBACK: {
      if (action.result.status !== 'success') {
        return {
          ...state,
          statusClearPrefService: 2,
          pref: { ...state.pref, service: null },
        };
      }
      let serviceFee;
      try {
        serviceFee = action.result.status === 'success' ? action.result.data.service_fee : 0;
      } catch (e) {
        console.log(e);
      }
      return {
        ...state,
        statusClearPrefService: 1,
        pref: { ...state.pref, service: null },
        serviceFee,
      };
    }
    case SELECT_SERVICE_PACKAGE:
      return {
        ...state,
        statusSelectService: 0,
      }
    case SELECT_SERVICE_PACKAGE_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusSelectService: 2,
          }
        }
        return {
          ...state,
          statusSelectService: 1,
          items: action.result.data.product,
          serviceFee: action.result.data.service_fee,
          total_net_profit: action.result.data.total_net_profit,
          total_profit: action.result.data.total_profit,
          total_tax: action.result.data.total_tax,
        }
      }
    case SET_PREF:
      return {
        ...state,
        pref: { ...state.pref, [action.name]: action.value },
      }
      // return update(state, { pref: { [action.name]: { $set: action.value } } });
    case REMOVE_ITEM:
      {
        return state;
      }
    case REMOVE_ITEM_CALLBACK:
      {
        if (typeof action.result[0] === 'undefined') {
          return {
            ...state,
            removeError: action.error,
          };
        }
        const dataCallBack =  action.result[0];
        let items, serviceFee, transFee, total_net_profit, total_profit, total_tax, total_amount, product_amount;
        if (typeof dataCallBack !== 'undefined') {
          items = dataCallBack.product || [];
          serviceFee = dataCallBack.service_fee || {};
          transFee = dataCallBack.transport_fee || {};
          total_net_profit =dataCallBack.total_net_profit || 0;
          total_profit =dataCallBack.total_profit || 0;
          total_tax =dataCallBack.total_tax || 0;
          total_amount =dataCallBack.total_amount;
          product_amount =dataCallBack.product_amount;
        }
        return {
          ...state,
          saving: false,
          saved: true,
          notShowSlideCart: action.result[1],
          items,
          serviceFee,
          transFee,
          total_net_profit,
          total_profit,
          total_tax,
          product_amount,
          total_amount
        };
        /* const key = findKey(state.items, i => i.sku === action.result.sku);
        if (key == null || key === -1) return state;
        return update(state, { items: { $splice: [[key, 1]] } });*/
      }
    case SAVE_CART:
      {
        return {
          ...state,
          saving: true,
          saved: false,
        };
      }
    case SAVE_CART_CALLBACK: 
    {
      const pref = state.pref;
      let useDiscount = state.useDiscount;
      try {
        pref.codeDiscount = action.result[0].discount.list_use[0];
        useDiscount = action.result[0].discount.total;
      } catch (e) {}
      if (action.result[0] && action.result[0].product) {
        return {
          ...state,
          pref,
          useDiscount,
          saving: false,
          saved: true,
          items: action.result[0].product,
          serviceFee: action.result[0].service_fee,
          notShowSlideCart: action.result[1],
          transFee: action.result[0].transport_fee,
          total_net_profit: action.result[0].total_net_profit,
          total_profit: action.result[0].total_profit,
          total_tax: action.result[0].total_tax,
          total_amount: action.result[0].total_amount,
          product_amount: action.result[0].product_amount,
        };
      }
      return {
        ...state,
        saving: false,
        saved: false,
        saveError: action.error
      };
    }
    case SELECT_ADDRESS:
      return {
        ...state,
        selectedAddress: { ...state.selectedAddress, [action.addressType]: action.addressIndex }
      };
    case LOAD_ADDRESS: {
      return {
        ...state,
        statusAddress: 0,
      };
    }
    case LOAD_ADDRESS_CALLBACK: {
      if (action.result && Array.isArray(action.result) && Array.isArray(action.result).length) {
        return {
          ...state,
          statusAddress: 2,
        };
      }
      const pref = state.pref;
      let i, selectedPayment = '';
      if (typeof state.payment !== 'undefined') {
        for (i in state.payment) {
          if (!state.payment.hasOwnProperty(i)) {
            continue;
          }
          if (typeof state.payment[i]['name-code'] !== 'undefined' && state.payment[i]['name-code'] === 'noi_nhan') {
            selectedPayment = state.payment[i]['name-code'];
            break;
          }
          selectedPayment = state.payment[i]['name-code'];
        }
        pref.payment = selectedPayment;
      }
      const addressList = [];
      map(action.result, val => {
        if (typeof val === 'object') {
          addressList.push(val);
        }
      })
      return {
        ...state,
        statusAddress: 1,
        addressList,
        selectedAddress: {
          bill: addressList.length - 1,
          delivery: addressList.length - 1,
        },
        pref
      };
    }
    case REMOVE_ADDRESS: {
      return {
        ...state,
        statusAddress: 0,
      };
    }
    case REMOVE_ADDRESS_CALLBACK: {
      if (action.result && Array.isArray(action.result) && Array.isArray(action.result).length) {
        return {
          ...state,
          statusAddress: 2,
        };
      }
      const pref = state.pref;
      let i, selectedPayment = '';
      if (typeof state.payment !== 'undefined') {
        for (i in state.payment) {
          if (!state.payment.hasOwnProperty(i)) {
            continue;
          }
          if (typeof state.payment[i]['name-code'] !== 'undefined' && state.payment[i]['name-code'] === 'noi_nhan') {
            selectedPayment = state.payment[i]['name-code'];
            break;
          }
          selectedPayment = state.payment[i]['name-code'];
        }
        pref.payment = selectedPayment;
      }
      const addressList = [];
      map(action.result, val => {
        if (typeof val === 'object') {
          addressList.push(val);
        }
      })
      return {
        ...state,
        statusAddress: 1,
        addressList,
        selectedAddress: {
          bill: addressList.length - 1,
          delivery: addressList.length - 1,
        },
        pref
      };
    }
    case ADD_LOCATION:
      {
        const ind = findKey(state.addressList, addr => addr.newType === action.addressType);
        const adlist = state.addressList;
        adlist.push(action.address);
        return {
          ...state,
          addressList: adlist,
          selectedAddress: { ...state.selectedAddress, [action.addressType]: ind || (state.addressList && state.addressList.length - 1) || 0 }
        }
      }

    case GET_TRANS_FEE:
      return {
        ...state,
        statusTransFee: 0,
      }
    case GET_TRANS_FEE_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusTransFee: 2,
          }
        }
        return {
          ...state,
          statusTransFee: 1,
          transFee: action.result.data.transport_fee,
        }
      }
    case SERVICE_PACKAGE:
      return {
        ...state,
        statusServicePackage: 0,
      };
    case SERVICE_PACKAGE_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusServicePackage: 2,
            error: action.status.message,
          };
        }
        let servicePackage;
        try {
          servicePackage = action.result.data['get-service-package'][0].data
        } catch (e) {}
        return {
          ...state,
          statusServicePackage: 1,
          servicePackage, // se xoa khi co api
        };
      }
    case USE_DISCOUNT:
      return {
        ...state,
        statusUseDisCount: 0,
      }
    case USE_DISCOUNT_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusUseDisCount: 2,
            discountError: action.error,
          }
        }
        const pref = state.pref;
        pref.codeDiscount = action.result.codeDiscount;
        return {
          ...state,
          statusUseDisCount: 1,
          pref, 
          useDiscount: action.result.data.discount,
          discountError: action.result.data.message,
        }
      }
    case DELETE_USE_DISCOUNT:
      return {
        ...state,
      }
    case DELETE_USE_DISCOUNT_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            discountError: action.error,
          }
        }
        const pref = state.pref;
        pref.codeDiscount = undefined;
        return {
          ...state,
          pref,
          useDiscount: undefined,
        }
      }
    case SEARCH_ADDRESS:
      return {
        ...state,
        statusSearchAddress: 0,
      };
    case SEARCH_ADDRESS_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusSearchAddress: 2,
            searchAddressError: action.error,
          };
        }
        let data;
        if (typeof action.result.data !== 'undefined') {
          data = action.result.data;
          if (typeof data.results !== 'undefined') {
            data = data.results
          }
        }
        return {
          ...state,
          statusSearchAddress: 1,
          searchAddressResult: data,
        };
      }
    case CHECKOUT:
      {
        return {
          ...state,
          processing: true,
          processed: false,
          error: null,
        };
      }
    case CHECKOUT_CALLBACK: {
      if (action.result.status !== 'success') {
        return {
          ...state,
          processing: false,
          processed: false,
          error: action.result.message || action.result.error
        };
      }
      return {
        ...state,
        processing: false,
        processed: true,
        items: [],
        order: action.result.data,
      };
    }
    case CLEAR_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: false,
      };
    case CLEAN_CART_FOR_NAME:
      return {
        ...state,
        [action.name]: undefined,
      }
    case CLEAN:
      return initialState;
    default:
      return state;
  }
}

export function removeItem({ sku, checkShowCart = true }) {
  return {
    types: [REMOVE_ITEM, REMOVE_ITEM_CALLBACK, REMOVE_ITEM_CALLBACK],
    promise: client => client.post('/tools/api.php', {
      data: {
        call: 'delete-to-cart',
        ctype: 'function',
        get: '',
        params: {
          list: Array.isArray(sku) ? sku.join('-') : sku
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      if (result.status !== 'success') {
        console.log(`Remove item error: ${result.message}`);
      }
      client.post('/tools/api.php', {
        data: {
          call: 'general',
          ctype: 'page',
          get: [
            {
              'get-cart': [''],
            }
          ],
          params: ''
        },
        headers: {
          dataUpdate: result,
          local: true,
        }
      });
      return [(result.data ? result.data : {}), checkShowCart];
    })
  };
}

export function saveToCart({ id, sku, different, price_custom, checkShowCart = true, type, ...rest }) {
  return {
    types: [SAVE_CART, SAVE_CART_CALLBACK, SAVE_CART_CALLBACK],
    promise: client => client.post('/tools/api.php', {
      data: {
        call: 'pick-to-cart',
        ctype: 'function',
        get: '',
        params: {
          list: id,
          n: different,
          sku,
          ...rest,
          price_custom,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      if (result.status !== 'success') {
        console.log(`Save cart error: ${result.message}`);
      } else {
        client.post('/tools/api.php', {
          data: {
            call: 'general',
            ctype: 'page',
            get: [
              {
                'get-cart': [''],
              }
            ],
            params: ''
          },
          headers: {
            dataUpdate: {
              data: {
                'get-cart': [
                  result
                ]
              }
            },
            local: true,
          }
        });
      }
      // console.log(380, result, result.data);
      return [result.data, checkShowCart];
    })
  };
}
export function initialize(isCache, iObj) {
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
      name: 'initialize',
      data: iObj.data,
    };
  }
  if (typeof isCache === 'undefined' || isCache !== true) {
    isCache = false;
  }
  return {
    types: [INITIALIZE, INITIALIZE_CALLBACK, INITIALIZE_CALLBACK],
    ukey: iObj.ukey,
    promise: client => client.post('/tools/api.php', {
      data: {
        call: 'general',
        ctype: 'page',
        get: [
          {
            'get-cart': [''],
          }
        ],
        params: ''
      },
      headers: {
        checkCache: isCache,
        expire: 7 * 24 * 3600,
      }
    }).then(result => {
      if (!result.status === 'success') {
        throw new Error(`Initialize cart error: ${result.message}`);
      }
      return result.data;
    })
  };
}
export function initializeWithUser(isCache) {
  if (typeof isCache === 'undefined' || isCache !== true) {
    isCache = false;
  }
  return {
    types: [INITIALIZEWITHUSER, INITIALIZEWITHUSER_CALLBACK, INITIALIZEWITHUSER_CALLBACK],
    promise: client => client.post('/tools/api.php', {
      data: {
        call: 'general',
        ctype: 'page',
        get: [
          {
            'get-delivery-time': [''],
            'get-delivery-address': [''],
            'get-payment': [''],
          }
        ],
        params: ''
      },
      headers: {
        checkCache: isCache,
        expire: 7 * 24 * 3600,
      }
    }).then(result => {
      if (!result.status === 'success') {
        throw new Error(`Initialize cart error: ${result.message}`);
      }
      return result.data;
    })
  };
}
export function useDiscount(code) {
  return {
    types: [USE_DISCOUNT, USE_DISCOUNT_CALLBACK, USE_DISCOUNT_CALLBACK],
    promise: client => client.post('/tools/api.php', {
      data: {
        call: 'use-discount',
        ctype: 'function',
        get: '',
        params: {
          discount: code,
        }
      }
    }).then(result => {
      if (result.status !== 'success') {
        throw new Error(result.message);
      }
      result.codeDiscount = code;
      return result;
    })
  };
}
export function deleteUseDiscount(code) {
  return {
    types: [DELETE_USE_DISCOUNT, DELETE_USE_DISCOUNT_CALLBACK, DELETE_USE_DISCOUNT_CALLBACK],
    promise: client => client.post('/tools/api.php', {
      data: {
        call: 'remove-discount',
        ctype: 'function',
        get: '',
        params: ''
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      if (result.status !== 'success') {
        throw new Error(result.message);
      }
      result.codeDiscount = code;
      return result;
    })
  };
}
export function loadAddress() {
  return {
    types: [LOAD_ADDRESS, LOAD_ADDRESS_CALLBACK, LOAD_ADDRESS_CALLBACK],
    promise: client => client.post('/tools/api.php', {
      data: {
        call: 'get-address',
        ctype: 'function',
        get: '',
        params: ''
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      if (result.status !== 'success') {
        throw new Error(`Cannot get user address: ${result.message}`);
      }
      return result.data;
    })
  };
}
export function removeAddress(obj) {
  return {
    types: [REMOVE_ADDRESS, REMOVE_ADDRESS_CALLBACK, REMOVE_ADDRESS_CALLBACK],
    promise: client => client.post('/tools/api.php', {
      data: {
        call: 'remove-address',
        ctype: 'function',
        get: '',
        params: {
          id: obj.id,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      if (result.status !== 'success') {
        throw new Error(`Cannot get user address: ${result.message}`);
      }
      return result.data;
    })
  };
}

export function selectServicePackage(id) {
  return {
    types: [SELECT_SERVICE_PACKAGE, SELECT_SERVICE_PACKAGE_CALLBACK, SELECT_SERVICE_PACKAGE_CALLBACK],
    promise: client => client.post('/tools/api.php', {
      data: {
        call: 'select-service-package',
        ctype: 'function',
        get: '',
        params: {
          service_id: id,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      if (result.status !== 'success') {
        throw new Error(result.message);
      }
      return result;
    })
  };
}
export function addAddress(addressType, address) {
  if (addressType !== 'bill' && addressType !== 'delivery') {
    throw new Error('New address with invalid address type');
  }
  return {
    type: ADD_LOCATION,
    addressType,
    address: {
      ...address,
      newType: addressType
    }
  };
}
export function getTransFee(address) {
  return {
    types: [GET_TRANS_FEE, GET_TRANS_FEE_CALLBACK, GET_TRANS_FEE_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'update-transport-fee',
        ctype: 'function',
        get: '',
        params: {
          'delivery_address': {
            long: address.lng,
            lat: address.lat,
          },
        },
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    }).catch((e) => {
      console.log('send', e);
      return false;
    })
  };
}
export function servicePackage(cid) {
  // console.log(810, uid, content, imglist);
  return {
    types: [SERVICE_PACKAGE, SERVICE_PACKAGE_CALLBACK, SERVICE_PACKAGE_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'general',
        ctype: 'page',
        get: [
          {
            'get-service-package': [
              {
                area: ''
              }
            ]
          }
        ],
        params: '',
      },
      headers: {
        expire: 24 * 3600,
      }
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    }).catch((e) => {
      console.log('send', e);
      return false;
    })
  };
}
export function clearPrefService(address) {  // khi bam back clear refservice luon va` load lai gio hang
  return {
    types: [CLEAR_PREF_SERVICE, CLEAR_PREF_SERVICE_CALLBACK, CLEAR_PREF_SERVICE_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'unselected-service-package',
        ctype: 'function',
        get: '',
        params: '',
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    }).catch((e) => {
      console.log('send', e);
      return false;
    })
  };
}
/*export function checkout({ bill, note }) {
  return {
    types: [CHECKOUT, CHECKOUT_CALLBACK, CHECKOUT_CALLBACK],
    promise: (client, dispatch, getState) => {
      const state = getState().Cart;
      const user = getState().Auth.user;
      const deliveryAddress = state.addressList[state.selectedAddress.delivery] || {};
      // cai addresslist se duoc add tùy thich nhưng nó chỉ lấy cái được chọn de them vao api may cai sau se mat
      // const billAddress = state.addressList[state.selectedAddress.bill];
      const deliveryTime = state.deliveryTime.list_time[state.pref.receivingTime[0]];
      deliveryTime.date = deliveryTime.from_time + state.pref.receivingTime[1] * 86400;
      if (typeof deliveryTime.from_time === 'undefined') {
        return false;
      }
      console.log('--------------------',getState().Cart.items.reduce((p, c, i) => i === 0 ? `${c.id}` : `${p},${c.id}`, ''))
      return client.post('/tools/api.php', {
        data: {
          call: 'checkout',
          ctype: 'function',
          get: '',
          params: {
            deliver_time: {
              from: deliveryTime.from,
              to: deliveryTime.to,
              date: deliveryTime.date
            },
            note,
            deliver_person: {
              ...(
                (deliveryAddress.city && deliveryAddress.district && deliveryAddress.ward) ?
                  {
                    city: deliveryAddress.city.id,
                    district: deliveryAddress.district.id,
                    ward: deliveryAddress.ward.id,
                    street: deliveryAddress.street,
                  } : { // luon luon xai cai nay
                    // old: deliveryAddress.id
                    address: deliveryAddress.address,
                    lng: parseFloat(deliveryAddress.longitude || deliveryAddress.lng),
                    lat: parseFloat(deliveryAddress.latitude || deliveryAddress.lat),
                    street: deliveryAddress.address,
                    // area_id: deliveryAddress.area_id
                  }
              ),
              fullname: deliveryAddress.fullname,
              phone_number: deliveryAddress.phone_number,
              ...(user ? { old: deliveryAddress.id } : {}),
              email: deliveryAddress.email,
            },
            ...(bill ? { bill: {
              bill_tax: bill.tax,
              bill_address: bill.address,
              bill_name: bill.name,
            }} : {}),
            is_save: '0',
            is_re_buy: '0',
            payment_gateway: state.pref.payment,
            list: getState().Cart.items.reduce((p, c, i) => i === 0 ? `${c.id}` : `${p},${c.id}`, '')
          }
        },
        headers: {
          expire: 0,
        }
      }).then(result => {
        if (result.status !== 'success') {
          throw new Error(`checkout error: ${result.message}`);
        }
        result.data.status = result.status;
        return result.data;
      });
    }
  };
}*/
export function checkout(obj) {
  return {
    types: [CHECKOUT, CHECKOUT_CALLBACK, CHECKOUT_CALLBACK],
    promise: (client) => {
      return client.post('/tools/api.php', {
        data: {
          call: 'checkout',
          ctype: 'function',
          get: '',
          params: {
            deliver_time: obj.deliverTime,
            note: obj.note,
            deliver_person: {
              address: obj.deliverPerson.address,
              lng: parseFloat(obj.deliverPerson.longitude || obj.deliverPerson.lng),
              lat: parseFloat(obj.deliverPerson.latitude || obj.deliverPerson.lat),
              street: obj.deliverPerson.address,
              fullname: obj.deliverPerson.fullname,
              phone_number: obj.deliverPerson.phone_number,
              email: obj.deliverPerson.email,
              old: obj.deliverPerson.id,
            },
            is_save: '0',
            is_re_buy: '0',
            payment_gateway: obj.payment,
            list: obj.list,
          }
        },
        headers: {
          expire: 0,
        }
      }).then(result => {
        return result;
      });
    }
  };
}
export function cleanCartForName(name) {
  return {
    type: CLEAN_CART_FOR_NAME,
    name
  }
}
export function clearResultSearch(name) {
  return {
    type: CLEAN_RESULT_SEARCH_ADDRESS,
  }
}

export function setPref({ name, value }) {
  return {
    type: SET_PREF,
    name,
    value
  };
}
export function clearSuccess() {
  return {
    type: CLEAR_SUCCESS,
  }
}
export function selectAddress(addressType, addressIndex) {
  return {
    type: SELECT_ADDRESS,
    addressType,
    addressIndex
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
export function autocompleteAddress(value) {
  let signal = config.type === 'app' ? '&key=AIzaSyB_KMb0N27arXA13qKlEW9aO2q22P-5fsk' :
      '&key=AIzaSyBTjfwkzhhIRLGevMw0TwadxOVuIJ9HWWo';
  return {
    types: [SEARCH_ADDRESS, SEARCH_ADDRESS_CALLBACK, SEARCH_ADDRESS_CALLBACK],
    promise: client => client.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + value + "&components=country:VN" + signal, {
      headers: {
        expire: 24 * 3600,
      }
    }).then((result) => {
      result = {
        status: 'success',
        data: result,
      };
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    }),
  };
}
export function clean() {
  return {
    type: CLEAN
  };
}
