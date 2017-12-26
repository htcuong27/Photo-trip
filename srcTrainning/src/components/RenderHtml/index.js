import React, { Component } from 'react';
import config from '../../config';
import Div from '../Div/';
import Button from '../Button/';
import { WebView, Dimensions, Linking } from 'react-native';
const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;
export class RenderHtml extends Component {
  static defaultProps = {
    isMinimal: true,
    maxHeight: 200
  }
  constructor(props) {
    super(props);
    this._timeReceive = 0;
    this._lastReceive = 0;
    this._countLastReceive = 0;
    let webViewHeight = 0;
    if (typeof props.uri !== 'undefined' && props.uri !== '') {
      webViewHeight = 0;
    }

    const maxHeight = typeof props.maxHeight !== 'undefined' ? props.maxHeight : 0;
    const isMinimal = props.isDataServer !== true && typeof props.isMinimal !== 'undefined' && props.isMinimal === true ? true : false;

    this.state = {
      webViewHeight,
      width: 0,
      errorWebview: false,
      maxHeight,
      isMinimal,
      redirectLink: false,
    }
    this.setTime = 0;
    this.loaded == true;
  }
  componentDidMount() {
    if (this.loaded !== true) {
      this.loaded == true;
      const isMinimal = this.props.isDataServer !== true && typeof this.props.isMinimal !== 'undefined' && this.props.isMinimal === true ? true : false;
      if (this.state.isMinimal !== isMinimal) {
        this.setState({
          isMinimal,
        });
      }
      const maxHeight = typeof this.props.maxHeight !== 'undefined' ? this.props.maxHeight : 200;
      if (this.state.maxHeight !== maxHeight) {
        this.setState({
          maxHeight,
        });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.isMinimal !== nextProps.isMinimal) {
      const isMinimal = typeof nextProps.isMinimal !== 'undefined' && nextProps.isMinimal === true ? true : false;
      if (this.state.isMinimal !== isMinimal) {
        this.setState({
          isMinimal,
        });
      }
    }
    if (this.props.maxHeight !== nextProps.maxHeight) {
      const maxHeight = typeof nextProps.maxHeight !== 'undefined' ? nextProps.maxHeight : 200;
      if (this.state.maxHeight !== maxHeight) {
        this.setState({
          maxHeight,
        });
      }
    }
  }
  _updateWebViewHeight = (navState) => {
    if (typeof navState === 'undefined') {
      return false;
    }
    if (navState.title.indexOf('height|') === -1) {
      const url = navState.url;
      if (url.substr(0, 4) === 'http' && url.indexOf('://') > -1) {
        this._timeReceive = 0;
        this.setState({ redirectLink: true })
        setTimeout(() => {
          this._timeReceive = 0;
          Linking.openURL(url).catch(err => console.error('An error occurred', err));
          
          setTimeout(() => {
            this._timeReceive = 0;
            this.setState({redirectLink: false});
          }, 800);
        }, 800);
        return true;
      }
      this._timeReceive = 0;
      return true;
    }
    const title = navState.title.replace('height|', '').replace('px', '');
    const height = parseInt(title);
    if (isNaN(height) || height < 1 || height === this.state.webViewHeight) {
      return true;
    }
    clearTimeout(this.setTime);
    this.setTime = setTimeout(() => {
      this.setState({webViewHeight: height});
    }, 300);
  }
  /*shouldComponentUpdate(nextProps, nextState) {
    if (this.state.width === nextState.width && this.state.webViewHeight !== nextState.webViewHeight || ) {
      return false;
    }
    return true;
  }*/
  _handleError = () => {
    if (typeof this.webview !== 'undefined' && this.webview !== null) {
      this.webview.stopLoading();
    }
    this.setState({ errorWebview: true })
    if (typeof this.props.uri !== 'undefined' && this.props.uri !== '') {
      Linking.openURL(this.props.uri).catch(err => console.error('An error occurred', err));
    }
    this.forceUpdate();
  }
  _detectActive = () => {
    if (this.state.errorWebview) {
      return;
    }
    if (this._timeReceive > 10) {

      const currentTime =  new Date().getTime();
      if (currentTime - this._timeReceive > 5000) {
        this._handleError();
        return;
      }
    } else {
      if (this.state.webViewHeight !== 0) {
        this.setState({webViewHeight: 0});
      }
      this._timeReceive += 1;
      if (this._timeReceive > 10) {
        this._handleError();
        return; 
      }
    }
    setTimeout(() => {
      this._detectActive();
    }, 3000)
  }
  componentWillUnMount() {
    this.setState({ errorWebview: true });
  }
  render() {
    const style = this.props.style || {};
    const source = {
      type: '',
      content: '',
    };
    if (typeof this.props.htmlContent === 'string' && this.props.htmlContent !== '') {
      source.type = 'html';
      source.content = this.props.htmlContent;
    } else if (typeof this.props.uri === 'string' && this.props.uri !== '') {
      source.type = 'uri';
      source.content = this.props.uri;
    }
    if (source.type === '') {
      return (<Div style={style}></Div>);
    }
    if (isNative === true) {

      let width = style.width;
      if (typeof width === 'undefined' && this.state.width > 1) {
        width = this.state.width;
      }
      if (typeof width === 'undefined') {
        width = Math.floor(Dimensions.get('window').width - 20);
      }
      const sourceWebView = {}
      if (source.type === 'html') {
        
        const styleHTML = `<style>* { font-size: 14px; margin: 0;padding: 0; } img { max-width: 100%; height: auto; }
        ul, ol { 
          list-style-type: disc; 
          list-style-position: inside; 
          list-style: initial;
          margin: 0;
          padding: 0 0 0 20px;
        }
        ol { 
           list-style-type: decimal; 
           list-style-position: inside; 
        }
        li {
            display: list-item;
        }
        span {
          color: rgba(0, 0, 0, 0.6);
        }
        </style>`;
        sourceWebView.html = '<!DOCTYPE html><html><head><title></title>' + styleHTML + '</head><body>' + source.content + '</body></html>';
      } else {
        sourceWebView.uri = source.content;
      }
      const injectedJavaScript = `
      if (typeof window.timeInterValSend === "undefined") {
        window.timeInterValSend = 1;
        var handle = function(type, data) {
            window.postMessage(JSON.stringify({
                type: type,
                content: data
            }))
        };
        var arrAction = ['alert', 'confirm', 'prompt'];
        for (var i = 0; i < arrAction.length; i++) {
          window['_' + arrAction[i]] = window[arrAction[i]];
          window[arrAction[i]] = function(...args) {
            var arr = [];
            for (var i = 0; i < args.length; i++) {
              arr.push(args[i]);
            }
            handle(arrAction[i], arr);
            window['_' + arrAction[i]](...args);
          }
        }
        setInterval(function() {
          window.postMessage("ok_fi")
        }, 3000);
        var i = 0;

        function updateHeight() {
            var body = document.body,
                html = document.documentElement;
            var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            document.title = "height|" + height;
            window.location.hash = ++i
        };
        updateHeight();
        window.addEventListener("load", function() {
            updateHeight();
            setTimeout(updateHeight, 200)
        });
        window.addEventListener("resize", updateHeight)
      }
      `;
      const isShowScrollView = (this.state.isMinimal && this.state.maxHeight < this.state.webViewHeight);
      const subStyle = {width, height: isShowScrollView ? this.state.maxHeight : this.state.webViewHeight};
      const subStyleWebview = {width, height: this.state.webViewHeight};
      return (
        <Div
          style={style}
        >
          <Div
            onLayout={(event) => {
              if (this.state.width !== 0) {
                return;
              }
              
              const { height, width } = event.nativeEvent.layout;
              this.setState({ height, width });
              this._detectActive();
              this._timeReceive = 0;
            }}
            style={subStyle}
          >
            {this.state.redirectLink && <Div style={style}><Div isText>Redirect...</Div></Div>}
            {!this.state.redirectLink && !this.state.errorWebview && <WebView
              ref={webview => { this.webview = webview; }}
              source={sourceWebView}
              scrollEnabled={false}
              injectedJavaScript={injectedJavaScript}
              onNavigationStateChange={this._updateWebViewHeight}
              javaScriptEnabled={true}
              automaticallyAdjustContentInsets={true}
              scalesPageToFit={true}
              onMessage={(e) => {
                const { data } = e.nativeEvent;
                const time = new Date().getTime();
                let dataJSON;
                if (data.indexOf('type') > -1) {
                  try {
                    dataJSON = JSON.parse(data);
                  } catch (e) {
                    return;
                  }
                  // trong vaong 5 giay, co loi thi cong bien _countLastReceive them 1
                  if (time - this._lastReceive < 5000) {
                    this._countLastReceive += 1;
                    if (this._countLastReceive > 5) {
                      this._handleError();
                    }
                  }
                  this._lastReceive = time;
                }
                if (e.nativeEvent.data !== 'ok_fi') {
                  return;
                }
                this._timeReceive = time;
              }}
              // source={{uri: 'https://github.com/facebook/react-native'}}
              style={subStyleWebview}
            /> || <Div isText>Error</Div>}
          </Div>
          {this.state.maxHeight < this.state.webViewHeight && <Div>
            <Button
              onClick={() => {
                this.setState({ isMinimal: !this.state.isMinimal })
              }}
              block
              style={{alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'}}
            >
              {this.state.isMinimal && <Div isText>Xem thêm</Div> || <Div isText>Thu nhỏ</Div>}
            </Button>
          </Div>}
        </Div>
      );
    }
    const isShowScrollView = (this.state.isMinimal && this.state.maxHeight < this.state.webViewHeight);
    const subStyle = {overflow: 'hidden', height: isShowScrollView ? this.state.maxHeight : 'auto'};
    return (
      <Div
        style={style}
      >
        <Div
          onLayout={(event) => {
            this.setState({
              webViewHeight: event.nativeEvent.layout.height * 1,
            });
          }}
          style={subStyle}
        >
          {source.type === 'html' && <section
            dangerouslySetInnerHTML={{ __html: source.content.replace(/\\/g, '') }}
          />}
        </Div>
        {this.state.maxHeight < this.state.webViewHeight && <Div>
          <Button
            onClick={() => {
              this.setState({ isMinimal: !this.state.isMinimal })
            }}
            block
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              margin: 'auto', display: 'flex',
              paddingTop: 10,
              border: 0,
            }}
          >
            {this.state.isMinimal && <Div isText>Xem thêm</Div> || <Div isText>Thu nhỏ</Div>}
          </Button>
        </Div>}
      </Div>
    );
  }
}
export default RenderHtml;
