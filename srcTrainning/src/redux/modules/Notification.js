

const LOAD = 'Notification/LOAD';
const LOAD_CALLBACK = 'Notification/LOAD_CALLBACK';
const CLEAN = 'Notification/CLEAN';
const CLEAR = 'Notification/CLEAR';
const CHECK_NEW_NOTI = 'Notification/CHECK_NEW_NOTI';
const CHECK_NEW_NOTI_CALLBACK = 'Notification/CHECK_NEW_NOTI_CALLBACK';
const VIEW_ALL = 'Notification/VIEW_ALL';

const initialState = {
  queue: {},
  newNotification: {},
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
    case LOAD:
      return {
        ...state,
        notificationLoading: true
      };
    case LOAD_CALLBACK:
      {
        let dataCallBack;
        if (action.result.status === 'success') {
          dataCallBack = action.result.data;
          if (typeof dataCallBack['get-notification'] !== 'undefined') {
            dataCallBack = dataCallBack['get-notification'];
            if (typeof dataCallBack[0] !== 'undefined') {
              dataCallBack = dataCallBack[0];
              if (typeof dataCallBack.data !== 'undefined') {
                dataCallBack = dataCallBack.data;
              }
            }
          }
        }
        if (action.result.status !== 'success') {
          return {
            ...state,
            notificationLoading: false,
            notificationLoaded: false,
            error: action.status.message
          };
        }
        return {
          ...state,
          notificationLoading: false,
          notificationLoaded: true,
          notification: dataCallBack,
        };
      }
    case CHECK_NEW_NOTI:
      return {
        ...state,
        newNotificationLoading: true
      };
    case CHECK_NEW_NOTI_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            newNotificationLoading: false,
            newNotificationLoaded: false,
            error: action.status.message
          };
        }
        const data = action.result.data;
        if (data.message == state.newNotification.message &&
          data.notification == state.newNotification.notification) {
          return {
            ...state,
          }
        }
        return {
          ...state,
          newNotificationLoading: false,
          newNotificationLoaded: true,
          newNotification: data,
          numberNoti: data.notification,
          numberMessage: data.message,
        };
      }
    case VIEW_ALL:
      return {
        ...state,
        viewAll: true
      };
    case CLEAR:
      return {
        ...state,
        notificationLoaded: false,
        viewAll: false,
        // newNotification: 0,
      };
    case CLEAN:
      return initialState;
    default:
      return state;
  }
}
export function loadNotification(page, pageSize) {
  return {
    types: [LOAD, LOAD_CALLBACK, LOAD_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'general',
        ctype: 'page',
        get: [{
          'get-notification': [
            {
              page,
              'page-size': pageSize,
              order: 'create_time DESC'
            }
          ]
        }],
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
    })
  };
}
export function checkNewNotification() {
  return {
    types: [CHECK_NEW_NOTI, CHECK_NEW_NOTI_CALLBACK, CHECK_NEW_NOTI_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'check-activity-count',
        ctype: 'function',
        get: '',
        params: {
          list: 'notification,message',
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
    })
  };
}
export function clearProps() {
  return {
    type: CLEAR
  };
}
export function viewAllNoti() {
  return {
    type: VIEW_ALL
  };
}

export function clean() {
  return {
    type: CLEAN
  };
}
