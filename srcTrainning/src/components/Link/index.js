import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import config from '../../config';
import { addDataProduct } from '../../redux/modules/Product';
import Div from '../Div/';
import { convertStyle } from '../../utils/utils';
import { abortAll } from '../../redux/modules/Download';
const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;
const Link = require('react-router').Link || undefined;

import { TouchableWithoutFeedback, View, Linking, Platform } from 'react-native';

import { hasKey } from '../../utils/object';

class LinkDiv extends Component {
  routerLink = (data) => {
    this.props.dispatch(abortAll()).then(result => {
      if (data && typeof data.timeout !== 'undefined' && data.timeout > 100 && data.timeout < 5000) {
        setTimeout(() => {
          delete data.timeout;
          this._routerLinkCB(data)
        }, data.timeout);
        return;
      }
      this._routerLinkCB(data)
    })
  }
  _routerLinkCB = (iData) => {
    const data = (
      iData &&
      iData.pathname &&
      typeof iData.state === 'undefined' &&
      iData.pathname.indexOf('.html') > -1 &&
      iData.pathname.indexOf('://') < 0
    ) ?
      {
        state: {
          type: 'product',
          product: {
            path: iData.pathname,
          },
          reload: true
        },
        pathname: iData.pathname,
      } :
      iData
    ;
    if (data && typeof data.state === 'object' && typeof data.state.reload !== 'undefined' &&
      data.state.type === 'product') {
      if (this.props.route && this.props.route.openProduct) {
        this.props.route.openProduct();
      }
      if (data.state.product) {
        this.props.dispatch(addDataProduct(data.state.product));
      }
      return false;
    }
    if (typeof data !== 'object') {
      if (typeof data === 'string') {
        if (data.indexOf('callto:') > -1) {
          this._callPhone(data);
          return;
        } else if (data.indexOf('://') > -1) {
          Linking.openURL(data).catch(err => console.error('An error occurred', err));
          return;
        }
      }
      alert('can not find: ' + typeof data);
      return;
    }
    if (typeof data.state === 'object') {
      if (this.props.route && this.props.route.openProduct) {
        this.props.route.setLocation(data);
      }
    } else if (typeof data.pathname !== 'undefined' && data.pathname.indexOf('://') > -1) {
      Linking.openURL(data.pathname).catch(err => console.error('An error occurred', err));
    } else {
      alert('Can not find Link');
    }
  }
  _callPhone = (val, prompt = true) => {
    if(typeof Platform === 'undefined') {
      window.location.href = 'tel:' + val;
      return;
    }
    let url = '';
    if(Platform.OS !== 'android') {
      url = prompt ? 'telprompt:' : 'tel:';
    }
    else {
      url = 'tel:';
    }
    url += val;
    Linking.canOpenURL(url).then(supported => {
      if(!supported) {
        alert('Can\'t handle url: ' + url);
      } else {
        Linking.openURL(url)
        .catch(err => {
          if(url.includes('telprompt')) {
            if (prompt !== false) {
              this._callPhone(url, false);  
            }
            // alert('Can not open.Retry...');
            
            // telprompt was cancelled and Linking openURL method sees this as an error
            // it is not a true error so ignore it to prevent apps crashing
            // see https://github.com/anarchicknight/react-native-communications/issues/39
          } else {
            alert('openURL error')
          }
        });
      }
    }).catch(err => alert('An unexpected error happened'));
  }
  render() {
    const data = this.props.to || {};
    if (isNative === true) {
      const style = this.props.style || {};
      return (
        <TouchableWithoutFeedback
          transparent
          onPress={() => {
            if (typeof this.props.onClick !== 'undefined') {
              this.props.onClick();
              if (this.props.noLink === true) {
                return;
              }
            }
            if (typeof this.props.to !== 'undefined') {
              this.routerLink(data);
            }
          }}
          style={style}
        >
          <View style={style}>
            {this.props.children}
          </View>
        </TouchableWithoutFeedback>
      );
      
    }
    const dataWebProps = convertStyle(this.props.style);
    const val = data;
    if (val && val.pathname && val.pathname.indexOf('://') > -1) {
      dataWebProps.target = "_blank";
      if (typeof window !== 'undefined') {
        const domain = window.location.hostname;
        if (val.pathname.indexOf(domain) > -1) {
          val.pathname = data.pathname.substr(data.pathname.indexOf('://') + 3);
          val.pathname = val.pathname.substr(val.pathname.indexOf('/'));
          dataWebProps.target = undefined;
        }
      }
    }
    if (typeof val === 'string') {
      return (
        <a
          {...dataWebProps}
          onClick={this.props.onClick}
          href={val}
        >{this.props.children}</a>
      );
    }
    if (typeof val === 'object' && hasKey(val)) {
      dataWebProps.to = val;
    }
    if (this.props.noLink === true) {
      return (
        <div
          onClick={() => {
            this.props.onClick();
          }}
          {...dataWebProps}
        >
          {this.props.children}
        </div>
      )
    }
    return (
      <Link
        onClick={this.props.onClick}
        {...dataWebProps}
      >
        {this.props.children}
      </Link>
    );
  }
}
export default connect(
  state => {
    return {
      
    };
  },
  (dispatch) => {
    return {
      dispatch,
    };
  },
) (LinkDiv);