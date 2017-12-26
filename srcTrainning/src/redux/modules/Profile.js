const CHANGE_PASS_WORD = 'Profile/CHANGE_PASS_WORD';
const CHANGE_PASS_WORD_CALLBACK = 'Profile/CHANGE_PASS_WORD_CALLBACK';
const LOAD_INFO_BASIC = 'Profile/LOAD_INFO_BASIC';
const LOAD_INFO_BASIC_CALLBACK = 'Profile/LOAD_INFO_BASIC_CALLBACK';
const GET_LIST_LIKE_STATUS = 'Profile/GET_LIST_LIKE_STATUS';
const GET_LIST_LIKE_STATUS_CALLBACK = 'Profile/GET_LIST_LIKE_STATUS_CALLBACK';
const LOAD_CMT_LIST = 'Profile/LOAD_CMT_LIST';
const LOAD_CMT_LIST_CALLBACK = 'Profile/LOAD_CMT_LIST_CALLBACK';
const ACTION_LIKE = 'Profile/ACTION_LIKE';
const ACTION_LIKE_CALLBACK = 'Profile/ACTION_LIKE_CALLBACK';
const POST_COMMENT = 'Profile/POST_COMMENT';
const POST_COMMENT_CALLBACK = 'Profile/POST_COMMENT_CALLBACK';
const POST_STATUS = 'Profile/POST_STATUS';
const POST_STATUS_CALLBACK = 'Profile/POST_STATUS_CALLBACK';
const CHANGE_GENERAL_INFO = 'Profile/CHANGE_GENERAL_INFO';
const CHANGE_GENERAL_INFO_CALLBACK = 'Profile/CHANGE_GENERAL_INFO_CALLBACK';
const CHANGE_AVATAR_COVER = 'Profile/CHANGE_AVATAR_COVER';
const CHANGE_AVATAR_COVER_CALLBACK = 'Profile/CHANGE_AVATAR_COVER_CALLBACK';
const DELETE_POST = 'Profile/DELETE_POST';
const DELETE_POST_CALLBACK = 'Profile/DELETE_POST_CALLBACK';
const HIDE_POST_SHARE = 'Profile/HIDE_POST_SHARE';
const HIDE_POST_SHARE_CALLBACK = 'Profile/HIDE_POST_SHARE_CALLBACK';

const GET_STATTEMENT_ACCOUNT = 'Profile/GET_STATTEMENT_ACCOUNT';
const GET_STATTEMENT_ACCOUNT_CALLBACK = 'Profile/GET_STATTEMENT_ACCOUNT_CALLBACK';

const GET_TRANSACTION = 'Profile/GET_TRANSACTION';
const GET_TRANSACTION_CALLBACK = 'Profile/GET_TRANSACTION_CALLBACK';

const GET_HISTORY_ORDER = 'Profile/GET_HISTORY_ORDER';
const GET_HISTORY_ORDER_CALLBACK = 'Profile/GET_HISTORY_ORDER_CALLBACK';

const GET_ID_POST_DELETE = 'Global/GET_ID_POST_DELETE';
const GET_OBI_POST_DELETE_SHARE = 'Global/GET_OBI_POST_DELETE_SHARE';

const SHARE = 'Profile/SHARE';
const SHARE_CALLBACK = 'Profile/SHARE_CALLBACK';

const LOAD_STATISTICAL = 'Profile/LOAD_STATISTICAL';
const LOAD_STATISTICAL_CALLBACK = 'Profile/LOAD_STATISTICAL_CALLBACK';


const GET_NOTI_DETAIL = 'Profile/GET_NOTI_DETAIL';
const GET_NOTI_DETAIL_CALLBACK = 'Profile/GET_NOTI_DETAIL_CALLBACK';

const CLEAN_LIST_FOLLOW = 'Profile/CLEAN_LIST_FOLLOW';
const GET_LIST = 'Profile/GET_LIST';
const GET_LIST_CALLBACK = 'Profile/GET_LIST_CALLBACK';

const FOLLOW = 'Profile/FOLLOW';
const FOLLOW_CALLBACK = 'Profile/FOLLOW_CALLBACK';

const LOAD_LIST_FOLLOWER = 'Global/LOAD_LIST_FOLLOWER';
const LOAD_LIST_FOLLOWER_CALLBACK = 'Global/LOAD_LIST_FOLLOWER_CALLBACK';

const initialState = {
  statusInfobasic: 0,
  resultInfoBasic: {},
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
    case LOAD_LIST_FOLLOWER:
      return {
        ...state,
        statusGetListFollower: 0
      };
    case LOAD_LIST_FOLLOWER_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusGetListFollower: 2,
            errorGetListFollower: action.message,
          };
        }
        let rsData;
        if (action.result.status === 'success') {
          rsData = action.result.data;
        }
        return {
          ...state,
          statusGetListFollower: 1,
          resultGetListFollower: rsData,
        };
      }
    case FOLLOW:
      return {
        ...state,
        statusFollow: 0
      };
    case FOLLOW_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusFollow: 2,
            errorFollow: action.error || action.result.message,
          };
        }
        return {
          ...state,
          statusFollow: 1,
          resultFollow: action.result.data,
        };
      }
    case GET_LIST:
      return {
        ...state,
        statusGetList: 0
      };
    case GET_LIST_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusGetList: 2,
            errorGetList: action.error || action.result.message,
          };
        }
        return {
          ...state,
          statusGetList: 1,
          resultGetList: action.result.data,
        };
      }
    case CLEAN_LIST_FOLLOW:
      return {
        ...state,
        resultGetList: [],
      };
    case GET_NOTI_DETAIL:
      return {
        ...state,
        statusGetNotiDetail: 0,
      };
    case GET_NOTI_DETAIL_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusGetNotiDetail: 2,
            errorGetNotiDetail: action.result.error,
          };
        }
        return {
          ...state,
          statusGetNotiDetail: 1,
          resultGetNotiDetail: action.result,
        };
      }
    case GET_STATTEMENT_ACCOUNT:
      return {
        ...state,
        statusGetStatementAccount: 0,
      };
    case GET_STATTEMENT_ACCOUNT_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusGetStatementAccount: 2,
            errorGetStatementAccount: action.result.error,
          };
        }
        return {
          ...state,
          statusGetStatementAccount: 1,
          resultGetStatementAccount: action.result,
        };
      }
    case GET_TRANSACTION:
      return {
        ...state,
        statusGetTransaction: 0,
      };
    case GET_TRANSACTION_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusGetTransaction: 2,
            errorGetTransaction: action.result.error,
          };
        }
        return {
          ...state,
          statusGetTransaction: 1,
          resultGetTransaction: action.result,
        };
      }
    case GET_HISTORY_ORDER:
      return {
        ...state,
        statusHistoryOrder: 0,
      };
    case GET_HISTORY_ORDER_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusHistoryOrder: 2,
            errorHistoryOrder: action.result.error,
          };
        }
        return {
          ...state,
          statusHistoryOrder: 1,
          resultHistoryOrder: action.result,
        };
      }
    case CHANGE_PASS_WORD:
      return {
        ...state,
        statusChangePassWord: 0,
      };
    case CHANGE_PASS_WORD_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusChangePassWord: 2,
            errorChangePassWord: action.result.error,
          };
        }
        if (action.result.status === 'success') {
          action.result.notiSuccess = 'Bạn đã thay đổi mật khẩu thành công';
        }
        return {
          ...state,
          statusChangePassWord: 1,
          resultChangePassWord: action.result,
        };
      }
    case GET_ID_POST_DELETE:
      return {
        ...state,
        idDeletePost: action.idPost,
      };
    case GET_OBI_POST_DELETE_SHARE:
      return {
        ...state,
        objDeleteShare: action.obj,
      }
    case LOAD_STATISTICAL:
      return {
        ...state,
        statusLoadStatistical: 0
      };
    case LOAD_STATISTICAL_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusLoadStatistical: 2,
            errorLoadStatistical: action.error,
          };
        }
        return {
          ...state,
          statusLoadStatistical: 1,
          resultLoadStatistical: action.result.data,
        };
      }
    case CHANGE_GENERAL_INFO:
      return {
        ...state,
        statusChangeGeneralInfo: 0
      };
    case CHANGE_GENERAL_INFO_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusChangeGeneralInfo: 2,
            errorChangeGeneralInfo: action.error,
          };
        }
        return {
          ...state,
          statusChangeGeneralInfo: 1,
          resultChangeGeneralInfo: action.result,
        };
      }
    case SHARE:
      return {
        ...state,
        statusShare: 0
      };
    case SHARE_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusShare: 2,
            errorShare: action.result.message
          };
        }
        return {
          ...state,
          statusShare: 1,
          resultShare: 'Chia sẽ thành công' || action.result.data,
        };
      }
    case DELETE_POST:
      return {
        ...state,
        statusDeletePostComment: 0
      };
    case DELETE_POST_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusDeletePostComment: 2,
            errorDeletePostComment: action.result.message
          };
        }
        return {
          ...state,
          statusDeletePostComment: 1,
          resultDeletePostComment: action.result.data,
        };
      }
    case HIDE_POST_SHARE:
      return {
        ...state,
        statusHidePostShare: 0
      };
    case HIDE_POST_SHARE_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusHidePostShare: 2,
            errorHidePostShare: action.result.message
          };
        }
        return {
          ...state,
          statusHidePostShare: 1,
          resultHidePostShare: action.result.data,
        };
      }
    case LOAD_INFO_BASIC:
      return {
        ...state,
        statusInfobasic: 0,
      };
    case LOAD_INFO_BASIC_CALLBACK:
      {
        let data;
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusInfobasic: 2,
            errorInfobasic: action.error || action.result.message || 'Error !!!',
          };
        }
        if (action.result.status === 'success') {
          data = action.result.data;
          if (typeof data['get-profile'] !== 'undefined') {
            data = data['get-profile'];
            if (typeof data[0] !== 'undefined') {
              data = data[0];
              if (typeof data.data !== 'undefined') {
                data = data.data;
              }
            }
          }
        }
        return {
          ...state,
          statusInfobasic: 1,
          resultInfoBasic: data,
        };
      }
    case CHANGE_AVATAR_COVER:
      return {
        ...state,
        statusChangeImage: 0
      };
    case CHANGE_AVATAR_COVER_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusChangeImage: 2,
            errorChangeImage: action.message,
          };
        }
        return {
          ...state,
          statusChangeImage: 1,
          restultChangeImage: action.result.data,
        };
      }
    case GET_LIST_LIKE_STATUS:
      return {
        ...state,
        statusGetLikeStatus: 0
      };
    case GET_LIST_LIKE_STATUS_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusGetLikeStatus: 2,
            errorGetLikeStatus: action.result.message
          };
        }
        return {
          ...state,
          statusGetLikeStatus: 1,
          resultGetLikeStatus: action.result.data,
        };
      }
    case LOAD_CMT_LIST:
      return {
        ...state,
        cmtListLoading: true
      };
    case LOAD_CMT_LIST_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            cmtListLoading: false,
            cmtListLoaded: false,
            cmtListError: action.result.message
          };
        }
        let listCmt;
        if (action.result && action.result.status === 'success') {
          listCmt = action.result;
          if (typeof listCmt.data !== 'undefined') {
            listCmt = listCmt.data;
            if (typeof listCmt.data !== 'undefined') {
              listCmt = listCmt.data;
              if (typeof listCmt[0] !== 'undefined') {
                listCmt = listCmt[0];
              }
            }
          }
        }
        return {
          ...state,
          cmtListLoading: false,
          cmtListLoaded: true,
          cmtList: {
            data: listCmt,
            header: action.result.header,
          },
          resultLoadCmt: action.result,
          // cmtList: action.result.data
        };
      }
    case ACTION_LIKE:
      return {
        ...state,
        likeLoading: true
      };
    case ACTION_LIKE_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            likeLoading: false,
            likeLoaded: false,
            likeError: action.error,
          };
        }
        return {
          ...state,
          likeError: undefined,
          likeLoading: false,
          likeLoaded: true,
          rsLike: action.result,
          like: action.result.parentId,
        };
      }
    case POST_COMMENT:
      return {
        ...state,
        postCommentLoading: true
      };
    case POST_COMMENT_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            postCommentLoading: false,
            postCommentLoaded: false,
            postCommentError: action.error
          };
        }
        return {
          ...state,
          postCommentLoading: false,
          postCommentLoaded: true,
          resultPostComment: action.result.data,
        };
      }
    case POST_STATUS:
      return {
        ...state,
        statusPostStatus: 0
      };
    case POST_STATUS_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusPostStatus: 2,
            errorPostStatus: action.error,
          };
        }
        return {
          ...state,
          statusPostStatus: 1,
          resultPostStatus: action.result.data,
        };
      }
    default:
      return state;
  }
}

export function loadInfoProfile(iObj) {
  return {
    types: [LOAD_INFO_BASIC, LOAD_INFO_BASIC_CALLBACK, LOAD_INFO_BASIC_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'general',
        ctype: 'page',
        get: [{
          'get-profile': [
            {
              'name-code': iObj.nameCode,
              'load-info': iObj.loadInfo,
              'load-menu': iObj.loadMenu,
              'load-tab': iObj.loadTab,
            }
          ]
        }],
        params: ''
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
export function loadStatistical(iObj) {
  return {
    types: [LOAD_STATISTICAL, LOAD_STATISTICAL_CALLBACK, LOAD_STATISTICAL_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-statement-order',
        ctype: 'function',
        get:'',
        params: {
          "gtype": iObj.gtype,
          "rtype": iObj.rtype,
          "ctime": iObj.ctime,
          "stime": iObj.stime,
          "etime": iObj.etime,
        }
      },
      header: {
        timeout: 30,
        expire: 0,
      },
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    })
  };
}
export function getListLikeStatus(array, pid = -1) {
  return {
    types: [GET_LIST_LIKE_STATUS, GET_LIST_LIKE_STATUS_CALLBACK, GET_LIST_LIKE_STATUS_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-like',
        ctype: 'function',
        get: '',
        params: {
          list: array,
        }
      },
      headers: {
        expire: 60,
      }
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      if (pid > -1) {
        result.data.pid = pid;
      } else {
        result.data.pid = 0;
      }
      return result;
    })
  };
}
export function changePassWord(iObj) {
  /*if (!oldPass || oldPass === '') {
    return {
      type: CHANGE_PASS_WORD_CALLBACK,
      error: 'Bạn vui lòng nhập mật khẩu cũ',
      result: {
        status: false,
      },
    };
  }
  if (oldPass.length < 6 || newPass.length < 6 || reNewPass.length < 6) {
    return {
      type: CHANGE_PASS_WORD_CALLBACK,
      error: 'Mật khẩu ít nhất 6 kí tự',
      result: {
        status: false,
      },
    };
  }*/
  return {
    types: [CHANGE_PASS_WORD, CHANGE_PASS_WORD_CALLBACK, CHANGE_PASS_WORD_CALLBACK],
    promise: client => client.post('/tools/api.php', {
      data: {
        call: 'change-password',
        ctype: 'function',
        cache: false,
        get: '',
        params: {
          odlpswd: iObj.oldPass,
          newpswd: iObj.newPass,
          repswd: iObj.newPassRetype,
        },
      },
    }).then((result) => {
      if (result.status !== 'success') {
        result.error = result.message;
      }
      return result;
    }),
  };
}
export function loadCmtList(id, typeCmt, pid, page, paggeSize) {
  return {
    types: [LOAD_CMT_LIST, LOAD_CMT_LIST_CALLBACK, LOAD_CMT_LIST_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-comment',
        ctype: 'function',
        get: '',
        params: {
          id, // id cua doi tuong can lay cmt
          type: typeCmt, // loai cmt cua doi tuong
          pid, // id cua comment cap 1
          page,
          page_size: paggeSize,
        }
      },
      headers: {
        expire: typeCmt === 'article' ? 600 : 30,
      }
    }).then(result => {
      if (result.status !== 'success') {
        throw new Error(`Cannot get: ${result.message}`);
      }
      result.header = { pid, id };
      return result;
    })
  };
}
export function likeInteractive(idNews, inverseCurrentStatus, type) {
  /* const user = getUser();
  if (Object.keys(user).length < 1) {
    return {
      type: ACTION_LIKE_CALLBACK,
      error: 'Vui lòng đăng nhập để thực hiện thao tác này'
    };
  }*/
  return {
    types: [ACTION_LIKE, ACTION_LIKE_CALLBACK, ACTION_LIKE_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'action-like',
        ctype: 'function',
        get: '',
        params: {
          list: [
            {
              id: idNews,
              type,
              sub: '',
              status: inverseCurrentStatus, // TRANG THAI NGHICH DAO VOI TRANG THAI HIEN TAI
            }
          ]
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      result.parentId = idNews;
      if (inverseCurrentStatus === 1) {
        result.dislike = true;
      } else {
        result.dislike = false;
      }
      return result;
    })
  };
}
export function postComment(id, contentCmt, typeCmt, pid) {
  if (!contentCmt) {
    return {
        type: POST_COMMENT_CALLBACK,
        error: 'Vui lòng nhập nội dung.'
      };
  }
  return {
    types: [POST_COMMENT, POST_COMMENT_CALLBACK, POST_COMMENT_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'add-comment',
        ctype: 'function',
        get: '',
        params: {
          id, // id cua doi tuong dc cmt
          content: contentCmt, // noi dung cmt
          type: typeCmt,
          pid, // parent id cua cmt cha, dung khi cmt cap 2
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      if (result.status !== 'success') {
        throw new Error(`${result.message}`);
      }
      result.data.header = { pid, id };
      return result;
    })
  };
}
export function postStatus({ contentText, contentImage, latlng, locationName, listTag, nameCode, photo }) {
  /*const user = getUser();
  if (Object.keys(user).length < 1) {
    return {
        type: POST_STATUS_CALLBACK,
        error: 'Vui lòng đăng nhập để đăng trạng thái của bạn hoặc viết gì đó cho bạn của bạn'
      };
  }*/
  return {
    types: [POST_STATUS, POST_STATUS_CALLBACK, POST_STATUS_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'update-status',
        ctype: 'function',
        get: '',
        params: {
          'user-path': nameCode,
          photo,
          content: contentText,
          privacy: 0,
        },
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      result.data.author = {
        name: 'DuongQuang',
        username: '@duongquang',
        avatarSrc: '/img/avatar.jpg',
      }
      return result;
    })
  };
}
export function changeGeneralInfo({defaultField, customeField}) {
  for (let i = 0; i < defaultField.length; i++) {
    if (defaultField[i].field === 'phone_number') {
      if (defaultField[i].value.length < 10 ||
            (defaultField[i].value.slice(0, 1) * 1) !== 0 ||
              defaultField[i].value.length > 11) {
        return {
          type: CHANGE_GENERAL_INFO_CALLBACK,
          error: 'Số điện thoại ít nhất là 10 số và tối đa 11 số và phải bắt đầu bằng số 0',
        };
      }
    }
  }
  return {
    types: [CHANGE_GENERAL_INFO, CHANGE_GENERAL_INFO_CALLBACK, CHANGE_GENERAL_INFO_CALLBACK],
    promise: client => client.post('/tools/api.php', {
      data: {
        call: 'update-user',
        ctype: 'function',
        get: '',
        params: {
          default: defaultField,
          custom: customeField,
        },
      },
      headers: {
        expire: 0,
      }
    }).then((result) => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    }),
  };
}
export function changeAvataCover(obj) {
  return {
    types: [CHANGE_AVATAR_COVER, CHANGE_AVATAR_COVER_CALLBACK, CHANGE_AVATAR_COVER_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'change-user-image',
        ctype: 'function',
        get: '',
        params: {
          itype: obj.itype,
          image_path: obj.imagePath || '',
          image_data: obj.imageData,
          edit_image: obj.editImage || 0,
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
export function follow(iObj) {
  return {
    types: [FOLLOW, FOLLOW_CALLBACK, FOLLOW_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'action-follow',
        ctype: 'function',
        cache: false,
        get: '',
        params: {
          oid: iObj.id,
          otype: iObj.type,
          action: iObj.action,
        }
      }
    }).then(result => {
      return result;
    })
  };
}
export function shareStatus(oid, otype) {
  return {
    types: [SHARE, SHARE_CALLBACK, SHARE_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'share',
        ctype: 'function',
        get: '',
        params: {
          oid,
          stype: 0,
          content: '',
          otype,
          osub: 0
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      result.status = 'success';
      if (result.status !== 'success') {
        throw new Error(`${result.message}`);
      }
      return result;
    })
  };
}
export function getNotiDetail(id) {
  return {
    types: [GET_NOTI_DETAIL, GET_NOTI_DETAIL_CALLBACK, GET_NOTI_DETAIL_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-notice-detail',
        ctype: 'function',
        get: '',
        params: {
          id
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      result.status = 'success';
      if (result.status !== 'success') {
        throw new Error(`${result.message}`);
      }
      return result;
    })
  };
}
export function deletePost(idPost) {
  return {
    types: [DELETE_POST, DELETE_POST_CALLBACK, DELETE_POST_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'remove-status',
        ctype: 'function',
        get: '',
        params: {
          'status-id': idPost
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
export function hidePost({ idPost, status, type }) {
  return {
    types: [HIDE_POST_SHARE, HIDE_POST_SHARE_CALLBACK, HIDE_POST_SHARE_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'update-status-feed',
        ctype: 'function',
        get: '',
        params: {
          fid: idPost,
          status,
          type,
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
export function getStatmentAccount(obj) {
  return {
    types: [GET_STATTEMENT_ACCOUNT, GET_STATTEMENT_ACCOUNT_CALLBACK, GET_STATTEMENT_ACCOUNT_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-statement-account',
        ctype: 'function',
        get: '',
        params: {
          stime: obj.stime,
          etime: obj.etime,
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
export function getTransaction(obj) {
  return {
    types: [GET_TRANSACTION, GET_TRANSACTION_CALLBACK, GET_TRANSACTION_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-transaction',
        ctype: 'function',
        get: '',
        params: {
          stime: obj.stime,
          etime: obj.etime,
          code:"all"
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
export function getHistoryOrder(obj) {
  return {
    types: [GET_HISTORY_ORDER, GET_HISTORY_ORDER_CALLBACK, GET_HISTORY_ORDER_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-history-order',
        ctype: 'function',
        get: '',
        params: {
          page: obj.page,
          'page-size': 30,
          ocode: obj.ocode,
          ostatus: obj.ostatus,
          stime: obj.stime,
          etime: obj.etime,
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
export function getIdDelete(idPost) {
  return {
    type: GET_ID_POST_DELETE,
    idPost
  };
}
export function getObjDeleteShare(obj) {
  return {
    type: GET_OBI_POST_DELETE_SHARE,
    obj
  };
}
export function cleanGetListFollow() {
  return {
    type: CLEAN_LIST_FOLLOW,
  };
}
export function getListLikeFavFo(listLike, listFollow, listFavorite) {
  return {
    types: [GET_LIST, GET_LIST_CALLBACK, GET_LIST_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'init-interact-socail',
        ctype: 'function',
        cache: false,
        get: '',
        params: {
          list_like: listLike,
          list_follow: listFollow,
          list_favorite: listFavorite
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      if (result.status !== 'success') {
        throw new Error(`Cannot get: ${result.message}`);
      }
      return result;
    })
  };
}

export function loadListFollower(iObj) {
  return {
    types: [LOAD_LIST_FOLLOWER, LOAD_LIST_FOLLOWER_CALLBACK, LOAD_LIST_FOLLOWER_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-follower-user',
        ctype: 'function',
        get: '',
        params: {
          "oid": iObj.oid,
          "action": iObj.action,
          "otype": iObj.otype,
        },
      }
    }).then(result => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    })
  };
}
