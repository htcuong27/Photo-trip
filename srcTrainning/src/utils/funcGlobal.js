import { map } from './object';
export function listType() {
  const choice = [
    'Auth',
    'Search',
    'Carts',
    'PostPage',
    'Order',
    'Home',
    'Category',
    'Product'
  ];
  return choice;
}
export function checkType(type) {
  let isExists = false;
  map(listType(), val => {
    if (type === val || type === val.toLowerCase()) {
      isExists = true;
      return false;
    }
  });
  return isExists;
}
export function getType(path) {
  let type = '';
      /*
        // giải quyết các loại link
        trang chủ: /
        bài viết:
              /{cat}/{article-name}-{article-key}.html
              /{cat}/{article-name}.html
              /{vendor}/{article-name}-{article-key}.html
              /{article-name}-{article-key}.html
        tường thành viên
              /@{username}
        hệ thống
              /{choice, exists underscore _}.html
        đề tài:
            .htm


      Nếu ko tồn tại .html trong tên tập tin thì thuộc các dạng:
        trang chủ
        đề tài
        tưởng thành viên

        - nếu ko tồn tại @ thì là trang chủ | đề tài, nếu ko phải là / thì là đề tài

      Ngược lại, nếu kết thúc là .htm, thì là đề tài
      Ngược lại, nếu tồn tại trong hệ thống
      Ngược lại, là bài viết
      */

      const uri = {};
      let tmpInt = 0;
      uri.path = path;
      uri.file = '';
      uri.ext = '';
      if (typeof uri !== 'undefined' && typeof uri.path !== 'undefined') {
        tmpInt = uri.path.lastIndexOf('/');
      }
      if (tmpInt > -1) {
        if (typeof uri !== 'undefined' && typeof uri.path !== 'undefined') {
          uri.file = uri.path.substr(tmpInt + 1);
        }
        tmpInt = uri.file.lastIndexOf('.');

        if (tmpInt > -1) {
          if (typeof uri !== 'undefined' && typeof uri.path !== 'undefined') {
            uri.ext = uri.file.substr(tmpInt + 1);
          }
        }
      }
      if (uri.ext !== 'html' && uri.ext !== 'htm') {
        // @user
        if (typeof uri !== 'undefined' && typeof uri.path !== 'undefined' && uri.path.substring(0, 2) === '/@') {
          type = 'Profile';
        } else if (uri.path === '/') {
          type = 'Home';
        } else if (uri.ext === '') {
          let choice = ['Auth', 'Search', 'Carts', 'PostPage', 'Order', 'Department', 'Member', 'Groups', 'MemberGroups', 'Task','Account'];
          // let choice = ['Home', 'Category', 'Product',
          // 'so_sanh_san_pham', 'dang_nhap', 'dang_xuat', 'doi_mat_khau', 'quen_mat_khau',
          // 'bao_loi', 'tim_kiem', 'search', 'san_pham_ban_chay', 'san_pham_xem_nhieu',
          // 'shop_chi_tiet', 'shop_thanh_toan', 'shop_order', 'tags', 'dang_ky', 'doi_thong_tin',
          // 'trang_ca_nhan', 'trang_cam_xuc', 'thanh_vien', 'build'];
          let tmp;
          let tmpsplit;
          if (typeof uri !== 'undefined' && typeof uri.path !== 'undefined') {
            tmp = uri.path.substring(1);
            tmpsplit = uri.path.substring(1).split('/'); // ["nhom", "chu-dau-tu", ""]
          }
          if (typeof tmpsplit !== 'undefined' && tmpsplit[0] === 'nhom') {
            type = 'Nhom';
          } else {
            if (choice.indexOf(tmp) < 0) type = 'Category';
            else {
              type = tmp;
            }
            if (typeof tmpsplit !== 'undefined' && choice.indexOf(tmpsplit[0]) < 0) type = 'Category';  // tu viet 3 cau
            else if (typeof tmpsplit !== 'undefined') {
              type = tmpsplit[0];
            }
          }
          choice = null;
        }
      } else if (uri.ext === 'htm') {
        let choice = ['Auth', 'Search', 'Carts', 'PostPage'];
        // const tmp = uri.path.substring(1);
        const tmpsplit = uri.path.substring(1).split('/');
        if (choice.indexOf(tmpsplit[0]) < 0) {
          type = 'Category';
        } else {
          type = tmpsplit[0];
        }
        choice = null;
      }
      if (uri.ext === 'html' && type === '') {
        type = 'Product';
      }
      return type;
}
