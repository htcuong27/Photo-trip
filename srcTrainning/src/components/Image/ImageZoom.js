import React, {Component, PropTypes} from 'react';
import { Text, View, PanResponder, ScrollView } from 'react-native';
import Div from '../Div/';
import Span from '../Span/';
import Button from '../Button/';
import Image from '../Image/';
import Icon from '../Icon/';
import Swipe from '../Swipe/';
import { connect } from 'react-redux';

import { load } from '../../redux/modules/Download';

import { canUseDOM } from 'exenv';
import styles from './LeafletImageViewer.scss';

const reactLeaflet = canUseDOM ? require('react-leaflet') : { Map: Div, TileLayer: Div };
const { Map, TileLayer } = reactLeaflet;
const Leaflet = canUseDOM ? require('leaflet') : undefined;

import config from '../../config';

import { map, hasKey, each, range } from '../../utils/object';
const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;
// const Swiper = isNative ? require('react-native-swiper') : canUseDOM ? Div : Div;

function calcDistance(x1, y1, x2, y2) {
    let dx = Math.abs(x1 - x2)
    let dy = Math.abs(y1 - y2)
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

function calcCenter(x1, y1, x2, y2) {

    function middle(p1, p2) {
        return p1 > p2 ? p1 - (p1 - p2) / 2 : p2 - (p2 - p1) / 2;
    }

    return {
        x: middle(x1, x2),
        y: middle(y1, y2),
    };
}

function maxOffset(offset, windowDimension, imageDimension) {
    let max = windowDimension - imageDimension;
    if (max >= 0) {
        return 0;
    }
    return offset < max ? max : offset;
}

function calcOffsetByZoom(width, height, imageWidth, imageHeight, zoom) {
    let xDiff = imageWidth * zoom - width;
    let yDiff = imageHeight * zoom - height;
    return {
        left: -xDiff/2,
        top: -yDiff/2,
    }
}

class ZoomableImage extends Component {
  static propTypes = {
    imagesSrc: PropTypes.array,
    thumbnailsSrc: PropTypes.array,
    smallImage: PropTypes.bool
  }

  constructor(props) {
    super(props);
      
    this._panResponder = {};
    this.url = '';
    this.objRow = [];

    let zoom = this.props.zoom || 2;
    const maxZoom = this.props.maxZoom || zoom;
    const minZoom = this.props.minZoom || zoom;
    if (zoom > maxZoom) {
      zoom = maxZoom
    } else if (zoom < minZoom) {
      zoom = minZoom
    }
    const lastX = 256 * zoom;
    const lastY = 256 * zoom;

    this.state = {
        activeImage: '',
        activeIndex: -1,
        minZoom: 0,
        maxZoom: 0,
        scale: false,
        layoutKnown: false,
        isZooming: false,
        isMoving: false,
        initialDistance: null,
        initialZoom: zoom,
        maxZoom,
        minZoom,
        initialX: null,
        initalY: null,
        offsetTop: 0,
        offsetLeft: -1,
        initialTop: 0,
        initialLeft: 0,
        initialTopWithoutZoom: 0,
        initialLeftWithoutZoom: 0,
        top: 0,
        left: 0,
        fr: {
            x: 0,
            y: 0,
        },
        to: {
            x: lastX,
            y: lastY,
        },
        width: lastX,
        height: lastY,
        zoom,
        status: 0,
        currentSwipper: 0,
    }
    this.imageWidth = zoom * 256;
    this.imageHeight = zoom * 256;

    const isStatic = typeof props.onShowLargeImage !== 'undefined' ? true : false;
    this.isStatic = isStatic;

    if (isStatic) {
      this.createObj(zoom, '');
    } else {
      this.getUrl(0);
    }
    this.messageStatus = {
      201: 'Đang tải dữ liệu',
      101: 'Không thể tải dữ liệu',
      102: 'Không thể giải nén dữ liệu',
      103: 'Dữ liệu trả về sai cấu trúc',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.imagesSrc === 'undefined') {
      return;
    }
    if (nextProps.imagesSrc !== this.props.imagesSrc) {
      if (this.isStatic) {
        this.createObj(this.state.zoom, '');
      } else {
        this.getUrl(0);
      }
    }
  }

  getUrl = (ind) => {
    if (typeof this.props.imagesSrc === 'undefined') {
      return;
    }
    if (typeof this.props.imagesSrc === 'object' && typeof this.props.imagesSrc.minZoom !== 'undefined') {
      const activeImage = this.props.imagesSrc.src;
      this.createObj(this.state.initialZoom, activeImage);
      setTimeout(() => {
        this.setState({
          minZoom: this.props.imagesSrc.minZoom,
          maxZoom: this.props.imagesSrc.maxZoom,
          activeImage: activeImage,
          activeIndex: 0,
        });
      }, 200);
      return;
    }

    const { host, query, name, ext} = this.convertURL(ind);
    this.getInfo(host, query, name, ind, ext);
  }
  convertURL = (ind) => {
    const imgSrc = this.props.imagesSrc[ind];
    if (typeof imgSrc === 'undefined') {
      return false;
    }
    let path;
    const [, host, pathTmp, name] = imgSrc.match(/^(.+?[^\/])(\/[^\/].+)?\/([^\/]+)\/?$/);
    if (typeof pathTmp === 'undefined') {
      path = '';
    } else {
      path = pathTmp;
    }
    const ext = name.match(/\.(\w+)$/)[1];
    let query = '';
    if (host === 'https://vipn.net' || host === 'http://vipn.net' || host === 'vipn.net') {
      const posFirst = path.indexOf('/', 1);
      const posAfter = path.indexOf('/', posFirst);
      query = (path.substr(0, posAfter) + '/' + path.substr(posAfter + 1) + '/zoom');
    } else {
      query = path + '/zoom';
    }
    return {host, query, name, ext};
  }
  getInfo = (host, query, name, ind, ext, repeat = 0) => {
    let hostInfo = host;
    if (hostInfo === 'https://img.umbala.vn' || 1==1) {
      hostInfo = 'https://vipn.net/um';
    }
    if (repeat > 2) {
      // alert('Can not load info');
      this.setState({
        status: 102,
        activeImage: host + '/notfound.jpg',
        activeIndex: -1
      });
      return false;
    }

    this.setState({ status: 201 });
    this.props.dispatch(load({
      uri: hostInfo + query + '/' + name + '/info.txt?defaultZoom=' + (this.props.smallImage ? 1 : 2),
      timeout: 3000,
      expire: 30 * 24 * 3600,
    })).then(data => {
      if (typeof data === 'object' && typeof data.status === 'string' && data.status === 'error') {
        this.setState({ status: 101 });
        /*setTimeout(() => {
          this.getInfo(host, query, name, ind, ext, repeat + 1);
        }, 800);*/
        return;
      }
      if (!data.zoom) {
        this.setState({ status: 103 });
        return;
      }
      if (typeof this.refMap !== 'undefined' && this.refMap !== null) {
        const {state } = this.refMap;
        if (typeof state !== 'undefined' && state !== null) {
          this.refMap.state.map.options.maxZoom = data.zoom.max;
          this.refMap.state.map.options.minZoom = data.zoom.min;
        }
      }

      const output = {
        status: 2,
        activeIndex: ind,
        activeImage: host + query + '/' + name + '/{z}/{x}_{y}.' + ext
      };
      if (data.zoom.min && data.zoom.max) {
        if (data.zoom.min !== this.state.minZoom) {
          output.minZoom = data.zoom.min;
        }
        if (data.zoom.max !== this.state.maxZoom) {
          output.maxZoom = data.zoom.max;
        }
      }
      this.createObj(this.state.initialZoom, output.activeImage);
      this.setState(output);
    });
  }

  selectImage = (ind) => {
    // loading
    this.setState({
      activeImage: '',
      activeIndex: -1
    });
    clearTimeout(this.timeoutSelect);
    this.timeoutSelect = setTimeout(() => {
      this.getUrl(ind);
    }, 300)
  }

  processPinch(x1, y1, x2, y2) {
      let distance = calcDistance(x1, y1, x2, y2);
      let center = calcCenter(x1, y1, x2, y2);

      if (!this.state.isZooming) {
          let offsetByZoom = calcOffsetByZoom(this.state.width, this.state.height,
                          this.imageWidth, this.imageHeight, this.state.zoom);
          this.setState({
              isZooming: true,
              initialDistance: distance,
              initialX: center.x,
              initialY: center.y,
              initialTop: this.state.top,
              initialLeft: this.state.left,
              initialZoom: this.state.zoom,
              initialTopWithoutZoom: this.state.top - offsetByZoom.top,
              initialLeftWithoutZoom: this.state.left - offsetByZoom.left,
          });

      } else {
          let touchZoom = distance / this.state.initialDistance;
          let zoom = Math.ceil(touchZoom * this.state.initialZoom > this.state.minZoom
              ? touchZoom * this.state.initialZoom : this.state.minZoom);

          if (zoom > this.state.maxZoom) {
            zoom = this.state.maxZoom
          } else if (zoom < this.state.minZoom) {
            zoom = this.state.minZoom
          }

          let offsetByZoom = calcOffsetByZoom(this.state.width, this.state.height,
              this.imageWidth, this.imageHeight, zoom);
          let left = (this.state.initialLeftWithoutZoom * touchZoom) + offsetByZoom.left;
          let top = (this.state.initialTopWithoutZoom * touchZoom) + offsetByZoom.top;

          const lastX = 256 * zoom;
          const lastY = 256 * zoom;
          this.createObj(zoom);
          this.setState({
            fr: {
                x: 0,
                y: 0,
            },
            to: {
                x: lastX,
                y: lastY,
            },
            zoom: zoom,
            width: lastX,
            height: lastY,
            left: left > 0 ? 0 : maxOffset(left, this.state.width, this.imageWidth * zoom),
            top: top > 0 ? 0 : maxOffset(top, this.state.height, this.imageHeight * zoom),
          });
      }
  }

  processTouch(x, y) {
      if (!this.state.isMoving) {
          this.setState({
              isMoving: true,
              initialX: x,
              initialY: y,
              initialTop: this.state.top,
              initialLeft: this.state.left,
          });
      } else {
          let left = this.state.initialLeft + x - this.state.initialX;
          let top = this.state.initialTop + y - this.state.initialY;

          this.setState({
              left: left > 0 ? 0 : maxOffset(left, this.state.width, this.imageWidth * this.state.zoom),
              top: top > 0 ? 0 : maxOffset(top, this.state.height, this.imageHeight * this.state.zoom),
          });
      }
  }

  componentWillMount() {

    const dataProps = {};
    const dataViewProps = {};
    if (this.props.isNative && this.isStatic !== true) {
      this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
          onMoveShouldSetPanResponder: (evt, gestureState) => true,
          onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
          onPanResponderGrant: (evt, gestureState) => {},
          onPanResponderMove: (evt, gestureState) => {
              let touches = evt.nativeEvent.touches;
              if (touches.length == 2) {
                  let touch1 = touches[0];
                  let touch2 = touches[1];

                  this.processPinch(touches[0].pageX, touches[0].pageY,
                      touches[1].pageX, touches[1].pageY);
              } else if (touches.length == 1 && !this.state.isZooming) {
                  this.processTouch(touches[0].pageX, touches[0].pageY);
              }
          },

          onPanResponderTerminationRequest: (evt, gestureState) => true,
          onPanResponderRelease: (evt, gestureState) => {
              this.setState({
                  isZooming: false,
                  isMoving: false
              });
          },
          onPanResponderTerminate: (evt, gestureState) => {},
          onShouldBlockNativeResponder: (evt, gestureState) => true,
      });
    }
  }
  createRow = (zoom, uri) => {
    const width = Math.pow(2, zoom - 1);
      
    const objRow = [];
    
    if (typeof uri ==='string' && uri !== '') {
        const source = uri.replace('{z}', zoom);
        range(width, 0, row => {
          const objCol = [];
          const linkRow = source.replace('{y}', row);
          range(width, 0, col => {
            const linkCol = linkRow.replace('{x}', col);
            objCol.push(<Div style={{flex: 1, width: 256}}><Image style={styles.ImageContent} src={linkCol} /></Div>)
          });
          objRow.push(<Div style={styles.ViewImagePush}>{objCol}</Div>)
        })
    } else {
        range(width, 0, row => {
          const objCol = [];
          range(width, 0, col => {
            objCol.push(<Div style={{flex: 1, width: 256}}><Div isText>{col}|{row}</Div></Div>)
          });
          objRow.push(<Div style={styles.ViewImagePush}>{objCol}</Div>)
        });
    }
    return objRow;
  }
  createObj = (zoom, uri) => {
    if (this.isStatic === true) {
      const imgSrc = this.props.imagesSrc;
      const objRow = [];
      each(imgSrc, (v, row) => {
        const { host, query, name, ext} = this.convertURL(row);
        const url = (host + query + '/' + name + '/{z}/{x}_{y}.' + ext);
        objRow.push(<Div style={{flex: 1, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
          <Div
            style={{width: this.state.width, height: this.state.height}}
          >
            <Div style={{flex: 1}}>{this.createRow(zoom, url)}</Div>
          </Div>
        </Div>);
      })
      this.objRow = objRow;
    } else {
      if (!this.props.isNative) {
        return;
      }
      if (typeof uri === 'undefined') {
        uri = this.state.activeImage;
      }
      const objRow = this.createRow(zoom, uri);

      if (this.url === uri && objRow.length === this.objRow.length) {
        return;
      }

      this.url = uri;
      this.objRow = objRow;
    }
  }
  _onLayout = (event) => {
    if(this.isStatic) {
      return;
    }
    const layout = event.nativeEvent.layout;
    cancelAnimationFrame(this._tohandleLoadNext)
    this._tohandleLoadNext = requestAnimationFrame(() => {
      if (this.state.offsetTop !== -1 && layout.width === this.state.width
        && layout.height === this.state.height) {
        return;
      }
      const zoom = this.state.zoom;
      const state = {};
      const offsetLeft = layout.width > this.imageWidth * zoom ?
          (layout.width - this.imageWidth * zoom) / 2
          : 0;
      if (offsetLeft !== this.state.offsetLeft) {
        state.offsetLeft = offsetLeft;
      }
      if (zoom > 1) {
        const offsetTop = layout.height > this.imageHeight * zoom ?
            (layout.height - this.imageHeight * zoom) / 2
            : 0;
        if (offsetTop !== this.state.offsetTop) {
          state.offsetTop = offsetTop;
        }
      }

      if (hasKey(state)) {
        this.setState(state);
      }
    });
  }
  setZoom = (val) => {
    let zoom = 1;
    if (val === false) {
      zoom = -1;
    }
    zoom += this.state.zoom;
    if (zoom > this.state.maxZoom) {
      zoom = this.state.maxZoom
    } else if (zoom < this.state.minZoom) {
      zoom = this.state.minZoom
    }
    this.createObj(zoom);
    const lastX = 256 * zoom;
    const lastY = 256 * zoom;

    this.setState({
      to: {
          x: lastX,
          y: lastY,
      },
      width: lastX,
      height: lastY,
      offsetTop: 0,
      zoom
    });
  }

  render() {
    if (!this.props.isNative && !canUseDOM) {
      return <Div />;
    }
    const propBtnIncrease = {};
    const propBtnDecrease = {};
    if (this.state.zoom === this.state.maxZoom) {
      propBtnIncrease.disabled = true;
    }
    if (this.state.zoom === this.state.minZoom) {
      propBtnDecrease.disabled = true;
    }
    const showZoom = this.state.activeIndex > -1 && this.state.activeImage !== '';
    const isStatic = this.isStatic;
    const position = [0, 0];
    return (
      <Div
        style={[styles.styleFlex1, {flexDirection: 'column'}]}
        onLayout={this._onLayout}
      >
        {this.state.status > 100 && <Div style={styles.styles1}><Div isText>{this.messageStatus[this.state.status]}</Div></Div>}
        {this.state.status < 100 && <Div style={styles.styleFlex1}>
          <Div
            style={styles.styles3}
            {...this._panResponder.panHandlers}
          >
            {isStatic === true ? 
              <Div style={styles.styles1}>
                <Swipe
                  width={true}
                  index={this.state.currentSwipper}
                  onChangeIndex={index => {
                    if (this.state.currentSwipper !== index) {
                      this.setState({currentSwipper: index});
                    }
                  }}
                  style={styles.styleFlex2}>
                  {this.objRow}
                </Swipe>
                <Button
                  style={{
                    position: 'absolute',
                    right: 50,
                    top: 20,
                    width: 30,
                    height: 30,
                  }}
                  onClick={() => {
                    const i = this.state.currentSwipper;
                    const obj = {
                      src: [this.props.imagesSrc[i]]
                    };
                    this.props.onShowLargeImage(obj);
                  }}
                >
                  <Span style={{flex: 1, color: (propBtnIncrease.disabled === true ? '#CCC' : '#000')}}>
                    <Icon size={20} color='#333' name='fi-content-zoome-img-move' />
                  </Span>
                </Button>
              </Div>:
              this.props.isNative === true ? 
                <Div style={styles.styles1}>
                  {this.state.offsetLeft > -1 &&
                    <Div style={{
                      position: 'absolute',
                      top: this.state.offsetTop + this.state.top,
                      left: this.state.offsetLeft + this.state.left,
                      width: this.state.width, height: this.state.height
                    }}>
                    {this.objRow}
                    </Div>
                    ||
                    <Div isText>Loading layout</Div>
                  }
                  </Div> :
              <Div style={styles.show}>
                {showZoom && <Map
                  className={styles.leaflet}
                  ref={ele => this.refMap = ele}
                  center={position}
                  zoom={this.props.smallImage ? 1 : 2}
                  minZoom={this.state.minZoom}
                  maxZoom={this.state.maxZoom}
                  scrollWheelZoom={false}
                  maxBounds={Leaflet.latLngBounds( // eslint-disable-line
                    Leaflet.CRS.EPSG3857.pointToLatLng(Leaflet.point([0, this.props.smallImage ? 300 : 172]), 1),
                    Leaflet.CRS.EPSG3857.pointToLatLng(Leaflet.point([this.props.smallImage ? 300 : 172, 0]), 1),
                  )}
                >
                  <TileLayer
                    url={this.state.activeImage}
                    tileSize={this.props.smallImage ? 300 : 172}
                    noWrap
                  />
                </Map>}
              </Div>
            }
          </Div>
          {isStatic !== true && this.props.isNative === true && <Div style={styles.btnZoomMobile}>
            <Button
              style={styles.btnLagre}
              onClick={() => {this.setZoom(true)}}
              {...propBtnIncrease}
            >
              <Span style={{flex: 1, color: (propBtnIncrease.disabled === true ? '#CCC' : '#000')}}>+</Span>
            </Button>
            <Button
              style={styles.btnLagre}
              onClick={() => {this.setZoom(false)}}
              {...propBtnDecrease}
            >
              <Span style={{flex: 1, color: (propBtnDecrease.disabled === true ? '#CCC' : '#000')}}>-</Span>
            </Button>
          </Div>}
        </Div>}
        {typeof this.props.thumbnailsSrc !== 'undefined' &&  <Div style={{marginTop: 5, marginBottom: 5, height: 60 }}>
          <Swipe
            width={true}
            style={styles.thumbAppMobile}
          >
          {each(this.props.thumbnailsSrc, (thumb, i) => {
            return (
              <Div
                onClick={() => {
                  const obj = {
                    src: [this.props.imagesSrc[i]]
                  };
                  this.props.onShowLargeImage(obj);
                  if (this.state.currentSwipper === i) {
                    return;
                  }
                  this.setState({ currentSwipper: i });
                }}
                style={styles.btnThumnb}
              >
                <Image src={thumb}
                  style={styles.imgThumnb} />
              </Div>
            )
          })}
          </Swipe>
        </Div>}
      </Div>
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
)(ZoomableImage)
