import { map } from '../../utils/object';
export default class FilterClass {
  constructor() {

    this._order = [
      'page',
      'keyword',
      'supplier',
      'price',
      'sort',
    ];
  }
  pathToFilter(duongDanTenMien) {
    if (typeof duongDanTenMien === 'undefined') {
      if (typeof window === 'undefined' || typeof window.location === 'undefined') {
        return {};
      }
      duongDanTenMien = window.location.pathname;
    }

    let tmp = duongDanTenMien;

    if (duongDanTenMien.substr(-4, 4) !== '.htm') return {};
    if (duongDanTenMien.substr(-1, 1) !== '/' && duongDanTenMien.indexOf('.') === -1) duongDanTenMien += '/';


    tmp = duongDanTenMien.substr(duongDanTenMien.lastIndexOf('/') + 1, duongDanTenMien.length - duongDanTenMien.lastIndexOf('/') - 1 - 4); // - / và - .htm
    let pargam = tmp.split('.'), get = {};

    let keyLast = -1, key, k, i;
    for (key in pargam)
    {
      k = pargam[key];

      i = k.split('_');
      if (i.length === 1) continue;

      if (typeof(i[1]) === 'undefined' || i[1] === '') {
        k = pargam[keyLast] = pargam[keyLast] + '.' + i[0];
        i = k.split('_');
      } else {
        keyLast = key;
      }

      get[i[0]] = i[1].split(',');
    }
    map(get, (val, key) => {
      get[key] = {};
      get[key].value = [];
      if (this._order.indexOf(key) > -1) {
        get[key].value = val;
      } else {
        // val la 1 cai arr sony, lg, samsung
        map(val, data => {
          get[key].value.push({ value: data, id: '' });
        })
      }
      
      get[key].id = '';
    })
    return get;
    /*
    if (!pathname || !pathname.length) {
      return {};
    }
    const filterObj = {};
    const filters = pathname.split('.');
    filters.forEach(f => {
      filterObj[f.split('_')[0]] = f.split('_')[1].split(',');
    });
    return filterObj;
    */
  }

  filterToPath(arr, duongDanTenMien, checkLink) {
    if (typeof arr !== 'object') arr = {};
    if (typeof duongDanTenMien !== 'string' || duongDanTenMien === '') {
      if (typeof window === 'undefined' || typeof window.location === 'undefined') {
        return '';
      }
      duongDanTenMien = window.location.pathname;
    }
    if (duongDanTenMien.substr(-1, 1) !== '/' && duongDanTenMien.indexOf('.') === -1) duongDanTenMien += '/';

    if (typeof checkLink === 'undefined' || checkLink !== true) checkLink = false;

    if (checkLink === true && Object.keys(arr).length === 0) {
      arr = this.pathToFilter(duongDanTenMien);
    }

    const arrOrder = {};

    let i = '', k;
    // bo sung thieu
    for (i in arr) {
      if (typeof arr[i] === 'object' && typeof arr[i].value !== 'undefined' &&
        arr[i].value[0] !== '' && i !== 'null') continue;
      delete arr[i];
    }

    i = 'page';
    if (typeof arr[i] !== 'undefined' && typeof arr[i].value !== 'undefined' && arr[i].value[0] < 2) delete arr[i];
    i = 'sort';
    if (typeof arr[i] !== 'undefined' && typeof arr[i].value !== 'undefined' && arr[i].value[0] === 'timedesc') delete arr[i];
    i = 'keyword';
    if (typeof arr[i] !== 'undefined' && typeof arr[i].value !== 'undefined' && arr[i].value[0].length < 2) delete arr[i];

    for (k in this._order) {
      i = this._order[k];
      if (typeof arr[i] === 'undefined') continue;

      arrOrder[i] = arr[i];
      delete arr[i];
    }
    // bo sung thieu
    for (i in arr) {
      if (typeof arr[i] === 'undefined') continue;
      arrOrder[i] = arr[i];
    }
    arr = arrOrder;

    let nameCode = '';
    for (i in arr) {
      let filterChildren = '';
      if (this._order.indexOf(i) > -1) {
        filterChildren = arr[i].value[0];
      } else {
        arr[i].value.map(data => filterChildren += data.value + ',');
        filterChildren = filterChildren.substr(0, filterChildren.length - 1);
      }
      nameCode += '.' + i + '_' + filterChildren;
    }
    nameCode = nameCode.substr(1);
    if (nameCode !== '') nameCode += '.htm';
    
    duongDanTenMien = duongDanTenMien.substr(0, duongDanTenMien.lastIndexOf('/') + 1);

    return (duongDanTenMien + nameCode);
    /*
    const defaultFilter = orgFilter.reduce((p, c) => {
      if (!filter[c.name_code]) {
        return p;
      }
      const oneFilter = c.filter_value.reduce((op, oc) => {
        if (filter[c.name_code].indexOf(oc.name_code) === -1) {
          return op;
        }
        return `${op}${op.length ? ',' : ''}${oc.name_code}`;
      }, '');
      return `${p}${p.length ? '.' : ''}${c.name_code}_${oneFilter}`;
    }, '');
    return `${(filter.page && filter.page.length) ? `page_${filter.page[0]}` : ''}${(filter.page && filter.page.length && defaultFilter && defaultFilter.length) ? '.' : ''}${(defaultFilter && defaultFilter.length > 0) ? `${defaultFilter}` : ''}`;
    // return Object.keys(filter).reduce((p, c) => `${p}${p.length === 0 ? '' : '.'}${(filter[c] && filter[c].length) ? `${c}_` : ''}${filter[c].join(',')}`, '');
    */
  }
}
