const SEARCH_USER_MESSAGE = 'Chat/SEARCH_USER_MESSAGE';
const SEARCH_USER_MESSAGE_CALLBACK = 'Chat/SEARCH_USER_MESSAGE_CALLBACK';
const SEND_MESSAGE = 'Chat/SEND_MESSAGE';
const SEND_MESSAGE_CALLBACK = 'Chat/SEND_MESSAGE_CALLBACK';
const GET_CONVERSATION = 'Chat/GET_CONVERSATION';
const GET_CONVERSATION_CALLBACK = 'Chat/GET_CONVERSATION_CALLBACK';
const GET_CONVERSATION_DETAIL = 'Chat/GET_CONVERSATION_DETAIL';
const GET_CONVERSATION_DETAIL_CALLBACK = 'Chat/GET_CONVERSATION_DETAIL_CALLBACK';
const SET_VIEW_ALL_MESSAGE = 'Chat/SET_VIEW_ALL_MESSAGE';
const SET_VIEW_ALL_MESSAGE_CALLBACK = 'Chat/SET_VIEW_ALL_MESSAGE_CALLBACK';
const DELETA_MESSAGE = 'Chat/DELETA_MESSAGE';
const DELETA_MESSAGE_CALLBACK = 'Chat/DELETA_MESSAGE_CALLBACK';
const GET_MESSAGE = 'Chat/GET_MESSAGE';
const GET_MESSAGE_CALLBACK = 'Chat/GET_MESSAGE_CALLBACK';
const CLEAR_MESSAGE_CALLBACK = 'Chat/CLEAR_MESSAGE_CALLBACK';
const CREATE_GROUPS = 'Chat/CREATE_GROUPS';
const CREATE_GROUPS_CALLBACK = 'Chat/CREATE_GROUPS_CALLBACK';
const KICK_USER = 'Chat/KICK_USER';
const KICK_USER_CALLBACK = 'Chat/KICK_USER_CALLBACK';
const ADD_NEW_MEMBER = 'Chat/ADD_NEW_MEMBER';
const ADD_NEW_MEMBER_CALLBACK = 'Chat/ADD_NEW_MEMBER_CALLBACK';
const RENAME_GROUPS = 'Chat/RENAME_GROUPS';
const RENAME_GROUPS_CALLBACK = 'Chat/RENAME_GROUPS_CALLBACK';
const LEAVE_GROUPS = 'Chat/LEAVE_GROUPS';
const LEAVE_GROUPS_CALLBACK = 'Chat/LEAVE_GROUPS_CALLBACK';

const DETECT_LINK = './Interactive/DETECT_LINK';
const DETECT_LINK_CALLBACK = './Interactive/DETECT_LINK_CALLBACK';

const initialState = {};

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
    case LEAVE_GROUPS:
      return {
        ...state,
        statusLeaveGroups: 0,
      };
    case LEAVE_GROUPS_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusLeaveGroups: 2,
              errorLeaveGroups: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusLeaveGroups: 1,
          resultLeaveGroups: data,
        };
      }
    case RENAME_GROUPS:
      return {
        ...state,
        statusRenameGroups: 0,
      };
    case RENAME_GROUPS_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusRenameGroups: 2,
              errorRenameGroups: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusRenameGroups: 1,
          resultRenameGroups: data,
        };
      }
    case ADD_NEW_MEMBER:
      return {
        ...state,
        statusAddNewMemners: 0,
      };
    case ADD_NEW_MEMBER_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusAddNewMemners: 2,
              errorAddNewMemners: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusAddNewMemners: 1,
          resultAddNewMemners: data,
        };
      }
    case KICK_USER:
      return {
        ...state,
        statusKickUser: 0,
      };
    case KICK_USER_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusKickUser: 2,
              errorKickUser: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusKickUser: 1,
          resultKickUser: data,
        };
      }
    case CREATE_GROUPS:
      return {
        ...state,
        statusCreateGroups: 0,
      };
    case CREATE_GROUPS_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusCreateGroups: 2,
              errorCreateGroups: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusCreateGroups: 1,
          resultCreateGroups: data,
        };
      }
    case DETECT_LINK:
      return {
        ...state,
        statusDetectLink: 0,
      };
    case DETECT_LINK_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusDetectLink: 2,
              errorDetectLink: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusDetectLink: 1,
          resultDetectLink: data,
        };
      }
    case SEARCH_USER_MESSAGE:
      return {
        ...state,
        statusSearchUser: 0
      };
    case SEARCH_USER_MESSAGE_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusSearchUser: 2,
            errorSearchUser: action.error,
          };
        }
        return {
          ...state,
          statusSearchUser: 1,
          resultSearchUser: action.result.data,
        };
      }
    case SEND_MESSAGE:
      return {
        ...state,
        statusSendMessage: 0
      };
    case SEND_MESSAGE_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusSendMessage: 2,
            errorSendMessage: action.error,
          };
        }
        return {
          ...state,
          statusSendMessage: 1,
          resultSendMessage: action.result.data,
        };
      }
    case GET_CONVERSATION:
      return {
        ...state,
        statusGetConversation: 0
      };
    case GET_CONVERSATION_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusGetConversation: 2,
            errorGetConversation: action.error,
          };
        }
        return {
          ...state,
          statusGetConversation: 1,
          resultGetConversation: action.result.data,
        };
      }
    case GET_CONVERSATION_DETAIL:
      return {
        ...state,
        statusGetConversationDetail: 0
      };
    case GET_CONVERSATION_DETAIL_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusGetConversationDetail: 2,
            errorGetConversationDetail: action.error,
          };
        }
        let data = action.result.data;
        if (typeof data.message === 'object' && action.isLoadMore !== true) {
          data.message.reverse();
        }
        return {
          ...state,
          statusGetConversationDetail: 1,
          resultGetConversationDetail: data,
        };
      }
    case SET_VIEW_ALL_MESSAGE:
      return {
        ...state,
        statusSetViewAllMessage: 0
      };
    case SET_VIEW_ALL_MESSAGE_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusSetViewAllMessage: 2,
            errorSetViewAllMessage: action.error,
          };
        }
        return {
          ...state,
          statusSetViewAllMessage: 1,
          resultSetViewAllMessage: action.result.data,
        };
      }
    case DELETA_MESSAGE:
      return {
        ...state,
        statusDeleteMessage: 0
      };
    case DELETA_MESSAGE_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusDeleteMessage: 2,
            errorDeleteMessage: action.error,
          };
        }
        return {
          ...state,
          statusDeleteMessage: 1,
          resultDeleteMessage: action.result.data,
        };
      }
    case GET_MESSAGE:
      return {
        ...state,
        statusGetMessage: 0
      };
    case GET_MESSAGE_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusGetMessage: 2,
            errorGetMessage: action.error,
          };
        }
        return {
          ...state,
          statusGetMessage: 1,
          resultGetMessage: action.result.data,
        };
      }
    case CLEAR_MESSAGE_CALLBACK:
      return {
        ...state,
        resultGetConversationDetail: [],
        resultGetMessage: [],
      }
    default:
      return state;
  }
}
// Tim kiem nguoi dung
export function searchUserMessage(iObj) {
  return {
    types: [SEARCH_USER_MESSAGE, SEARCH_USER_MESSAGE_CALLBACK, SEARCH_USER_MESSAGE_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'msg-find-user',
        ctype: 'function',
        get: '',
        params: {
          page: 1,
          "page-size":10,
          keyword: iObj.keyword,
        }
      },
      headers: {
        expire: 300,
      }
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    })
  };
}
// Gui Tin Nhan
export function sendMessage(iObj) {
  return {
    types: [SEND_MESSAGE, SEND_MESSAGE_CALLBACK, SEND_MESSAGE_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'msg-send',
        ctype: 'function',
        get: '',
        params: {
          uid: iObj.uid,
          cid: iObj.cid,
          content: iObj.content,
        }
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
// Lay danh sach cuoc hoi thoai hien tai
export function getConversation(iObj) {
  return {
    types: [GET_CONVERSATION, GET_CONVERSATION_CALLBACK, GET_CONVERSATION_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'msg-get-conversations',
        ctype: 'function',
        get: '',
        params: {
          page: iObj.page,
          "page-size": iObj.page_size || 40,
        }
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
// Lay chi tiet 1 cuoc hoi thoai
export function getConversationDetail(iObj, isLoadMore) {
  return {
    types: [GET_CONVERSATION_DETAIL, GET_CONVERSATION_DETAIL_CALLBACK, GET_CONVERSATION_DETAIL_CALLBACK],
    isLoadMore,
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'msg-conversation-detail',
        ctype: 'function',
        get: '',
        params: {
          uid: iObj.uid,
          cid: iObj.cid,
          "last-id": iObj.lastId,
          page: iObj.page || 1,
          "page-size": iObj.pageSize || 40,
        }
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
// Cap nhat da xem cho tat ca cac tin nhan
export function setViewAllMessage(iObj) {
  return {
    types: [SET_VIEW_ALL_MESSAGE, SET_VIEW_ALL_MESSAGE_CALLBACK, SET_VIEW_ALL_MESSAGE_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'msg-all-view',
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
    })
  };
}
// Xoa tin nhan
export function deleteMessage(iObj) {
  return {
    types: [DELETA_MESSAGE, DELETA_MESSAGE_CALLBACK, DELETA_MESSAGE_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'msg-conversation-remove',
        ctype: 'function',
        get: '',
        params: {
          cid: iObj.cid,
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
// lay tin nhan moi
export function getMessage(iObj) {
  return {
    types: [GET_MESSAGE, GET_MESSAGE_CALLBACK, GET_MESSAGE_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'msg-get-new',
        ctype: 'function',
        get: '',
        params: {
          cid: iObj.cid,
          gtime: iObj.gtime,
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
export function detectLink(link) {
  return {
    types: [DETECT_LINK, DETECT_LINK_CALLBACK, DETECT_LINK_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-link',
        ctype: 'function',
        get: '',
        params: {
          link
        }
      }
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    })
  };
}

export function createGroups(iObj) {
  return {
    types: [CREATE_GROUPS, CREATE_GROUPS_CALLBACK, CREATE_GROUPS_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'msg-create-group',
        ctype: 'function',
        get: '',
        params: {
          name: iObj.name,
          users: iObj.users, // danh sach thanh vien trong nhom
        }
      }
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    })
  };
}
export function addNewMember(iObj) {
  return {
    types: [ADD_NEW_MEMBER, ADD_NEW_MEMBER_CALLBACK, ADD_NEW_MEMBER_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'msg-add-member-group',
        ctype: 'function',
        get: '',
        params: {
          cid: iObj.cid,
          users: iObj.users, // danh sach thanh vien trong nhom
        }
      }
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    })
  };
}


export function kickUser(iObj) {
  return {
    types: [KICK_USER, KICK_USER_CALLBACK, KICK_USER_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'msg-remove-member-group',
        ctype: 'function',
        get: '',
        params: {
          cid: iObj.cid,
          uid: iObj.uid,
        }
      }
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    })
  };
}

export function renameGroups(iObj) {
  return {
    types: [RENAME_GROUPS, RENAME_GROUPS_CALLBACK, RENAME_GROUPS_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: "msg-rename-group",
        ctype: 'function',
        get: '',
        params: {
          cid: iObj.cid,
          name: iObj.name,
        }
      }
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    })
  };
}
export function leaveGroups(iObj) {
  return {
    types: [LEAVE_GROUPS, LEAVE_GROUPS_CALLBACK, LEAVE_GROUPS_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: "msg-leave-group",
        ctype: 'function',
        get: '',
        params: {
          cid: iObj.cid,
        }
      }
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    })
  };
}
export function clear() {
  return {
    type: CLEAR_MESSAGE_CALLBACK,
  };
}