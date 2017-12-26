import { getImageSelectorOrigin } from '../../utils/';
import config from '../../config';
const LOAD = 'FileManager/LOAD';
const LOAD_CALLBACK = 'FileManager/LOAD_CALLBACK';
const CREATE_FOLDER = 'FileManager/CREATE_FOLDER';
const CREATE_FOLDER_CALLBACK = 'FileManager/CREATE_FOLDER_CALLBACK';
const EDIT_NAME = 'FileManager/EDIT_NAME';
const EDIT_NAME_CALLBACK = 'FileManager/EDIT_NAME_CALLBACK';
const DELETE = 'FileManager/DELETE';
const DELETE_CALLBACK = 'FileManager/DELETE_CALLBACK';
const DOWNLOAD = 'FileManager/DOWNLOAD';
const DOWNLOAD_CALLBACK = 'FileManager/DOWNLOAD_CALLBACK';

const UPLOAD_FILES = 'profile/UPLOAD_FILES';
const UPLOAD_FILES_CALLBACK = 'profile/UPLOAD_FILES_CALLBACK';

const CLEAR = 'FileManager/CLEAR';

const initialState = {};
const imageSelectorOrigin = getImageSelectorOrigin();
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
        loading: true
      };
    case LOAD_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            loading: false,
            loaded: false,
            error: action.error,
          };
        }
        return {
          ...state,
          loading: false,
          loaded: true,
          rsLoadFileManager: action.result.data,
        };
      }
    case UPLOAD_FILES:
      return {
        ...state,
        statusUploadFile: 0,
      };
    case UPLOAD_FILES_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            statusUploadFile: 2,
            errorUploadFile: action.message,
          };
        }
        return {
          ...state,
          statusUploadFile: 1,
          resultUploadFile: action.result.url,
        };
      }
    case CREATE_FOLDER:
      return {
        ...state,
        createFolderLoading: true
      };
    case CREATE_FOLDER_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            createFolderLoading: false,
            createFolderLoaded: false,
            createFolderError: action.error,
          };
        }
        return {
          ...state,
          createFolderLoading: false,
          createFolderLoaded: true,
          rsCreateFolder: action.result.data,
        };
      }
    case EDIT_NAME:
      return {
        ...state,
        editNameLoading: true
      };
    case EDIT_NAME_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            editNameLoading: false,
            editNameLoaded: false,
            editNameError: action.error,
          };
        }
        return {
          ...state,
          editNameLoading: false,
          editNameLoaded: true,
          rseditName: action.result.data,
        };
      }
    case DELETE:
      return {
        ...state,
        deleteLoading: true
      };
    case DELETE_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            deleteLoading: false,
            deleteLoaded: false,
            deleteError: action.error,
          };
        }
        return {
          ...state,
          deleteLoading: false,
          deleteLoaded: true,
          rsdelete: action.result.data,
        };
      }
    case DOWNLOAD:
      return {
        ...state,
        downloadLoading: true
      };
    case DOWNLOAD_CALLBACK:
      {
        if (action.result.status !== 'success') {
          return {
            ...state,
            downloadLoading: false,
            downloadLoaded: false,
            downloadError: action.error,
          };
        }
        return {
          ...state,
          downloadLoading: false,
          downloadLoaded: true,
          rsdownload: action.result.data,
        };
      }
    case CLEAR:
      return {
        ...state,
        createFolderLoaded: false,
        loaded: false,
      };
    default:
      return state;
  }
}
export function load(path) {
  return {
    types: [LOAD, LOAD_CALLBACK, LOAD_CALLBACK],
    promise: (client) => client.post(imageSelectorOrigin + '/api.php', {
      data: {
        do: 'list',
        path,
        public: 2,
      },
      headers: {
        expire: 0,
      }
    }).then(result => {
      console.log('rs',  result)
      if (result.status !== 'success') {
        result = result.message;
      }
      return result;
    })
  };
}
export function createFolder(name, path) {
  return {
    types: [CREATE_FOLDER, CREATE_FOLDER_CALLBACK, CREATE_FOLDER_CALLBACK],
    promise: (client) => client.post(imageSelectorOrigin + '/api.php', {
      data: {
        do: 'mkdir',
        name,
        path,
        public: 1,
      }
    }).then(result => {
      if (result.status !== 'success') {
        result = result.message;
      }
      return result;
    })
  };
}
export function editName(path, oldName, newName) {
  return {
    types: [EDIT_NAME, EDIT_NAME_CALLBACK, EDIT_NAME_CALLBACK],
    promise: (client) => client.post(imageSelectorOrigin + '/api.php', {
      data: {
        do: 'rename',
        path,
        name: oldName,
        toName: newName,
        public: 1,
      }
    }).then(result => {
      if (result.status !== 'success') {
        result = result.message;
      }
      return result;
    })
  };
}
export function deleteFolderFile(path, name) {
  return {
    types: [DELETE, DELETE_CALLBACK, DELETE_CALLBACK],
    promise: (client) => client.post(imageSelectorOrigin + '/api.php', {
      data: {
        do: 'delete',
        path,
        name,
        public: 1,
      },
    }).then(result => {
      if (result.status !== 'success') {
        result = result.message;
      }
      return result;
    })
  };
}
export function downloadFolderFile(path, name) {
  return {
    types: [DOWNLOAD, DOWNLOAD_CALLBACK, DOWNLOAD_CALLBACK],
    promise: (client) => client.post(imageSelectorOrigin + '/api.php', {
      data: {
        do: 'download',
        path,
        name,
        public: 1,
      },
    }).then(result => {
      if (result.status !== 'success') {
        result = result.message;
      }
      return result;
    })
  };
}
export function uploadFile(res) {
  const imageSelectorOrigin = config['imageSelectorOrigin'] + '/api.php?do=upload&path=/&public=1';
  return {
    types: [UPLOAD_FILES, UPLOAD_FILES_CALLBACK, UPLOAD_FILES_CALLBACK],
    promise: client => client.uploadFiles(imageSelectorOrigin, {
      data: res
    }).then((result) => {
      if (result.status !== 'success') {
        result.data = result.message;
      }
      return result;
    }),
  };
}
export function clearProps() {
  return {
    type: CLEAR,
  };
}
