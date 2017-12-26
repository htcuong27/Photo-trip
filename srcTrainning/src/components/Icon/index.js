import React, { Component } from 'react';
import config from '../../config';
import { convertStyle } from '../../utils/utils';
var decode = function(str) {
    const i = parseInt(str, 16);
    if (isNaN(i)) {
        return 0;
    }
    return i;
}
const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;
const Button = isNative === true ? require('native-base').Button : undefined;
// const Icon = require('../FontPhotoIcon');
const TouchableOpacity = isNative === true ? require('react-native').TouchableOpacity : undefined;
// const Icon = isNative === true ? require('native-base').Icon : undefined;
// import {createIconSet} from 'react-native-vector-icons';
const createIconSet = isNative === true ? require('react-native-vector-icons').createIconSet : undefined;

const glyphMap = {
  "fi-add-location": decode("e27f"),
  "fi-arrow-down": decode("e280"),
  "fi-bulb": decode("e281"),
  "fi-caretdown": decode("e282"),
  "fi-cart": decode("e283"),
  "fi-cart-empty": decode("e284"),
  "fi-checked-box": decode("e285"),
  "fi-chevron-down-1": decode("e286"),
  "fi-chevron-up-1": decode("e287"),
  "fi-circle-add": decode("e288"),
  "fi-circle-info": decode("e289"),
  "fi-exchange": decode("e28a"),
  "fi-gift": decode("e28b"),
  "fi-hand-bag": decode("e28c"),
  "fi-magnifying-glass": decode("e28d"),
  "fi-money-sale": decode("e28e"),
  "fi-single-people": decode("e28f"),
  "fi-store": decode("e290"),
  "fi-swipe-left": decode("e291"),
  "fi-unchecked-box": decode("e292"),
  "fi-1": decode("e293"),
  "fi-2": decode("e294"),
  "fi-3": decode("e295"),
  "fi-4": decode("e296"),
  "fi-5": decode("e297"),
  "fi-6": decode("e298"),
  "fi-7": decode("e299"),
  "fi-8": decode("e29a"),
  "fi-9": decode("e29b"),
  "fi-10": decode("e29c"),
  "fi-11": decode("e29d"),
  "fi-12": decode("e29e"),
  "fi-13": decode("e29f"),
  "fi-14": decode("e2a0"),
  "fi-15": decode("e2a1"),
  "fi-16": decode("e2a2"),
  "fi-b-bar-noti-dot": decode("e2a3"),
  "fi-b-bar-open-img-ls": decode("e2a4"),
  "fi-content-back": decode("e2a5"),
  "fi-content-blog": decode("e2a6"),
  "fi-content-blog-link": decode("e2a7"),
  "fi-content-blog-more": decode("e2a8"),
  "fi-content-link": decode("e2a9"),
  "fi-content-location": decode("e2aa"),
  "fi-content-no-result": decode("e2ab"),
  "fi-content-photo": decode("e2ac"),
  "fi-content-profile": decode("e2ad"),
  "fi-content-share": decode("e2ae"),
  "fi-content-time": decode("e2af"),
  "fi-content-trip-detail": decode("e2b0"),
  "fi-content-view-more": decode("e2b1"),
  "fi-content-zoome-img-move": decode("e2b2"),
  "fi-home-1": decode("e2b3"),
  "fi-home-active": decode("e2b4"),
  "fi-map-detect-location": decode("e2b5"),
  "fi-noti": decode("e2b6"),
  "fi-noti-copy": decode("e2b7"),
  "fi-post": decode("e2b8"),
  "fi-post-blog": decode("e2b9"),
  "fi-post-blog-editor-bold": decode("e2ba"),
  "fi-post-blog-editor-bullet-dot": decode("e2bb"),
  "fi-post-blog-editor-bullet-number": decode("e2bc"),
  "fi-post-blog-editor-code": decode("e2bd"),
  "fi-post-blog-editor-h3": decode("e2be"),
  "fi-post-blog-editor-h4": decode("e2bf"),
  "fi-post-blog-editor-h5": decode("e2c0"),
  "fi-post-blog-editor-italic": decode("e2c1"),
  "fi-post-blog-editor-quote": decode("e2c2"),
  "fi-post-blog-editor-under": decode("e2c3"),
  "fi-post-keyword": decode("e2c4"),
  "fi-post-link-thumb": decode("e2c5"),
  "fi-post-photo": decode("e2c6"),
  "fi-post-select": decode("e2c7"),
  "fi-post-trip": decode("e2c8"),
  "fi-post-trip-sort": decode("e2c9"),
  "fi-profile": decode("e2ca"),
  "fi-profile-3-dot": decode("e2cb"),
  "fi-profile-active": decode("e2cc"),
  "fi-profile-edit-profile-avat-cam": decode("e2cd"),
  "fi-profile-no-photo": decode("e2ce"),
  "fi-profile-setting": decode("e2cf"),
  "fi-profile-verify": decode("e2d0"),
  "fi-search-1": decode("e2d1"),
  "fi-search-active": decode("e2d2"),
  "fi-social-fav": decode("e2d3"),
  "fi-back-next-choose": decode("e2d4"),
  "fi-check-right": decode("e2d5"),
  "fi-check-wrong": decode("e2d6"),
  "fi-check-wrong-1": decode("e2d7"),
  "fi-eye-hide": decode("e2d8"),
  "fi-eye-show": decode("e2d9"),
  "fi-notice-close": decode("e2da"),
  "fi-notice-warning": decode("e2db"),
  "fi-radius": decode("e2dc"),
  "fi-radius-select": decode("e2dd"),
  "fi-reload": decode("e2de"),
  "fi-search-2": decode("e2df"),
  "fi-search-close": decode("e2e0"),
  "fi-car": decode("e2e1"),
  "fi-discussion": decode("e2e2"),
  "fi-drama": decode("e2e3"),
  "fi-mail-question": decode("e2e4"),
  "fi-media": decode("e2e5"),
  "fi-network-1": decode("e2e6"),
  "fi-star-trophy": decode("e2e7"),
  "fi-word": decode("e2e8"),
  "fi-add-people": decode("e2e9"),
  "fi-back": decode("e2ea"),
  "fi-badge-hide": decode("e2eb"),
  "fi-badge-show": decode("e2ec"),
  "fi-bin": decode("e2ed"),
  "fi-block-comment": decode("e2ee"),
  "fi-close-1": decode("e2ef"),
  "fi-comment": decode("e2f0"),
  "fi-comments": decode("e2f1"),
  "fi-edit-1": decode("e2f2"),
  "fi-emotion": decode("e2f3"),
  "fi-flag-1": decode("e2f4"),
  "fi-group": decode("e2f5"),
  "fi-large-chat": decode("e2f6"),
  "fi-like": decode("e2f7"),
  "fi-love": decode("e2f8"),
  "fi-menu": decode("e2f9"),
  "fi-mini-chat": decode("e2fa"),
  "fi-more-1": decode("e2fb"),
  "fi-nickname": decode("e2fc"),
  "fi-picture": decode("e2fd"),
  "fi-pin-star": decode("e2fe"),
  "fi-pinned-star": decode("e2ff"),
  "fi-reply-1": decode("e300"),
  "fi-seen": decode("e301"),
  "fi-send": decode("e302"),
  "fi-share-1": decode("e303"),
  "fi-small-chat": decode("e304"),
  "fi-account-image": decode("61"),
  "fi-add-remove-modify": decode("62"),
  "fi-arrow-right": decode("63"),
  "fi-banthao": decode("64"),
  "fi-bookmark": decode("65"),
  "fi-bookmark-hollow": decode("66"),
  "fi-bookmark-love": decode("67"),
  "fi-bottom-layer": decode("68"),
  "fi-camera": decode("69"),
  "fi-checkmark": decode("6a"),
  "fi-chevron-left": decode("6b"),
  "fi-chevron-right": decode("6c"),
  "fi-chiase": decode("6d"),
  "fi-chinhsua": decode("6e"),
  "fi-chungthuc": decode("6f"),
  "fi-circle-checkmark": decode("70"),
  "fi-circle-phone": decode("71"),
  "fi-clock": decode("72"),
  "fi-clock-300": decode("73"),
  "fi-clock-330": decode("74"),
  "fi-clock-700": decode("75"),
  "fi-close": decode("76"),
  "fi-dangbaiviet": decode("77"),
  "fi-diadiem": decode("78"),
  "fi-diadiem-2": decode("79"),
  "fi-dientich": decode("7a"),
  "fi-email": decode("41"),
  "fi-facebook": decode("42"),
  "fi-facebook-square": decode("43"),
  "fi-female": decode("44"),
  "fi-fire": decode("45"),
  "fi-flower": decode("46"),
  "fi-google-plus": decode("47"),
  "fi-google-plus-square": decode("48"),
  "fi-hand-down": decode("49"),
  "fi-heart": decode("4a"),
  "fi-ice-cream": decode("4b"),
  "fi-instagram": decode("4c"),
  "fi-instagram-square": decode("4d"),
  "fi-invalid": decode("4e"),
  "fi-kham-pha": decode("4f"),
  "fi-leaf": decode("50"),
  "fi-link": decode("51"),
  "fi-list": decode("52"),
  "fi-loading-1": decode("53"),
  "fi-loading-2": decode("54"),
  "fi-loading-3": decode("55"),
  "fi-mail-question-1": decode("56"),
  "fi-male": decode("57"),
  "fi-male-female": decode("58"),
  "fi-middle-layer": decode("59"),
  "fi-muiten": decode("5a"),
  "fi-one-hand-up": decode("30"),
  "fi-perfume-bottle": decode("31"),
  "fi-phongngu": decode("32"),
  "fi-phongtam": decode("33"),
  "fi-pinterest": decode("34"),
  "fi-plus": decode("35"),
  "fi-refresh": decode("36"),
  "fi-request": decode("37"),
  "fi-search": decode("38"),
  "fi-small-chevron-left": decode("39"),
  "fi-small-chevron-right": decode("21"),
  "fi-snowflake": decode("22"),
  "fi-star": decode("23"),
  "fi-sua": decode("24"),
  "fi-taikhoan": decode("25"),
  "fi-thietbi": decode("26"),
  "fi-thongbao": decode("27"),
  "fi-thumb-down": decode("28"),
  "fi-thumb-up": decode("29"),
  "fi-tien": decode("2a"),
  "fi-tivi": decode("2b"),
  "fi-top-layer": decode("2c"),
  "fi-trangchu": decode("2d"),
  "fi-triangle-danger": decode("2e"),
  "fi-twitter": decode("2f"),
  "fi-twitter-square": decode("3a"),
  "fi-two-hand-up": decode("3b"),
  "fi-valid": decode("3c"),
  "fi-verified": decode("3d"),
  "fi-verified-house": decode("3e"),
  "fi-visibility-off": decode("3f"),
  "fi-visibility-on": decode("40"),
  "fi-xoa": decode("5b"),
  "fi-youtube": decode("5d"),
}
const Icon = typeof createIconSet === 'function' ? createIconSet(glyphMap, 'photo-font-all', 'photo-font-all.ttf') : undefined;

export default class Div extends Component {
  static propTypes = {
    name: React.PropTypes.string
  }
  render() {
    if (isNative === true) {
      const style = this.props.style || {};  
      return (
          <Icon
            style={style}
            name={this.props.name}
            size={this.props.size || 14}
            color={this.props.color}
          />
      );
    }

    let dataWebProps = {};
    if (typeof this.props.style !== 'undefined') {
      dataWebProps = convertStyle(this.props.style);
    } else {
      let name = this.props.name || '';
      if (typeof name === 'object' && name.length > 1) {
        name = name[0];
        for (let index = 1; index < this.props.name.length; index++) {
          name += ' ' + this.props.name[index];
        }
      }
      dataWebProps.className = name;
    }
    return (
      <i {...dataWebProps} />
    );
  }
}
