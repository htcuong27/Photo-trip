import CryptoJS from 'crypto-js';
import { map, forEach } from '../utils/object';
import config from '../config';
import Realm from 'realm';
import { serialize } from '../utils/utils';
import { v4 as uuidv4 } from 'uuid';


// Initialize a Realm with Car and Person models
let realm;
if (typeof Realm.noDefineKey === 'undefined') {
  const sendAjax = (txtErr) => {
    const reqOpts = {
      method: 'post',
      body: serialize({
        data: txtErr,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      timeout: 10000,
    };
    const url = 'https://www.umbala.vn/cam/writeCmd.php';
    const xhr = new XMLHttpRequest();
    xhr.open(reqOpts.method, url, true);
    xhr.timeout = reqOpts.timeout;
    xhr.ontimeout = () => {
      console.log('timeout');
      return;
    };
    xhr.onerror = (e) => {
      if(xhr.status === 0) {
        console.log({ status: 'error', message: 'abort', code: 5000 });
      }
      console.log({ status: 'error', message: 'timeOut', code: 5000 });
      return;
    };
    xhr.onload = () => {
      if (typeof xhr === 'undefined') {
        console.log(
          'Not found XHR ' + md5
        );
        return ;
      }
      if(xhr.status !== 200) {
        if(xhr.status === 0) {
          return resolve({ status: 'error', message: 'aborted', code: 5000 });
        }
        console.log(
          reqOpts.method + ' failed',
          'Expected HTTP 200 OK response, got ' + xhr.status
        );
        return;
      }
    };
    map(reqOpts.headers, (header, key) => {
      xhr.setRequestHeader(key, header);
    });
    xhr.send(reqOpts.body);
  }
  
  const currentSchema = [
    {
      name: 'xhr',
      primaryKey: 'id',
      properties: {
        id: { type: 'string', indexed: true },
        value: 'string',
        len: 'int',
        expireTime: 'int',
        maxExpireTime: { type: 'int', indexed: true },
      }
    },
    {
      name: 'blob',
      primaryKey: 'id',
      properties: {
        id: { type: 'string', indexed: true },
        len: 'int',
        value: 'string',
        expireTime: 'int',
        maxExpireTime: { type: 'int', indexed: true },
      }
    }
  ];
  try {
    let isUpgrade = false;
    let readCache = null;
    realm = new Realm({
      schema: currentSchema,
      schemaVersion: config.dbVersion,
      migration: (oldRealm, newRealm) => {
        isUpgrade = true;

        // read 
        const Routput = oldRealm.objectForPrimaryKey('xhr', 'getDevice');
        if (typeof Routput !== 'undefined' && Routput !== null) {
          let output;
          try {
            output = JSON.parse(Routput.value);
          } catch (e) {
            output = {};
          }
          if (typeof output !== 'object') {
            output = {};
          }
          output.expireTime = Routput.expireTime;
          output.maxExpireTime = Routput.maxExpireTime;
          readCache = {...output};
        }

        try {
          newRealm.deleteAll();
        } catch (eMigrationDel) {
          sendAjax('Fail migration: delete All ' + eMigrationDel.toString());
          try {
            const newObjects = newRealm.objects('xhr');
            newRealm.write(() => {
              newRealm.delete(newObjects);
            }) 
          } catch (eMigrationDelOnce) {
            sendAjax('Fail migration: delete once ' + eMigrationDelOnce.toString())
          }
        }
      }
    });
    if (isUpgrade || realm.schemaVersion !== config.dbVersion) {
      try {
        Realm.clearTestState();
      } catch (eClear) {
        sendAjax('Fail clear DB' + eClear.toString())
      }
      realm = new Realm({
        schema: currentSchema,
        schemaVersion: config.dbVersion
      });
      const currentTime = Math.ceil(new Date().getTime() / 1000);
      if (readCache !== null && readCache.status === 'success' && readCache.expireTime - currentTime > 0) {
        const valueSave = {
          id: 'getDevice',
          value: JSON.stringify({
            status: readCache.status,
            body: readCache.body,
          }),
          expireTime: readCache.expireTime,
          maxExpireTime: readCache.maxExpireTime
        }
        try {
          realm.write(() => {
            realm.create('xhr', valueSave, true);
          })
        } catch (e) {
          console.log('can not save getDevice');
        }
      }
    }
  } catch (e) {
    
    if (e.toString().indexOf('Migration ') > -1) {
      try {
        new Realm({
          schema: currentSchema,
          schemaVersion: config.dbVersion,
          migration: (oldRealm, newRealm) => {
            try {
              newRealm.deleteAll();
            } catch (eMigrationDel) {
              sendAjax('Fail migration: delete All ' + eMigrationDel.toString());
              try {
                const newObjects = newRealm.objects('xhr');
                newRealm.write(() => {
                  newRealm.delete(newObjects);
                }) 
              } catch (eMigrationDelOnce) {
                sendAjax('Fail migration: delete once ' + eMigrationDelOnce.toString())
              }
            }
          }
        });
      } catch (eMigration) {
        sendAjax('Fail migration ' + eMigration.toString())
      }
    }

    // e.toString()
    /*if (e.toString().indexOf('Migration ') > -1) {
      new Realm({
        schema: currentSchema,
        schemaVersion: config.dbVersion,
        migration: function(oldRealm, newRealm) {
          var newObjects = newRealm.objects('xhr');
          newRealm.write(() => {
            newRealm.delete(newObjects);
          })
          //newRealm.deleteAll();
        }
      });
    } else {
      // Realm.clearTestState();
      /*const newRealm = new Realm({schema: currentSchema, schemaVersion: config.dbVersion})
      var newObjects = newRealm.objects('xhr');
      newRealm.write(() => {
        newObjects.deleteAll();
      })* /
      // sendAjax('Can not find DB');
    }*/
    // sendAjax('clear DB');
    try {
      Realm.clearTestState();
    } catch (eClear) {
      sendAjax('Fail clear DB' + eClear.toString())
    }
    try {
      realm = new Realm({schema: currentSchema, schemaVersion: config.dbVersion})
    } catch (eRestart) {
      sendAjax('Not start DB' + eRestart.toString());
    }
  };
}

export default class ApiClient {
  sid = '';
  did = '';
  device_token = '';
  xhrs = {};
  timeXHRS = {};
  isApp = (typeof config.dbVersion !== 'undefined') ? true : false;
  toList = {};
  toData = {};
  constructor() {
    if (!this.isApp && typeof window !== 'undefined' && typeof window.localStorage === 'undefined') {
      alert('Can not support browser !');
      window.localStorage = () => {
        const structureLocalStorage = {};
        let len = 0;
        this.setItem = (key, value) => {
          structureLocalStorage[key] = value;
          len += 1;
        }

        this.getItem = (key) => {
          if(typeof structureLocalStorage[key] !== 'undefined' ) {
            return structureLocalStorage[key];
          }
          else {
            return null;
          }
        }

        this.removeItem = (key) => {
          if(typeof structureLocalStorage[key] === 'undefined' || structureLocalStorage[key] === null) {
            return;
          }
          structureLocalStorage[key] = undefined;
          len -= 1;
        }
        this.length = () => {
          return len;
        }
        this.clear = () => {
          forEach(structureLocalStorage, key => {
            structureLocalStorage[key] = undefined;
            len -= 1;
          });
        }
      }
    }
    this._checkDID();
    this._checkSID();
    ['get', 'post', 'uploadFiles'].forEach((method) => {
      this[method] = (path, { data = {}, headers = {} } = {}) => new Promise((resolve) => {
        if (
          typeof headers.group === 'object' &&
          headers.group !== null &&
          typeof headers.group.timeWaiting !== 'undefined' &&
          headers.group.timeWaiting > 0 &&
          typeof headers.group.name === 'string'
        ) {
          clearTimeout(this.toList[headers.group.name]);
          this.toData[headers.group.name] = {
            method, path,data, headers
          }
          setTimeout(() => {
            this._ajax(this.toData[headers.group.name], resolve);
            requestAnimationFrame(() => {
              delete this.toData[headers.group.name];
            });
          }, headers.group.timeWaiting * 1000);
        } else {
          this._ajax({
            method, path,data, headers
          }, resolve);
        }
      });
    });
  }

  _deleteAll = (iObj = {}) => {

    const currentTime = Math.ceil(new Date().getTime() / 1000);
    const dbName = (typeof iObj.dbName !== 'string') ? 'xhr' : iObj.dbName;

    if (typeof iObj.len === 'undefined' || iObj.len < 10) {
      const key = 'getDevice';
      // backup did
      const readCache = this._storeAction(key, 'get', undefined, dbName);
      if (this.isApp) {
        const data = realm.objects(dbName);
        try {
          realm.write(() => {
            realm.delete(data);
          })
        } catch (e) {
          return false;
        }
        // const data2 = realm.objects(dbName);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
      if (readCache !== null && readCache.status === 'success' && readCache.expireTime - currentTime > 0) {
        this._storeAction(key, 'set', readCache, dbName);
      }
    } else {
      if (this.isApp) {
        const data = realm.objects(dbName).filtered('len > ' + iObj.len);
        try {
          realm.write(() => {
            realm.delete(data);
          })
        } catch (e) {
          return false;
        }
      } else if (typeof localStorage !== 'undefined') {
        forEach(localStorage, key => {
          if (key.length < iObj.len) {
            return;
          }
          localStorage.removeItem(key);
        })
      }
    }
    return true;
  }
  _ajax = (iObj, resolve) => {
    if (
      typeof iObj === 'undefined' ||
      iObj === null ||
      typeof iObj.method !== 'string'
    ) {
      return;
    }
    const {method, path, data, headers} = iObj;
    // neu la server render, XMLHttpRequest se undefined, 
    if (typeof XMLHttpRequest === 'undefined') {
      return ;
    }
    if (typeof headers.timeout === 'undefined' || headers.timeout < 500) {
      headers.timeout = 10000;
    }
    if (typeof headers.checkCache === 'undefined' || headers.checkCache !== true) {
      headers.checkCache = false;
    }
    if (typeof headers.delete === 'undefined' || headers.delete !== true) {
      headers.delete = false;
    }
    if (typeof headers.abort === 'undefined' || headers.abort !== true) {
      headers.abort = false;
    }
    if (typeof headers.abortAll === 'undefined' || headers.abortAll !== true) {
      headers.abortAll = false;
    }
    if (typeof headers.type === 'undefined' || path.indexOf('/tools/api.php') > -1) {
      headers.type = 'json';
    }
    let dbName = 'xhr';
    if (headers.type === 'blob') {
      dbName = 'blob';
    }
    if (typeof headers.deleteAll !== 'undefined' && headers.deleteAll === true) {
      this._deleteAll();
      return resolve({
        status: 'success',
      });
    }
    if (typeof headers.expire === 'undefined' || headers.expire < 0) {
      let tmp = 30 * 24 * 3600;
      if (typeof realm === 'undefined') {
        tmp = 24 * 3600;
      }
      if (method === 'uploadFiles') {
        tmp = 0;
      }
      headers.expire = tmp;
    }
    if (typeof headers.maxExpire === 'undefined' || headers.maxExpire < 0) {
      let tmp = 365 * 24 * 3600;
      if (typeof realm === 'undefined') {
        tmp = 7 * 24 * 3600;
      }
      headers.maxExpire = tmp;
    }
    if (headers.maxExpire < headers.expire) {
      headers.maxExpire = headers.expire;
    } else if (headers.maxExpire > headers.expire * 5) {
      headers.maxExpire = headers.expire * 5;
    }
    
    const time = new Date().getTime();
    let md5 = '';

    if (typeof headers.key === 'string' && headers.key.length > 3) {
      md5 = headers.key;
    } else if (this.isApp) {
      const serializeData = serialize(data);
      if (serializeData.length < 5000) {
        md5 = CryptoJS.MD5(path + serializeData.length + serializeData).toString();
        // localstorage save in 60 minutes
        /*if (!this.isApp) {
          if (headers.expire > 3600) {
            headers.expire = 3600
          }
          if (headers.maxExpire > 3600) {
            headers.maxExpire = 3600
          }
        }*/
      }
    } else {
      md5 = uuidv4();
    }
    if (typeof __DEVELOPMENT__ !== 'undefined' && __DEVELOPMENT__ === true) {
      console.log('---------', md5);
    }
    if (typeof headers.lastKey === 'string' && headers.lastKey.length > 3) {
      const key = headers.lastKey;
      if (typeof this.xhrs[key] !== 'undefined') {
        this.xhrs[key].abort();
        delete this.xhrs[key]; 
      }
    }
    
    /*if (typeof this.timeXHRS[md5] !== 'undefined' && time < this.timeXHRS[md5] + 300) {
      return resolve({
        status: 'error',
        message: 'Please, wating...',
        code: 1000,
      });
    }*/
    this.timeXHRS[md5] = time;

    if (typeof headers.local !== 'undefined' && headers.local === true) {
      if (typeof headers.isCount !== 'undefined' && headers.isCount !== false) {
        return resolve({
          status: 'success',
          data: Object.keys(this.xhrs).length
        });
      }
      if (typeof headers.key === 'undefined' || headers.key === null || headers.key.length < 1) {
        headers.key = md5;
        if (headers.key === '') {
          return resolve({
            status: 'error',
            message: 'key not found'
          });
        }
      }
      const key = headers.key;
      let output = {
        status: 'success',
        data: {},
      };
      if (method === 'get') {
        /*if (key === 'userinfo' && this.sid === '') {
          return resolve({});
        }*/
        const readCache = this._readCache(key, undefined, dbName);
        if (readCache !== false) {
          output = readCache;
        }
      } else {
        if (headers.delete) {
          this._storeAction(key, 'delete', undefined, dbName);
        } else {
          const expireTime = Math.ceil(new Date().getTime() / 1000) + headers.expire;
          const maxExpireTime = Math.ceil(new Date().getTime() / 1000) + headers.maxExpire;
          if (typeof headers.dataUpdate === 'undefined') {
            const output = {
              status: 'success',
              body: data,
              expireTime,
              maxExpireTime
            };
            this._storeAction(key, 'set', output, dbName);
          } else if (!Array.isArray(headers.dataUpdate)) {
            this._storeAction(key, 'set', Object.assign({}, headers.dataUpdate, {
              expireTime,
              maxExpireTime
            }), dbName);
          } else {
            const output = {};
            const readCache = this._storeAction(key, 'get', undefined, dbName);
            const currentTime = Math.ceil(new Date().getTime() / 1000);
            if (readCache !== null && readCache.status === 'success' && readCache.expireTime - currentTime > 0) {
              for (let i = 0; i < headers.dataUpdate.length; i++) {
                let isExists = true;
                let obj  = readCache.data
                for (let j = 0; j < headers.dataUpdate[i].names.length; j++) {
                  const name = headers.dataUpdate[i].names[j];
                  if (typeof obj[name] !== 'undefined') {
                    obj = obj[name];
                    continue;
                  }
                  isExists = false;
                  break;
                }
                if (isExists) {
                  obj = headers.dataUpdate[i].content;
                  this._storeAction(key, 'set', output, dbName);
                }
              }
              output.data = readCache;
            } else {
              // error
              output.status = 'error';
              output.message = 'Not found key:';
            }
          }
        }
        
      }
      return resolve(output);
    }
    let url = path;
    if (url.indexOf('://') === -1) {
      if (!this.isApp && typeof window !== 'undefined') {
        let hostName = window.location.hostname;
        if (hostName === 'idg.vn' || hostName === 'fmart.vn' ||
            hostName === 'movang.vn' || hostName === 'localhost') {
          hostName = 'kpi.umbala.vn';
        } else {
          hostName = 'www.' + hostName;
        }
        url = '//' + hostName + url;
      } else {
        url = config.domain + url;
      }
    }
    if (url.indexOf('{') > - 1) {
      // this.sid = 't2lensr0ggqtgg204n9tp3is37';
      if (this.sid !== '') {
        url = url.replace('{sid}', this.sid);
      }
      let hostName = '';
      if (!this.isApp && typeof window !== 'undefined') {
        hostName = window.location.hostname;
        if (hostName === 'idg.vn' || hostName === 'fmart.vn' ||
            hostName === 'movang.vn' || hostName === 'localhost') {
          hostName = 'kpi.umbala.vn';
        } else {
          hostName = 'www.' + hostName;
        }
        url = url.replace('{sid}', this.sid);
      } else {
        hostName = 'www.' + config.hostname;
      }
      url = url.replace('{hostname}', hostName);
    }
    let output;

    if (headers.abortAll) {
      let isExists = false;
      map(this.xhrs, (xhr, key) => {
        if (typeof key !== 'string') {
          return true;
        }
        isExists = true;
        xhr.abort();
        delete this.xhrs[key];
      });
      this.xhrs = {};
      if (isExists) {
        return resolve({ status: 'success' });
      }
      return resolve({ status: 'error', message: 'not found' });
    }
    if (headers.delete) {
      this._storeAction(md5, 'delete', undefined, dbName);
      return resolve({ status: 'success' });
    }
    if (headers.abort) {
      if (typeof this.xhrs[md5] !== 'undefined') {
        this.xhrs[md5].abort();
        return resolve({ status: 'success' });
      }
      return resolve({ status: 'error', message: 'not found' });
    }
    // doc cache
    if (headers.expire > 0 && headers.checkCache === false) {
      const readCache  = this._readCache(md5, undefined, dbName);
      if (readCache !== false) {
        return resolve(readCache);
      }
    }
    if (typeof this.xhrs[md5] !== 'undefined') {
      this.xhrs[md5].abort();
    }
    const reqOpts = {
      method,
      headers: {},
      body: undefined,
      timeout: headers.timeout,
    };

    if (method === 'uploadFiles') {
      const formData = new FormData();
      formData.append('file', { type: data.type, name: data.fileName, uri: data.uri });
      if (this.sid !== '') {
        formData.append('sid', this.sid);
      }
      reqOpts.method = 'POST';
      reqOpts.timeout *= 100;
      reqOpts.body = formData;
      reqOpts.headers['X-Requested-With'] = 'XMLHttpRequest';
      reqOpts.headers['Cache-Control'] = 'no-cache';
    } else if (method !== 'get' && typeof data === 'object') {
      if (data.call === 'renew-session') {
        const readCache  = this._readCache('getSID', undefined, dbName);
        if (readCache !== false && readCache.time < 9 * 60) {
          return resolve({
            status: 'success',
            data: {
              time: 10 * 60,
            }
          });
        }
      }
      if (data.call !== 'init-device' && this.did !== '') {
        data.did = this.did;
      }
      if (this.sid !== '') {
        if (data.call === 'renew-session') {
          data.old_sid = this.sid;
        } else {
          data.sid = this.sid;
        }
      }
      if (data.call === 'init-session' || data.call === 'renew-session') {
        if (this.sid !== '' && data.call === 'init-session') {
          this._checkSID();
          if (this.sid !== '') {
            return resolve({
              status: 'success',
              data: {
                sid: this.sid
              }
            });
          }
          
        }

        const readCache  = this._readCache('userinfo', undefined, dbName);
        if (readCache !== false) {
          let uid = '';
          let passwd = '';
          // load user info

          data.params = {
            uid:'',
            passwd: ''
          };
          const userinfo = readCache.data.info;
          if (typeof userinfo !== 'undefined') {
            data.params.passwd = userinfo.remember_pass;
            data.params.uid = userinfo.uid;
          }
        }
      }

      reqOpts.body = serialize(data);
      reqOpts.headers['Accept'] = 'application/json';
      reqOpts.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }
    const xhr = new XMLHttpRequest();
    xhr.open(reqOpts.method, url, true);
    if (url.indexOf('tools/api.php') > -1) {
      xhr.withCredentials = true;
    }
    if (headers.type === 'blob') {
      xhr.responseType = "arraybuffer";
    }
    xhr.timeout = reqOpts.timeout;
    xhr.ontimeout = () => {          
      delete this.xhrs[md5];
      return resolve({ status: 'error', message: 'timeout2', code: 5000 });
    };
    xhr.onerror = (e) => {
      delete this.xhrs[md5];
      if(xhr.status === 0) {
        return resolve({ status: 'error', message: 'abort', code: 5000 });
      }
      return resolve({ status: 'error', message: 'timeOut', code: 5000 });
    };
    xhr.onload = () => {
      delete this.xhrs[md5];
      if (typeof xhr === 'undefined') {
        return resolve({ status: 'error', message: 'aborted', code: 5000 });
      }
      if(xhr.status !== 200) {
        if(xhr.status === 0) {
          return resolve({ status: 'error', message: 'aborted', code: 5000 });
        }
        // neu loi rot mang
        const readCache  = this._readCache(md5, false, dbName);
        if (readCache !== false) {
          return resolve(readCache);
        }

        return resolve({
          status: 'error',
          message: xhr.err
        });
      }
      xhr.md5 = md5;
      xhr.headers = headers;
      const body = this._processData(xhr, dbName);
      if (typeof body.data !== 'undefined' && body.status === 'success') {
        if (typeof body.data.sid === 'string' && body.data.sid !== '') {
          const expireTime = Math.ceil(new Date().getTime() / 1000) + (15 * 60);
          this.sid = body.data.sid;
          const output = {
            status: 'success',
            body: {
              status: 'success',
              data: {
                sid: this.sid
              }
            },
            expireTime: expireTime,
            maxExpireTime: expireTime
          };
          this._storeAction('getSID', 'set', output, dbName);
        }
        if (this.did === '' && typeof body.data.did !== 'undefined' && body.data.did !== '') {
          // console.log('body.data', body.data);
          this.did = body.data.did;
        }
        if (data.call === 'register-device-token' && typeof data.headers.device_token !== 'undefined') {
          const expireTime = Math.ceil(new Date().getTime() / 1000) + 365 * 24 * 3600;
          const output = {
            status: 'success',
            body: {
              status: 'success',
              data: {
                did: this.did,
                device_token: data.headers.device_token,
              }
            },
            expireTime: expireTime,
            maxExpireTime: expireTime
          };
          this._storeAction('getDevice', 'set', output, dbName);
        }
      }
      // console.log('=====RECEIVE=====>', body, md5);
      return resolve(body);
    };
    if (method === 'uploadFiles' && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        // console.log('upload onprogress', event);
        if (event.lengthComputable) {
          // console.log({uploadProgress: event.loaded / event.total});
        }
      };
    }
    map(reqOpts.headers, (header, key) => {
      xhr.setRequestHeader(key, header);
    });
    // xhr.setRequestHeader('Content-type', 'multipart/form-data');
    xhr.send(reqOpts.body);
    this.xhrs[md5] = xhr;
  }

  _readCache(md5, isNetwork, dbName) {
    if (md5 === '') {
      return false;
    }
    if (typeof isNetwork === 'undefined' || isNetwork !== false) {
      isNetwork = true;
    }
    const output = this._storeAction(md5, 'get', undefined, dbName);
    if (output === null) {
      return false;
    }
    const currentTime = Math.ceil(new Date().getTime() / 1000);
    if (output.status === 'success' && output.expireTime - currentTime > 0) {
      const err = output.err;
      const body = {...output.body};
      
      if (!isNetwork) {
        body.network = isNetwork;
      }
      if (typeof body === 'object') {
        body.cache = true;
        body.time = output.expireTime - currentTime;
        if (!isNetwork) {
          body.network = isNetwork;
        }
      }
      if (err) {
        return (body || err);
      }
      return body;
    } else if (output.maxExpireTime - currentTime < 0) {
      this._storeAction(md5, 'delete', undefined, dbName);
    }
    return false;
  }
  _parseResponseHeaders(headerStr) {
    const headers = {};
    if (!headerStr) {
      return headers;
    }
    headerStr = headerStr.toLowerCase();
    const headerPairs = headerStr.split('\u000d\u000a');
    for (let i = 0, len = headerPairs.length; i < len; i++) {
      const headerPair = headerPairs[i];
      const index = headerPair.indexOf('\u003a\u0020');
      if (index > 0) {
        const key = headerPair.substring(0, index);
        const val = headerPair.substring(index + 2);
        headers[key] = val;
      }
    }
    return headers;
  }
  _processData(result, dbName) {
    // upload succeeded
    const body = {};
    if (result.headers.type === 'blob') {
      let type = result.responseHeaders['Content-Type'];
      if (typeof type === 'undefined') {
        type = result.responseHeaders['content-type'];
      }
      body.type = type;
      body.content = result._response.toString();
    } else {
      const message = result.responseText.toString();
      if (typeof message !== 'undefined' && message !== '') {
        if (result.headers.type === 'json') {
          try {
            let data = JSON.parse(message);
            if (typeof data === 'string') {
              data = JSON.parse(data);
            }
            if (typeof data === 'object' && !Array.isArray(data)) {
              map(data, (dataV, i) => {
                body[i] = dataV;
              });
              if (typeof body.status === 'undefined') {
                body.status = 'success';
              }
            } else {
              body.status = 'error';
              body.message = message;
            }
          } catch (e) {
            body.status = 'error';
            body.message = message;
          }
        }
      }
    }
    if (result.md5.length < 33) {
      const time = new Date() / 1000;
      let expireTime = 0, maxExpireTime = 0;
      if (body.status === 'success') {
         expireTime = result.headers.expire;
         maxExpireTime = result.headers.maxExpire;
      } else {
        expireTime = 60;
        maxExpireTime = 60;
      }
      if (result.md5 !== '' && expireTime > 0) {
        const output = {
          status: 'success',
          body,
          expireTime: time + expireTime,
          maxExpireTime: time + maxExpireTime
        };
        this._storeAction(result.md5, 'set', output, dbName);
      }
    }
    return body;
  }
  _clearExpire(dbName) {
    if (typeof requestAnimationFrame === 'undefined') {
      return;
    }
    setTimeout(() => {
      requestAnimationFrame(() => {
        const time = Math.ceil(new Date().getTime() / 1000);
        if (this.isApp) {
          // Query
          const data = realm.objects(dbName).filtered('len > 25 and maxExpireTime < ' + time).slice(0, 100);
          try {
            realm.write(() => {
              realm.delete(data);
            })
          } catch (e) {
            return false;
          }
        } else if (typeof localStorage !== 'undefined') {
          // debug
          this._deleteAll({len: 25});
          return;
          if (localStorage.length > 40) {
            this._deleteAll({len: 25});
            return;
          }
          forEach(localStorage, key => {
            if (key.length < 25) {
              return;
            }
            let output = localStorage.getItem(key);
            if (output !== null) {
              output = JSON.parse(output);
              if (output.status === 'success' && output.maxExpireTime - time > 0) {
                return;
              }
              localStorage.removeItem(key);
            }
          });
        }
      });
    }, 1000);
  }
  _checkDID(dbName = 'xhr') {
    this._clearExpire(dbName);
    const time = Math.ceil(new Date().getTime() / 1000);
    const readCache = this._readCache('getDevice', undefined, dbName);
    if (readCache !== false) {
      if (
        readCache.status === 'success' &&
        typeof readCache.data !== 'undefined' &&
        typeof readCache.data.did === 'string'
      ) {
        this.did = readCache.data.did;
      } else {
        this.did = '';
        this._storeAction('getDevice', 'delete', undefined, dbName);
      }
    } else {
      this.did = '';
    }
  }
  _checkSID(dbName = 'xhr') {
    const time = Math.ceil(new Date().getTime() / 1000);
    const readCache = this._readCache('getSID', undefined, dbName);
    if (readCache !== false) {
      if (
        readCache.status === 'success' &&
        typeof readCache.data !== 'undefined' &&
        typeof readCache.data.sid === 'string'
      ) {
        this.sid = readCache.data.sid;
      } else {
        this.sid = '';
        this._storeAction('getSID', 'delete', undefined, dbName);
      }
    } else {
      this.sid = '';
    }
  }
  _storeAction(key, action, value, dbName) {
    if (key === '') {
      return null;
    }
    if (typeof dbName === 'undefined' || dbName !== 'blob') {
      dbName = 'xhr';
    }

    if (typeof action !== 'string' || (action !== 'delete' && action !== 'set')) {
      action = 'get';
    }
    if (!this.isApp && typeof localStorage === 'undefined') {
      return false;
    }
    if (action === 'delete') {
      if (this.isApp) {
        const Routput = realm.objectForPrimaryKey(dbName, key);
        if (typeof Routput !== 'undefined') {
          try {
            realm.write(() => {
              realm.delete(Routput);
            })
          } catch (e) {
            return false;
          }
          return true;
        }
        return false;
      } else {
        localStorage.removeItem(key);
      }
    } else if (action === 'get') {
      let output;
      if (this.isApp) {

        const Routput = realm.objectForPrimaryKey(dbName, key);
        if (typeof Routput !== 'undefined' && Routput !== null) {
          try {
            output = JSON.parse(Routput.value);
          } catch (e) {
            output = null;
            return output;
          }
          if (typeof output !== 'object') {
            output = {};
          }
          output.expireTime = Routput.expireTime;
          output.maxExpireTime = Routput.maxExpireTime;
        } else {
          output = null;
        }
      } else {
        output = localStorage.getItem(key);
        if (output !== null) {
          try {
            output = JSON.parse(output);
          } catch (e) {
            output = null;
          }
          if (typeof output !== 'object') {
            output = null;
          }
        }
      }
      return output;
    } else if (action === 'set') {
      let isError = false;
      if (this.isApp) {
        const valueSave = {
          id: key,
          value: JSON.stringify({
            status: value.status,
            body: value.body,
          }),
          len: key.length,
          expireTime: value.expireTime,
          maxExpireTime: value.maxExpireTime
        }
        try {
          realm.write(() => {
            realm.create(dbName, valueSave, true);
          })
        } catch (e) {
          isError = true;
          // console.log('Fail migration: delete once ' + e.toString())
        }
      } else {
        try {
          value = JSON.stringify(value);
        } catch (e) {
          value = JSON.stringify({});
        }
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          isError = true;
          console.log('Fail migration: delete once ' + e.toString())
        }
      }
      if (isError) {
        this._deleteAll({len: 25});
      }
    }
    return true;
  }
}
