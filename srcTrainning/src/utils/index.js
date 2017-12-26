import config from '../config';
export function htmlEntities(str) {
   return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
export function formatCurrency(num) {
  if (typeof num == 'undefined' || num === '' || num === null) {
        return '0 đ';
    };
    if(typeof num != 'string'){
        num = num.toString();
    }
    const indexOfDot = num.indexOf('.');
    if (indexOfDot == num.length - 3 && num[num.length - 2] == '0' && num[num.length - 1] == '0') {
        num = num.replace('.00', '');
    }else{
        num = num.replace('.','').replace('.','').replace('.','');
    }

    num = parseInt(num);
    num *= 1;
    if (typeof(num) != 'number' || num == null || num == 'undefined' || num < 0 || isNaN(num)) {
        num = 0;
    };
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + ' đ';
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
export const getImageSelectorOrigin = () => {
  return config.imageSelectorOrigin;
};
function convertTimestamp(aInput) {
    /* default data */
    let tmps = {
        timestamp       : '1',
        gmt             : 0,
        type            : 'full'
    };

    if(typeof(aInput) == 'undefined') aInput = tmps;
    for (let i in tmps)
        if(typeof(aInput[i]) == 'undefined') aInput[i] = tmps[i];
    tmps = {};

    let d       = new Date(aInput['timestamp'] * 1000 - (60 * 60 * aInput['gmt'] * 1000)),   // Convert the passed timestamp to milliseconds
        yyyy    = d.getFullYear(),
        mm      = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
        dd      = ('0' + d.getDate()).slice(-2),         // Add leading 0.
        hh      = d.getHours(),
        h       = hh,
        min     = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
        ampm    = 'AM',
        day     = d.getDay(),
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }

    switch(day) {
        case 0: day = 'Chủ nhật'; break;
        case 1: day = 'Thứ hai'; break;
        case 2: day = 'Thứ ba'; break;
        case 3: day = 'Thứ tư'; break;
        case 4: day = 'Thứ năm'; break;
        case 5: day = 'Thứ sáu'; break;
        case 6: day = 'Thứ bảy'; break;
    }

    // ie: 2013-02-18, 8:35 AM
    if(aInput['type'] == 'full'){
        time = hh + ':' + min  + ' ' + day + ' ' +  dd + '/' + mm + '/' + yyyy;
    };

    if (aInput['type'] == 'small') {
        time =  day + ' - ' +  dd + '/' + mm + '/' + yyyy;
    };

    if (aInput['type'] == 'short') {
        time =  hh + ':' + min + ' - ' +  dd + '/' + mm + '/' + yyyy;
    };

    if (aInput['type'] == 'range') {
        let hEnd = hh + 2;
        time = hh + ':' + min + ' - ' +  hEnd + ':' + min  + ' ' +  dd + '/' + mm + '/' + yyyy;
    };

    return time;
}
export function formatDate(timestamp) {
  return convertTimestamp({
    timestamp   : timestamp,
    gmt         : 7
  });
}
export function formatDateSmall(timestamp) {
  return convertTimestamp({
    timestamp   : timestamp,
    gmt         : 7,
    type        : 'small'
  });
}
export function formatDateRange(timestamp) {
  return convertTimestamp({
    timestamp   : timestamp,
    gmt         : 7,
    type        : 'range'
  });
}