import React, { Component, PropTypes } from 'react';
import config from '../../config';
import { convertStyle } from '../../utils/utils';
// import CachedImage from 'react-native-cached-image';

const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;
const Image = isNative === true ? require('react-native').Image : undefined;
/*const {
    ImageCacheProvider
} = CachedImage;
const cachedImageOptions = {
    cacheLocation: ImageCacheProvider.LOCATION.BUNDLE
};*/

export default class ImageView extends Component {
  static propTypes = {
    imageDefault: PropTypes.bool,
    src: PropTypes.string,
    style: PropTypes.object,
    resizeMode: PropTypes.string,
    alt: PropTypes.string,
  };
  render() {
    if (isNative === true) {
      let src = this.props.src;
      if (typeof src === 'string') {
        if (src.indexOf('://') < 0) {
          src = 'http:' + src;
        }
        src = {
          uri: src,
          // cache: 'reload', // 0.4.3 run
        }
      }
      const style = this.props.style || {};
      /*return (
        <CachedImage
          style={style}
          source={src}
          {...cachedImageOptions}
        />
      )*/
      return (
        <Image
          style={style}
          source={src}
          resizeMode={this.props.resizeMode ? Image.resizeMode[this.props.resizeMode] : undefined}
        />
      );
    }
    const dataWebProps = convertStyle(this.props.style);
    return (
      <img
        {...dataWebProps}
        src={this.props.src}
        alt={this.props.alt}
      />
    );
  }
}
