import React, { Component, PropTypes } from 'react';
import config from '../../config';
import { countLoad, load } from '../../redux/modules/Download';
import { connect } from 'react-redux';
import { convertStyle } from '../../utils/utils';

const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;
const Image = isNative === true ? require('react-native').Image : undefined;

class ImageView extends Component {
  static propTypes = {
    imageDefault: PropTypes.bool,
    src: PropTypes.string,
    style: PropTypes.object,
    resizeMode: PropTypes.string,
    alt: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this._source = undefined;
    const status = 1;// (isNative === true ? 0 : 1);
    const src = this._formatURL(props.src);
    this._downloadURL(src);
    this.state = {
      status,
      src,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src && nextProps.src !== '') {
      this._source = undefined;
      const src = this._formatURL(nextProps.src);
      this._downloadURL(src);
      this.setState({
        status: 1, // (isNative === true ? 0 : 1),
        src,
      });
      this.countDownload = 0;
    }
  }
  _downloadURL = (url) => {
    if (isNative !== true || typeof this._source !== 'undefined') {
      this._source = url;
      return;
    }
    this._source = url;
    return;

    if(typeof url === 'undefined') {
      url = this.state.src;
    }
    this.props.dispatch(load({
      uri: url,
      type: 'blob',
      expire: 30 * 24 * 3600,
      limit: 20,
    })).then(result => {
      this._processData(result);
    });
  }
  _processData = (result) => {
    if (result.status === 'waiting') {
      const timeRandom = this._random(1000, 3000);
      // console.log('waiting:' + result.data + ':' + '-' + timeRandom + this.state.src);
      if (this.countDownload > 10) {
        console.log('fail download Image', this.state.src);
        return;
      }
      setTimeout(() => {
        // console.log('start', this.state.src);
        this.countDownload += 1;
        this._downloadURL();
      }, timeRandom);
      return;
    }
    // console.log('loade', this.state.src);
    this._source = 'data:' + result.type + ';base64,' + result.content;
    this.setState({
      status: 1
    });
  }
  _random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  _formatURL = (url) => {
    let src = url;
    if (typeof src === 'string' && src.indexOf('://') < 0) {
      src = 'http:' + src;
    }
    return src;
  }
  render() {
    if (isNative === true) {
      if (this.state.status === 0) {
        return <Image
              style={style}
              resizeMode={Image.resizeMode.cover}
            />
      }
      const style = this.props.style || {};
      if (this.props.imageDefault === true) {
        return (
          <Image
            style={style}
            source={{uri: this._source}}
            resizeMode={Image.resizeMode.cover}
          />
        );
      }
      // console.log('.......................', this.state.src);
      return (
        <Image
          style={style}
          source={{
            uri: this._source,
          }}
          resizeMode={this.props.resizeMode ? Image.resizeMode[this.props.resizeMode] : undefined}
        />
      );
    }
    const dataWebProps = convertStyle(this.props.style);
    return (
      <img
        {...dataWebProps}
        src={this.state.src}
        alt={this.props.alt}
      />
    );
  }
}
export default connect(
  (state) => {
    return {
    };
  },
  (dispatch) => {
    return { dispatch };
  }
)(ImageView)
