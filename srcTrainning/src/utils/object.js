export function check(iObj) {
  if (typeof iObj !== 'object' || iObj === null) {
    return 0;
  }
  if (Array.isArray(iObj)) {
    return 2;
  }
  return 1;
}

export function range(numEnd, numStart = 0, cb) {
  const rules = {numEnd, numStart};
  for (let i = 0; i < rules.length; i++) {
    if (typeof rules[i] !== 'number' || isNaN(rules[i]) || Number.isFinite(rules[i]) || !Number.isInteger(rules[i])) {
      return false;
    }
  }
  if (typeof cb === 'function') {
    for(let i = numStart; i < numEnd; i++) {
      if (cb(i) === false) {
        break;
      }
    }
    return true;
  }
  const arr = [];
  for(let i = numStart; i < numEnd; i++) {
    arr.push(i);
  }
  return arr;
}

export function each(iObj, cb) {
  if (typeof cb !== 'function' || check(iObj) !== 2) {
    return false;
  }
  const arr = [];
  for(let i = 0; i < iObj.length; i++) {
    if (!iObj.hasOwnProperty(i)) {
      continue;
    }
    const data = cb(iObj[i], i);
    arr.push(data);
    if (data === false) {
      break;
    }
  }
  return arr;
}

export function forEach(iObj, cb) {
  const type = check(iObj);
  if (typeof cb !== 'function' || type < 1) {
    return false;
  }
  if (type === 2) {
    for(let i = 0; i < iObj.length; i++) {
      if (!iObj.hasOwnProperty(i)) {
        continue;
      }
      cb(i);
    }
  }
  for(let i in iObj) {
    if (!iObj.hasOwnProperty(i)) {
      continue;
    }
    cb(i);
  }
}

export function map(iObj, cb) {
  const type = check(iObj);
  if (typeof cb !== 'function' || type < 1) {
    return false;
  }
  const arr = [];
  const isTwo = cb.length === 2 ? true : false;
  if (type === 2) {
    for(let i = 0; i < iObj.length; i++) {
      if (!iObj.hasOwnProperty(i)) {
        continue;
      }
      const data = isTwo ? cb(iObj[i], i) : cb(iObj[i]);
      arr.push(data);
      if (data === false) {
        break;
      }
    }
    return arr;
  }
  for(let i in iObj) {
    if (!iObj.hasOwnProperty(i)) {
      continue;
    }
    const data = isTwo ? cb(iObj[i], i) : cb(iObj[i]);
    arr.push(data);
    if (data === false) {
      break;
    }
  }
  return arr;
}

export function length(iObj) {
  const type = check(iObj);
  if (type < 1) {
    return false;
  }
  if (type === 2) {
    return iObj.length;
  }

  return Object.keys(iObj).length;
}

export function hasKey(iObj, min = 1) {
  const type = check(iObj);
  if (type < 1) {
    return false;
  }
  if (type === 2) {
    return iObj.length >= min ? true : false;
  }
  let n = 0;
  for(let i in iObj) {
    if (!iObj.hasOwnProperty(i)) {
      continue;
    }
    n += 1;
    if (n !== min) {
      continue;
    }
    return true;
    break;
  }
  return false;
}
