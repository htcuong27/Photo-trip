
import { map } from '../../utils/object';
const CLEAN = 'Category/CLEAN';
const LOAD = 'Category/LOAD';
const LOAD_CALLBACK = 'Category/LOAD_CALLBACK';
const GET_LIST = 'Category/GET_LIST';
const GET_LIST_CALLBACK = 'Category/GET_LIST_CALLBACK';
const CALL_CATEGORY_FROM_PRODUCT = 'Category/CALL_CATEGORY_FROM_PRODUCT';

const initialState = {
  category: {},
  ukey: {},
  queue: {}
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
        statusCategory: 0,
        ukeyCategory: action.ukey,
      };
    }
    case LOAD_CALLBACK:
      if (action.result.status !== 'success') {
        return {
          ...state,
          statusCategory: 2,
          errorCategory: action.error
        };
      }
      let pageCount;
      let mtct = '', ttc = '', tnsh = '', dt = '';
      const motachitiet = [];
      map(action.result.general_filter, (va, k) => {
        if (va === 'Mô tả chi tiết') mtct = k;
        if (va === 'thông tin chung') ttc = k;
        if (va === 'Tiện nghi sinh hoạt') tnsh = k;
        if (va === 'diện tích') dt = k;
      });
      map(action.result.filter, (val, i) => {
        if ((val['filter_general_id'] === mtct) || (val['filter_general_id'] === ttc) || (val['filter_general_id'] === tnsh)
          || (val['filter_general_id'] === '0') || (val['filter_general_id'] === dt)) {
          motachitiet.push(val);
        }
      });
      let danhsach;
      const tabs = [];
      const sapxep = [
        {
          id: 'nameasc',
          name: 'theo tên A-Z'
        },
        {
          id: 'namedesc',
          name: 'theo tên Z-A'
        },
        {
          id: 'priceasc',
          name: 'theo giá bán tăng'
        },
        {
          id: 'pricedesc',
          name: 'theo giá bán giảm'
        },
        {
          id: 'ctimeasc',
          name: 'theo thời gian tăng'
        },
        {
          id: 'ctimedesc',
          name: 'theo thời gian giảm'
        },
        {
          id: 'saleasc',
          name: 'theo giá khuyến mãi tăng'
        },
        {
          id: 'saledesc',
          name: 'theo giá khuyến mãi giảm'
        },
        {
          id: 'viewasc',
          name: 'theo lượt xem tăng'
        },
        {
          id: 'viewdesc',
          name: 'theo lượt xem giảm'
        },
      ];
      if (typeof action.result !== 'undefined' && typeof action.result.product !== 'undefined') {
        pageCount = Math.ceil(action.result.product.total / action.result.product.page_size);
        try {
          map(action.result.parent_list_value[action.result.parent_id === '-1' ? action.result.id : action.result.parent_id], childs => tabs.push(childs));
          /*danhsach = action.result.listLinkSave;
          if (state.Category.danhsachLink && state.Category.danhsachLink.data) {
            danhsach = state.Category.danhsachLink.data;
          }
          
          products = deepPick(action.result.product.data, 2);*/
        } catch (e) {}
      }
      return {
        ...state,
        statusCategory: 1,
        category: action.result,
        sapxep,
        /*danhsach,
        products,*/
        pageCount,
        tabs,
        motachitiet,
        danhsachLink: undefined,
      };
    /* case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        category: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };*/
    case CALL_CATEGORY_FROM_PRODUCT:
      return {
        ...state,
        dataAddCategoryFromProduct: action.obj,
      }
    case GET_LIST:
      return {
        ...state,
        statusCategoryPrice: 0
      };
    case GET_LIST_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusCategoryPrice: 2,
            getPriceFalse: action.message || 'Vui lòng tải lại trang hoặc liên hệ ', 
          };
        }
        return {
          ...state,
          statusCategoryPrice: 1,
          resultgetListCategoryPrice: action.result.data,
        };
      }
    case CLEAN:
      return initialState;
    default:
      return state;
  }
}

export function load({ path, id = 0, userId = 0, page = 1, pageSize = 20, filter, order2, pageSaveLink = 1, parentId, iObj, reKey, display }) {
  if (typeof iObj !== 'object') {
    iObj = {};
  }
  if (typeof reKey !== 'undefined') {
    iObj.ukey = reKey;
    const queue = initialState.queue[iObj.ukey] || {};
    path = queue.data.path;
    page = queue.data.page;
    pageSize = queue.data.pageSize;
    filter = queue.data.filter;
    pageSaveLink = queue.data.pageSaveLink;
    parentId = queue.data.parentId;
    iObj = queue.data.iObj;
  }
  if (typeof iObj.ukey === 'undefined') {
    iObj.ukey = new Date().getTime();
    initialState.queue[iObj.ukey] = {
      name: 'load',
      data: {
        path,
        page,
        pageSize,
        filter,
        order2,
        pageSaveLink,
        parentId,
        iObj,
      },
    };
  }
  const filterAfter = {};
  let order = order2;
  if (filter) {

    if (typeof page === 'undefined' && filter.page && filter.page['value'][0]) {
      page = filter.page['value'][0];
      page *= 1;
    }
    if (page < 1) {
      page = 1;
    }

    map(filter, (val, key) => {
      filterAfter[key] = val;
    });
    /* if (filterAfter['tu-khoa']) {  // da ok k sua
      const de = b64DecodeUnicode(filterAfter['tu-khoa']);
      filterAfter.keyword = de;
      delete filterAfter['tu-khoa'];
    }*/
    /* if (filterAfter['thoi-gian']) {
      filterAfter.date = {};
      const de = b64DecodeUnicode(filterAfter['thoi-gian']);
      const arr = de.split('^_^');
      if (arr[0] !== '') {
        filterAfter.date.fromDate = arr[0];
      }
      if (arr[1] !== '') {
        filterAfter.date.toDate = arr[1];
      }
      delete filterAfter['thoi-gian'];
    }*/
    /* if (filterAfter['dien-tich']) {
      filterAfter.range = {
        'dien-tich': {}
      };
      const de = b64DecodeUnicode(filterAfter['dien-tich']);
      const arr = de.split('^_^');
      if (arr[0] !== '0') {
        let abc = arr[0].match(/[,]+/g);
        if (abc && abc.length) {
          arr[0] = arr[0].replace(',', '.');
        }
        filterAfter.range['dien-tich'].from = arr[0];
      }
      if (arr[1] && arr[1] !== '0') {
        let abc = arr[1].match(/[,]+/g);
        if (abc && abc.length) {
          arr[1] = arr[1].replace(',', '.');
        }
        filterAfter.range['dien-tich'].to = arr[1];
      }
      delete filterAfter['dien-tich'];
    }*/
    /* if (filterAfter['gia-tien']) {
      filterAfter.price = {};
      const de = b64DecodeUnicode(filterAfter['gia-tien']);
      const arr = de.split('^_^');
      if (arr.length > 0) {
        let abc = arr[0].match(/[,]+/g);
        if (abc && abc.length) {
          arr[0] = arr[0].replace(',', '.');
        }
        let àbc = arr[1].match(/[,]+/g);
        if (àbc && àbc.length) {
          arr[1] = arr[1].replace(',', '.');
        }
        filterAfter.price.from = arr[0];
        filterAfter.price.to = arr[1];
      }
      delete filterAfter['gia-tien'];
    }*/
    /* if (filterAfter['dia-diem']) {   // da ok k sua
      filterAfter.location = {};
      const de = b64DecodeUnicode(filterAfter['dia-diem']);
      const arr = de.split('^_^');
      filterAfter.location.address = arr[0];
      filterAfter.location.lat = arr[1];
      filterAfter.location.lng = arr[2];
      delete filterAfter['dia-diem'];
    }*/
    if (filterAfter.order && filterAfter.order.value) {
      order = filterAfter.order.value[0].value;
      // delete filterAfter.order;
      _.omit(filterAfter, 'order');
    }
  }
  const search = {
    filter_type: undefined
  }
  const filterAfter2 = {};
  map(filterAfter, (val, key) => {
    if (val.id === '' || typeof val.id === 'undefined') {
      search.filter_type = 1;
      filterAfter2[key] = [];
      map(val.value, data => {
        filterAfter2[key].push(data.value);
      });
    } else if (val.id) {
      search.filter_type = 2;
      filterAfter2[val.id] = [];
      map(val.value, data => {
        filterAfter2[val.id].push(data.id);
      });
    }
  });
  if (typeof search.filter_type !== 'undefined') {
    search.filter = filterAfter2;
  }
  if (typeof display === 'undefined') {
    display = '';
  }
  // console.log('load category', path, filterAfter, filterAfter2, order);
  return {
    types: [LOAD, LOAD_CALLBACK, LOAD_CALLBACK],
    ukey: iObj.ukey,
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'general',
        ctype: 'page',
        get: [
          {
            'category-detail': [{
              ...(id > 0 ? {id: id} : {'name-code': path}),
              filter: 1,
              extend: 1,
              child: 1,
              display,
              search,
              'list-article': {
                'parent-id': parentId,
                page,
                order,
                'page-size': pageSize,
              },
            }]
          },
          {
            'get-search-link': [{
              page: pageSaveLink,
              'page-size': 10,
            }]
          }
        ],
        userId,
      },
      headers: {
        expire: 300,
      }
    }).then(result => {
      // data.listLinkSave = result.data['get-search-link'][0].data;
      if (Object.keys(result.data['category-detail'][0]).length === 0) {
        throw Error('Không tìm thấy sản phẩm trong danh mục!');
      }
      const data = {
        ...result.data['category-detail'][0],
        __key__: JSON.stringify({ path, page, filter }),
        page: page,
        status: result.status,
      };
      return data;
    })
  };
}
export function getListPriceCategory(listIdProduct, userId = 0) {
  // {"call":"get-price-articles","ctype":"function","get":"","params":[{"aid":10574,"vid":99},{"aid":10574,"vid":99}]}
  return {
    types: [GET_LIST, GET_LIST_CALLBACK, GET_LIST_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-price-articles',
        ctype: 'function',
        get: '',
        params: listIdProduct,
        userId,
      },
      headers: {
        expire: 60,
      }
    })
  };
}
export function addIdToCategory(obj) {
  return {
    type: CALL_CATEGORY_FROM_PRODUCT,
    obj,
  }
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
export function clean() {
  return {
    type: CLEAN
  };
}
