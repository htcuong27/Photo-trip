const GET_DEPARTMENT = 'Department/GET_DEPARTMENT';
const GET_DEPARTMENT_CALLBACK = 'Department/GET_DEPARTMENT_CALLBACK';
const VIEW_DETAIL_DEPARTMENT = 'Department/VIEW_DETAIL_DEPARTMENT';
const VIEW_DETAIL_DEPARTMENT_CALLBACK = 'Department/VIEW_DETAIL_DEPARTMENT_CALLBACK';
const UPDATE_STATUS_DEPARTMENT = 'Department/UPDATE_STATUS_DEPARTMENT';
const UPDATE_STATUS_DEPARTMENT_CALLBACK = 'Department/UPDATE_STATUS_DEPARTMENT_CALLBACK';
const DELETE_DEPARTMENT = 'Department/DELETE_DEPARTMENT';
const DELETE_DEPARTMENT_CALLBACK = 'Department/DELETE_DEPARTMENT_CALLBACK';
const SET_LEADER = 'Department/SET_LEADER';
const SET_LEADER_CALLBACK = 'Department/SET_LEADER_CALLBACK';
const INIT_CREATE_DEPARTMENT = 'Department/INIT_CREATE_DEPARTMENT';
const INIT_CREATE_DEPARTMENT_CALLBACK = 'Department/INIT_CREATE_DEPARTMENT_CALLBACK';
const CREATE_DEPARTMENT = 'Department/CREATE_DEPARTMENT';
const CREATE_DEPARTMENT_CALLBACK = 'Department/CREATE_DEPARTMENT_CALLBACK';
const ADD_MEMBER_DEPARTMENT = 'Department/ADD_MEMBER_DEPARTMENT';
const ADD_MEMBER_DEPARTMENT_CALLBACK = 'Department/ADD_MEMBER_DEPARTMENT_CALLBACK';
const REMOVE_MEMBER_DEPARTMENT = 'Department/REMOVE_MEMBER_DEPARTMENT';
const REMOVE_MEMBER_DEPARTMENT_CALLBACK = 'Department/REMOVE_MEMBER_DEPARTMENT_CALLBACK';
const GET_MEMBER_DEPARTMENT = 'Department/GET_MEMBER_DEPARTMENT';
const GET_MEMBER_DEPARTMENT_CALLBACK = 'Department/GET_MEMBER_DEPARTMENT_CALLBACK';
const SEARCH_USER = 'Department/SEARCH_USER';
const SEARCH_USER_CALLBACK = 'Department/SEARCH_USER_CALLBACK';
const INIT_CREATE_TEAM = 'Department/INIT_CREATE_TEAM';
const INIT_CREATE_TEAM_CALLBACK = 'Department/INIT_CREATE_TEAM_CALLBACK';
const CREATE_TEAM = 'Department/CREATE_TEAM';
const CREATE_TEAM_CALLBACK = 'Department/CREATE_TEAM_CALLBACK';
const GET_TEAMS = 'Department/GET_TEAMS';
const GET_TEAMS_CALLBACK = 'Department/GET_TEAMS_CALLBACK';
const UPDATE_STATUS_TEAM = 'Department/UPDATE_STATUS_TEAM';
const UPDATE_STATUS_TEAM_CALLBACK = 'Department/UPDATE_STATUS_TEAM_CALLBACK';
const GET_MEMBER_TEAMS = 'Department/GET_MEMBER_TEAMS';
const GET_MEMBER_TEAMS_CALLBACK = 'Department/GET_MEMBER_TEAMS_CALLBACK';
const ADD_MEMBER_TEAMS = 'Department/ADD_MEMBER_TEAMS';
const ADD_MEMBER_TEAMS_CALLBACK = 'Department/ADD_MEMBER_TEAMS_CALLBACK';
const REMOVE_MEMBER_TEAMS = 'Department/REMOVE_MEMBER_TEAMS';
const REMOVE_MEMBER_TEAMS_CALLBACK = 'Department/REMOVE_MEMBER_TEAMS_CALLBACK';
const DELETE_TEAM = 'Department/DELETE_TEAM';
const DELETE_TEAM_CALLBACK = 'Department/DELETE_TEAM_CALLBACK';

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
    case DELETE_TEAM:
      return {
        ...state,
        statusDeleteTeam: 0,
      };
    case DELETE_TEAM_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusDeleteTeam: 2,
              errorDeleteTeam: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusDeleteTeam: 1,
          resultDeleteTeam: data,
        };
      }
    case REMOVE_MEMBER_TEAMS:
      return {
        ...state,
        statusRemoveMemberTeam: 0,
      };
    case REMOVE_MEMBER_TEAMS_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusRemoveMemberTeam: 2,
              errorRemoveMemberTeam: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusRemoveMemberTeam: 1,
          resultRemoveMemberTeam: data,
        };
      }
    case ADD_MEMBER_TEAMS:
      return {
        ...state,
        statusAddMemberTeam: 0,
      };
    case ADD_MEMBER_TEAMS_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusAddMemberTeam: 2,
              errorAddMemberTeam: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusAddMemberTeam: 1,
          resultAddMemberTeam: data,
        };
      }
    case GET_MEMBER_TEAMS:
      return {
        ...state,
        statusGetMemberTeam: 0,
      };
    case GET_MEMBER_TEAMS_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusGetMemberTeam: 2,
              errorGetMemberTeam: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusGetMemberTeam: 1,
          resultGetMemberTeam: data,
        };
      }
    case UPDATE_STATUS_TEAM:
      return {
        ...state,
        statusuUpdateStatusTeam: 0,
      };
    case UPDATE_STATUS_TEAM_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusuUpdateStatusTeam: 2,
              erroruUpdateStatusTeam: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusuUpdateStatusTeam: 1,
          resultuUpdateStatusTeam: data,
        };
      }
    case GET_TEAMS:
      return {
        ...state,
        statusGetTeams: 0,
      };
    case GET_TEAMS_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusGetTeams: 2,
              errorGetTeams: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusGetTeams: 1,
          resultGetTeams: data,
        };
      }
    case CREATE_TEAM:
      return {
        ...state,
        statusCreateTeam: 0,
      };
    case CREATE_TEAM_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusCreateTeam: 2,
              errorCreateTeam: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusCreateTeam: 1,
          resultCreateTeam: data,
        };
      }
    case INIT_CREATE_TEAM:
      return {
        ...state,
        statusInitCreateTeam: 0,
      };
    case INIT_CREATE_TEAM_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusInitCreateTeam: 2,
              errorInitCreateTeam: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusInitCreateTeam: 1,
          resultInitCreateTeam: data,
        };
      }
    case SEARCH_USER:
      return {
        ...state,
        statusSearchUser: 0,
      };
    case SEARCH_USER_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusSearchUser: 2,
              errorSearchUser: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusSearchUser: 1,
          resultSearchUser: data,
        };
      }
    case GET_MEMBER_DEPARTMENT:
      return {
        ...state,
        statusGetMemberDepartment: 0,
      };
    case GET_MEMBER_DEPARTMENT_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusGetMemberDepartment: 2,
              errorGetMemberDepartment: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusGetMemberDepartment: 1,
          resultGetMemberDepartment: data,
        };
      }
    case REMOVE_MEMBER_DEPARTMENT:
      return {
        ...state,
        statusRemoveMemberDepartment: 0,
      };
    case REMOVE_MEMBER_DEPARTMENT_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusRemoveMemberDepartment: 2,
              errorRemoveMemberDepartment: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusRemoveMemberDepartment: 1,
          resultRemoveMemberDepartment: data,
        };
      }
    case ADD_MEMBER_DEPARTMENT:
      return {
        ...state,
        statusAddMemberDepartment: 0,
      };
    case ADD_MEMBER_DEPARTMENT_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusAddMemberDepartment: 2,
              errorAddMemberDepartment: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusAddMemberDepartment: 1,
          resultAddMemberDepartment: data,
        };
      }
    case CREATE_DEPARTMENT:
      return {
        ...state,
        statusCreateDepartment: 0,
      };
    case CREATE_DEPARTMENT_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusCreateDepartment: 2,
              errorCreateDepartment: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusCreateDepartment: 1,
          resultCreateDepartment: data,
        };
      }
    case INIT_CREATE_DEPARTMENT:
      return {
        ...state,
        statusInitCreateDepartment: 0,
      };
    case INIT_CREATE_DEPARTMENT_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusInitCreateDepartment: 2,
              errorInitCreateDepartment: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusInitCreateDepartment: 1,
          resultInitCreateDepartment: data,
        };
      }
    case SET_LEADER:
      return {
        ...state,
        statusSetLeader: 0,
      };
    case SET_LEADER_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusSetLeader: 2,
              errorSetLeader: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusSetLeader: 1,
          resultSetLeader: data,
        };
      }
    case DELETE_DEPARTMENT:
      return {
        ...state,
        statusDeleteDepartment: 0,
      };
    case DELETE_DEPARTMENT_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusDeleteDepartment: 2,
              errorDeleteDepartment: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusDeleteDepartment: 1,
          resultDeleteDepartment: data,
        };
      }
    case GET_DEPARTMENT:
      return {
        ...state,
        statusGetDepartment: 0,
      };
    case GET_DEPARTMENT_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusGetDepartment: 2,
              errorGetDepartment: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusGetDepartment: 1,
          resultGetDepartment: data,
        };
      }
    case VIEW_DETAIL_DEPARTMENT:
      return {
        ...state,
        statusViewDetailDepartment: 0,
      };
    case VIEW_DETAIL_DEPARTMENT_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusViewDetailDepartment: 2,
              errorViewDetailDepartment: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusViewDetailDepartment: 1,
          resultViewDetailDepartment: data,
        };
      }
    case UPDATE_STATUS_DEPARTMENT:
      return {
        ...state,
        statusUpdateStatusDepartment: 0,
      };
    case UPDATE_STATUS_DEPARTMENT_CALLBACK:
      {
        if (action.result.status !== 'success' || action.result.message) {
            return {
              ...state,
              statusUpdateStatusDepartment: 2,
              errorUpdateStatusDepartment: action.error || action.result.message,
            };
        }
        const data = action.result.data;
        return {
          ...state,
          statusUpdateStatusDepartment: 1,
          resultUpdateStatusDepartment: data,
        };
      }
    default:
      return state;
  }
}
export function getDepartment(iObj) {
  return {
    types: [GET_DEPARTMENT, GET_DEPARTMENT_CALLBACK, GET_DEPARTMENT_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-departments',
        ctype: 'function',
        get: '',
        params: {
          page: iObj.page,
          page_size: iObj.page_size,
          keyword: iObj.keyword,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function viewDetailDepartment(id) {
  return {
    types: [VIEW_DETAIL_DEPARTMENT, VIEW_DETAIL_DEPARTMENT_CALLBACK, VIEW_DETAIL_DEPARTMENT_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-list-user-group-detail',
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
      return result;
    })
  };
}
export function updateStatusDepartment(iObj) {
  return {
    types: [UPDATE_STATUS_DEPARTMENT, UPDATE_STATUS_DEPARTMENT_CALLBACK, UPDATE_STATUS_DEPARTMENT_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'update-status-department',
        ctype: 'function',
        get: '',
        params: {
          id: iObj.id,
          status: iObj.status,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function deleteDepartment(id) {
  return {
    types: [DELETE_DEPARTMENT, DELETE_DEPARTMENT_CALLBACK, DELETE_DEPARTMENT_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'delete-department',
        ctype: 'function',
        get: '',
        params: {
          id,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function setLeader(iObj) {
  return {
    types: [SET_LEADER, SET_LEADER_CALLBACK, SET_LEADER_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'set-leader',
        ctype: 'function',
        get: '',
        params: {
          uid: iObj.uid,
          otype: iObj.otype, // department, team
          oid: iObj.oid,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function initCreateDepartment(id) {
  return {
    types: [INIT_CREATE_DEPARTMENT, INIT_CREATE_DEPARTMENT_CALLBACK, INIT_CREATE_DEPARTMENT_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'init-create-department',
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
      return result;
    })
  };
}
export function createDepartment(iObj) {
  return {
    types: [CREATE_DEPARTMENT, CREATE_DEPARTMENT_CALLBACK, CREATE_DEPARTMENT_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'create-department',
        ctype: 'function',
        get: '',
        params: {
          id: iObj.id,
          name: iObj.name,
          name_code: iObj.name_code,
          description: iObj.description,
          status: iObj.status,
          parent_id: iObj.parent_id,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function addMemberDepartment(iObj) {
  return {
    types: [ADD_MEMBER_DEPARTMENT, ADD_MEMBER_DEPARTMENT_CALLBACK, ADD_MEMBER_DEPARTMENT_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'add-member-department',
        ctype: 'function',
        get: '',
        params: {
          dpid: iObj.dpid,
          uid: iObj.uid,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function removeMemberDepartment(iObj) {
  return {
    types: [REMOVE_MEMBER_DEPARTMENT, REMOVE_MEMBER_DEPARTMENT_CALLBACK, REMOVE_MEMBER_DEPARTMENT_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'remove-member-department',
        ctype: 'function',
        get: '',
        params: {
          dpid: iObj.dpid,
          uid: iObj.uid,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function getMemberDepartment(iObj) {
  return {
    types: [GET_MEMBER_DEPARTMENT, GET_MEMBER_DEPARTMENT_CALLBACK, GET_MEMBER_DEPARTMENT_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-members-department',
        ctype: 'function',
        get: '',
        params: {
          dpid: iObj.dpid,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function searchUser(iObj) {
  return {
    types: [SEARCH_USER, SEARCH_USER_CALLBACK, SEARCH_USER_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'search-user',
        ctype: 'function',
        get: '',
        params: {
          dpid: iObj.dpid,
          keyword: iObj.keyword
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function initCreateTeam(id) {
  return {
    types: [INIT_CREATE_TEAM, INIT_CREATE_TEAM_CALLBACK, INIT_CREATE_TEAM_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'init-create-team',
        ctype: 'function',
        get: '',
        params: {
          id, // mã nhóm
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}

export function createTeam(iObj) {
  return {
    types: [CREATE_TEAM, CREATE_TEAM_CALLBACK, CREATE_TEAM_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'create-team',
        ctype: 'function',
        get: '',
        params: {
          id: iObj.id, // mã nhóm
          name: iObj.name,
          name_code: iObj.name_code,
          status: iObj.status,
          department_id: iObj.department_id,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function getTeams(iObj) {
  return {
    types: [GET_TEAMS, GET_TEAMS_CALLBACK, GET_TEAMS_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-teams',
        ctype: 'function',
        get: '',
        params: {
          page: iObj.page,
          page_size: iObj.page_size,
          department_id: iObj.department_id,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function updateStatusTeam(iObj) {
  return {
    types: [UPDATE_STATUS_TEAM, UPDATE_STATUS_TEAM_CALLBACK, UPDATE_STATUS_TEAM_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'update-status-team',
        ctype: 'function',
        get: '',
        params: {
          id: iObj.id,
          status: iObj.status,
          /*"status"" : Trạng thái cập nhật
          + 0 : Chưa kích hoạt
          + 1 : Đang kích hoạt
          + 2 : Xóa*/
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function getMemberTeams(iObj) {
  return {
    types: [GET_MEMBER_TEAMS, GET_MEMBER_TEAMS_CALLBACK, GET_MEMBER_TEAMS_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'get-members-team',
        ctype: 'function',
        get: '',
        params: {
          page: iObj.page,
          page_size: iObj.page_size || 20,
          tid: iObj.tid,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function addMemberTeams(iObj) {
  return {
    types: [ADD_MEMBER_TEAMS, ADD_MEMBER_TEAMS_CALLBACK, ADD_MEMBER_TEAMS_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'add-member-team',
        ctype: 'function',
        get: '',
        params: {
          uid: iObj.uid,
          tid: iObj.tid,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function removeMemberTeamTeam(iObj) {
  return {
    types: [REMOVE_MEMBER_TEAMS, REMOVE_MEMBER_TEAMS_CALLBACK, REMOVE_MEMBER_TEAMS_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'remove-member-team',
        ctype: 'function',
        get: '',
        params: {
          uid: iObj.uid,
          tid: iObj.tid,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}
export function deleteTeam(iObj) {
  return {
    types: [DELETE_TEAM, DELETE_TEAM_CALLBACK, DELETE_TEAM_CALLBACK],
    promise: (client) => client.post('/tools/api.php', {
      data: {
        call: 'delete-team',
        ctype: 'function',
        get: '',
        params: {
          id: iObj.id,
        }
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      return result;
    })
  };
}