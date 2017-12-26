const GET_TASK = 'Task/GET_TASK';
const GET_TASK_CALLBACK = 'Task/GET_TASK_CALLBACK';

const GET_DETAIL_TASK = 'Task/GET_DETAIL_TASK';
const GET_DETAIL_TASK_CALLBACK = 'Task/GET_DETAIL_TASK_CALLBACK';
const INIT_CREATE_TASK = 'Task/INIT_CREATE_TASK';
const INIT_CREATE_TASK_CALLBACK = 'Task/INIT_CREATE_TASK_CALLBACK';
const CREATE_TASK = 'Task/CREATE_TASK';
const CREATE_TASK_CALLBACK = 'Task/CREATE_TASK_CALLBACK';

const SEARCH_ASSIGN = 'Task/SEARCH_ASSIGN';
const SEARCH_ASSIGN_CALLBACK = 'Task/SEARCH_ASSIGN_CALLBACK';

const DELETE_TASK = 'Task/DELETE_TASK';
const DELETE_TASK_CALLBACK = 'Task/DELETE_TASK_CALLBACK';

const UPDATE_STATUS_TASK = 'Task/UPDATE_STATUS_TASK';
const UPDATE_STATUS_TASK_CALLBACK = 'Task/UPDATE_STATUS_TASK_CALLBACK';



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
    case UPDATE_STATUS_TASK:
      return {
        ...state,
        statusUpdateStatusTask: 0
      };
    case UPDATE_STATUS_TASK_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusUpdateStatusTask: 2,
            errorUpdateStatusTask: action.error || action.result.message, 
          };
        }
        return {
          ...state,
          statusUpdateStatusTask: 1,
          resultUpdateStatusTask: action.result.data,
        };
      }
    case DELETE_TASK:
      return {
        ...state,
        statusDeleteTask: 0
      };
    case DELETE_TASK_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusDeleteTask: 2,
            errorDeleteTask: action.error || action.result.message, 
          };
        }
        return {
          ...state,
          statusDeleteTask: 1,
          resultDeleteTask: action.result.data,
        };
      }
    case SEARCH_ASSIGN:
      return {
        ...state,
        statusSearchAssign: 0
      };
    case SEARCH_ASSIGN_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusSearchAssign: 2,
            errorSearchAssign: action.error || action.result.message, 
          };
        }
        return {
          ...state,
          statusSearchAssign: 1,
          resultSearchAssign: action.result.data,
        };
      }
    case CREATE_TASK:
      return {
        ...state,
        statusCreateTask: 0
      };
    case CREATE_TASK_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusCreateTask: 2,
            errorCreateTask: action.error || action.result.message, 
          };
        }
        return {
          ...state,
          statusCreateTask: 1,
          resultCreateTask: action.result.data,
        };
      }
    case GET_DETAIL_TASK:
      return {
        ...state,
        statusGetDetailTask: 0
      };
    case GET_TASK:
      return {
        ...state,
        statusGetTask: 0
      };
    case GET_TASK_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusGetTask: 2,
            errorGetTask: action.error || action.result.message, 
          };
        }
        return {
          ...state,
          statusGetTask: 1,
          resultGetTask: action.result.data,
        };
      }
    case GET_DETAIL_TASK:
      return {
        ...state,
        statusGetDetailTask: 0
      };
    case GET_DETAIL_TASK_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusGetDetailTask: 2,
            errorGetDetailTask: action.error || action.result.message, 
          };
        }
        return {
          ...state,
          statusGetDetailTask: 1,
          resultGetDetailTask: action.result.data,
        };
      }
    default:
      return state;
  }
}

export function getTasks(iObj) {
  return {
    types: [GET_TASK, GET_TASK_CALLBACK, GET_TASK_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-tasks',
        ctype: 'function',
        get: '',
        params: {
          page: iObj.page || 1,
          page_size: iObj.page_size || 20,
          stime: iObj.stime,
          etime: iObj.etime,
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
export function getDetailTasks(id) {
  return {
    types: [GET_DETAIL_TASK, GET_DETAIL_TASK_CALLBACK, GET_DETAIL_TASK_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-detail-task',
        ctype: 'function',
        get: '',
        params: {
          id,
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
export function initCreateTask(id) {
  return {
    types: [INIT_CREATE_TASK, INIT_CREATE_TASK_CALLBACK, INIT_CREATE_TASK_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'init-create-task',
        ctype: 'function',
        get: '',
        params: {
          id, // ID CONG VIEC
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
export function createTask(iObj) {
  return {
    types: [CREATE_TASK, CREATE_TASK_CALLBACK, CREATE_TASK_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'create-task',
        ctype: 'function',
        get: '',
        params: {
          id: iObj.id,
          name: iObj.name,
          description: iObj.description,
          stime: iObj.start_time_txt,
          etime: iObj.end_time_txt,
          file_attachments: iObj.file_attachments,
          assigns: iObj.assigns,
          type: iObj.type,
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
export function searchAssign(iObj) {
  return {
    types: [SEARCH_ASSIGN, SEARCH_ASSIGN_CALLBACK, SEARCH_ASSIGN_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'search-assign',
        ctype: 'function',
        get: '',
        params: {
          keyword: iObj.keyword,
          stype: iObj.stype,
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
export function deleteTask(id) {
  return {
    types: [DELETE_TASK, DELETE_TASK_CALLBACK, DELETE_TASK_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'delete-task',
        ctype: 'function',
        get: '',
        params: {
          id,
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
export function updateStatusTask(iObj) {
  return {
    types: [UPDATE_STATUS_TASK, UPDATE_STATUS_TASK_CALLBACK, UPDATE_STATUS_TASK_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'update-status-task',
        ctype: 'function',
        get: '',
        params: {
          tid: iObj.tid,
          aid: iObj.aid,
          status: iObj.status,
          note: iObj.note,
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