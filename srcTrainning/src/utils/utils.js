// import update from 'react-addons-update';
// import assert from 'assert';
import { map } from './object';
import config from '../config';

const isMobile = () => {
  if (config.type === 'app') {
    return config.isMobile;
  } else {
    if (typeof window === 'undefined') {
      return false;
    }
    const useragent = window.navigator.userAgent;
    const isMobileRegExp = new RegExp(/iPhone|iPod|(?=.*\bAndroid\b)(?=.*\bMobile\b)|(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)|IEMobile/i);
    if (typeof window !== 'undefined') {
      if (typeof localStorage !== 'undefined') {
        try {
          return localStorage.getItem('mobile') === 'true';
        } catch (e) {}
      }
      return isMobileRegExp.test(window.navigator.userAgent);
    } else if (typeof useragent !== 'undefined') {
      return isMobileRegExp.test(useragent);
    }
    return false;
  }
};
export { isMobile };


export function objectGet(loc, ob) {
  if (typeof loc === 'string') {
    loc = loc.split('.');
  } else if (!Array.isArray(loc)) {
    throw Error('Invalid subscribe list location');
  }

  return loc.map((p, c, i) => {
    if (i === 0 && c === 'state') {
      return p;
    }
    if (typeof p !== 'object') {
      return undefined;
    }
    return p[c]
  }, ob);
}
export function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode('0x' + p1);
  }));
}

export function formatMenu(menu) {
  if (typeof menu === 'undefined' || !Array.isArray(menu)) {
    return {}
  }
  // assert(Array.isArray(menu));
  return menu.reduce((p, c) => {
    if (Array.isArray(p[c.parent_id])) {
      p[c.parent_id].push(c); // eslint-disable-line no-param-reassign
    } else {
      p[c.parent_id] = [c]; // eslint-disable-line no-param-reassign
    }
    return p;
  }, {});
}

export const firstValue = ob => typeof ob === 'object' ? ob[Object.keys(ob)[0]] : undefined;
export const secondValue = ob => typeof ob === 'object' ? ob[Object.keys(ob)[1]] : undefined;
export const firstKey = ob => typeof ob === 'object' ? Object.keys(ob)[0] : undefined;
export function b64DecodeUnicode(str) {
  return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}
export function toDate(dateStr) {  // day + time can change exp 31-12-2016 00:00:00
  const positionSpace = dateStr.indexOf(' ');
  let parts = dateStr.substr(0, positionSpace);
  parts = parts.split("-");
  return new Date(parts[2], parts[1] - 1, parts[0]);
}
export const decimalAdjust = (type, value, exp) => {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // If the value is negative...
  if (value < 0) {
    return -decimalAdjust(type, -value, exp);
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}
export const formatPrice = price => {
  let minus = false;
  if (price < 0) {
    price = Math.abs(price); // eslint-disable-line no-param-reassign
    minus = true;
  }
  if (typeof price !== 'number') {
    price = Number.parseInt(price, 10); // eslint-disable-line no-param-reassign
  }
  let str = '';
  while (price / 1000 >= 1) {
    str = `.${(price % 1000 + 1000).toString().slice(-3)}` + str;
    price = price / 1000; // eslint-disable-line no-param-reassign
  }
  return `${minus ? '-' : ''}${Math.floor(price)}${str}đ`;
};
function updateAllChild(src, val) {
  return Object.keys(src).reduce((prev, cur) => {
    if (typeof src[cur] === 'object') {
      return { ...prev, [cur]: updateAllChild(src[cur], val) };
    }
    return { ...prev, [cur]: val };
  }, {});
}
/* export const updateByPath = (src, path, val) => {
  const updateObj = path.split('.').reverse().reduce((prev, cur, i) => {
    if (i === 0) {
      return { [cur]: { $apply: curVal => {
        if (typeof curVal === 'object') {
          return updateAllChild(curVal, val);
        }
        return val;
      } } };
    }
    return { [cur]: prev };
  }, {});
  return update(src, updateObj);
};*/
const getValue = (src, path) => {
  return path.split('.').reduce((prev, cur) => typeof prev !== 'undefined' ? prev[cur] : {}, src);
};
export const getBoolean = (src, path) => {
  const val = getValue(src, path);
  if (typeof val === 'object') {
    return Object.keys(val).every(k => getBoolean(val, k) === true);
  } else if (typeof val === 'boolean') {
    return val;
  }
  return false;
};
export function deepPick(object, deep) {
  if (deep === 0) {
    return object;
  }
  let ob = {};
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      ob = { ...ob, ...deepPick(object[key], deep - 1) };
    }
  }
  return ob;
}
export function deepMap(object, deep, iteratee) {
  if (deep === 0) {
    return map(object, iteratee);
  }
  return Object.keys(object).reduce((prev, cur) => {
    return prev.concat(deepMap(object[cur], deep - 1, iteratee));
    
  }, []);
}

export function deepFunction(object, deep, func, iteratee) {
  if (deep === 0) {
    return func(object, iteratee);
  }
  return Object.keys(object).reduce((prev, cur) => prev.concat(deepMap(object[cur], deep - 1, iteratee)), []);
}
export function deepFind(object, deep, findFunc, iteratee) {
  if (deep === 0) {
    return findFunc(object, iteratee);
  }
  let returnOb;
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      returnOb = deepFind(object[key], deep - 1, findFunc, iteratee);
      if (returnOb) {
        return returnOb;
      }
    }
  }
}
export const getImgDomain = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  if (window && window.location) {
    return 'http://img.' + (window.location.hostname == 'localhost' ? 'umbala.vn' : window.location.hostname);
  }
}
export const getImageDefault = (imageType) => {
  let img;
  if (imageType === 'cover') {
    // img = config.defaultCover;
    img = getImgDomain() + '/noimage/coverdefault.jpg';
  } else {
    // img = config.defaultAvatar;
    img = getImgDomain() + '/noimage/avatardefault.jpg';
  }
  return img;
};
export const getImgApiDomain = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  if (window && window.location) {
    return 'http://www.img.' + (window.location.hostname == 'localhost' ? 'umbala.vn' : window.location.hostname);
  }
}
export const getImageSelectorOrigin = () => {
  // return config.imageSelectorOrigin;
  return getImgApiDomain();
};
export const domain = () => {
  // return config.domain;
  if (config.type === 'app') {
    return config.hostname;
  }
  if (typeof window === 'undefined') {
    return false;
  }
  if (window && window.location) {
    return (window.location.hostname == 'localhost' ? 'kpi.umbala.vn' : window.location.hostname);
  }
};

export const getApiHost = () => {
  return '//www.' + (window.location.hostname == 'localhost' ? 'umbala.vn' : window.location.hostname);
};
export function clickLink(url) {
  const protomatch = /^(https?|ftp):\/\//;
  url = url.replace(protomatch, '');
  const position = url.indexOf('/');
  url = url.slice(position);
  // const abc = a.getAttribute('value');
  // window.location.assign(urlbest);
  history.pushState('', '', url);
  return false;
}
export function addCommas(n){
  if (n && Array.isArray(n) && n.length > 1) {
    n = n.join("");
  }
  const rx=  /(\d+)(\d{3})/;
  return String(n).replace(/^\d+/, function(w){
    while(rx.test(w)){
        w= w.replace(rx, '$1.$2');
    }
    return w;
  });
}
export function convertNumber(n) {
  if (typeof n === 'undefined') {
    return false;
  }
  var patt1 = /[0-9]/g;
  return parseFloat(n.match(patt1).join(""));
}
export function noop() {};

export function formatCurrency(num) {
  if (typeof num == 'undefined' || num === '' || num === null) {
        return '0 đ';
    };
    if(typeof num != 'string'){
        num = num.toString();
    }
    var indexOfDot = num.indexOf('.');
    if (indexOfDot == num.length - 3 && num[num.length - 2] == '0' && num[num.length - 1] == '0') {
        num = num.replace('.00', '');
    }else{
        num = num.replace('.','').replace('.','').replace('.','');
    }

    num = parseInt(num);
    num *= 1;
    if (typeof(num) != 'number' || num == null || num == 'undefined' || isNaN(num)) {
        num = 0;
    };
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + ' đ';
}
export function serialize(obj) {
  if (typeof obj !== 'object') {
    return ((obj === null) ? '' : obj.toString());
  }

  let query = '', name, value, fullSubName, subName, subValue, innerObj, i; // eslint-disable-line one-var

  for (name in obj) {
    if (Object.hasOwnProperty.call(obj, name)) {
      value = obj[name];
      if (value instanceof Array) {
        for (i in value) {
          if (Object.hasOwnProperty.call(value, i)) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += serialize(innerObj) + '&';
          }
        }
      } else if (value instanceof Object) {
        for (subName in value) {
          if (Object.hasOwnProperty.call(value, subName)) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += serialize(innerObj) + '&';
          }
        }
      } else if (value !== undefined && value !== null) {
        query += name + '=' + encodeURIComponent(value) + '&'; // query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }
    }
  }
  return query.length ? query.substr(0, query.length - 1) : query;
}
export function convertStyle(iStyle) {
  const dataWebProps = {};
  if (typeof iStyle === 'undefined' || iStyle === null) {
    return dataWebProps;
  }
  let style = iStyle;
  if (typeof style === 'object') {
    if (Array.isArray(style)) {
      let hasString = false;
      for (let index = 0; index < style.length; index++) {
        if (typeof style[index] !== 'string') {
          continue;
        }
        hasString = true;
        break;
      }
      if (hasString) {
        const styles = [];
        dataWebProps.style = [];
        for (let index = 0; index < style.length; index++) {
          if (typeof style[index] !== 'string') {
            dataWebProps.style.push(style[index]);
            continue;
          }
          if (style[index] === '') {
            continue;
          }
          styles.push(style[index]);
        }
        if (styles.length > 0) {
          dataWebProps.className = styles.join(' ');
        }
        if (dataWebProps.style.length > 0) {
          hasString = false;
          style = dataWebProps.style;
        } else {
          style = {};
        }
      }
      if (!hasString) {
        const styles = {};
        let isExists = false;
        for (let index = 0; index < style.length; index++) {
          for (let j in style[index]) {
            if (typeof j !== 'string' || !style[index].hasOwnProperty(j) || j === 'flex') {
              continue;
            }
            if (typeof style[index] === 'string') {
              continue;
            }
            styles[j] = style[index][j];
            isExists = true;
          }
        }
        if (isExists) {
          style = styles;
        } else {
          style = {};
        }
        
      }
    }
  }
  if (typeof style === 'string') {
    dataWebProps.className = style;
  } else {
    dataWebProps.style = style;
  }
  return dataWebProps;
}

export function objectCompare(obj1, obj2) {
  if (
    typeof obj1 === 'undefined' &&
    typeof obj2 === 'undefined'
  ) {
    return true;
  }
  if (
    obj1 === null &&
    obj2 === null
  ) {
    return true;
  }

  if (
    typeof obj1 !== typeof obj2
  ) {
    return false;
  }
  
  for (let i in obj1) {
    if (obj1.hasOwnProperty(i)) {
      if (!obj2.hasOwnProperty(i)) return false;
      if (obj1[i] != obj2[i]) return false;
    }
  }
  for (let i in obj2) {
    if (obj2.hasOwnProperty(i)) {
      if (!obj1.hasOwnProperty(i)) return false;
      if (obj1[i] != obj2[i]) return false;
    }
  }
  return true;
}
