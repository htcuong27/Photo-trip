import React, { Component } from 'react';
import config from '../../config';
import { convertStyle } from '../../utils/utils';

const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;
import { Text, TouchableOpacity, Platform } from 'react-native';

export default class Button extends Component {
  render() {
    let dataProps = {};
    if (this.props.disabled === true) {
      dataProps.disabled = true;
    }
    if (isNative === true) {
      const style = this.props.style || {};
      return (
        <TouchableOpacity
          {...dataProps}
          block={this.props.block ? true : false}
          onPress={() => {
            if (typeof this.props.onClick !== 'undefined') {
              this.props.onClick();
            }
          }}
          style={[{
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderRadius: (Platform.OS === 'ios') ? 5 : 2,
            borderWidth: (this.props.bordered) ? 1 : 0,
            borderColor: '#5067FF',
            justifyContent: 'center',
          }, style]}
        >
          {typeof this.props.children === 'string' &&
            <Text>{this.props.children}</Text> ||
            this.props.children
          }
        </TouchableOpacity>
      );
    }
    const dataWebProps = convertStyle(this.props.style);
    return (
      <button
        {...dataWebProps}
        onClick={() => {
          if (typeof this.props.onClick !== 'undefined') {
            this.props.onClick();
          }
        }}
      >
        {this.props.children}
      </button>
    );
  }
}
