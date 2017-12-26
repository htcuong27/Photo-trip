import React, { Component, PropTypes } from 'react';
import config from '../../config';
import { Animated, Easing } from 'react-native';
import { convertStyle } from '../../utils/utils';

const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;
const Text = isNative === true ? require('react-native').Text : undefined;

export default class Span extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0
    }
    this.springValue = undefined;
    if (isNative === true && props.animated === true) {
      this.springValue = new Animated.Value(1)
    }
  }
  componentDidMount () {
    this._checkEllipsis()
  }

  componentDidUpdate () {
    this._checkEllipsis()
  }

  componentWillReceiveProps(nextProps) {
    if (typeof this.springValue !== 'undefined' && this.props.children !== nextProps.children) {
      this.springValue.setValue(1);
      Animated.spring(
        this.springValue,
        {
          toValue: 1.2,
          friction: 1
        }
      ).start(() => {
        Animated.spring(
          this.springValue,
          {
            toValue: 1,
            friction: 1
          }
        ).start();
      });
    }
  }

  _getDOMNodeProperty (node, property) {
    return document.defaultView.getComputedStyle(node, null)
      .getPropertyValue(property)
  }

  _checkEllipsis () {
    if (typeof this.props.numberOfLines === 'undefined' || typeof this.props.children !== 'string' || typeof this.refMain === 'undefined' || this.refMain === null) {
      return;
    }
    if (this.state.height > 0) {
      return;
    }
    const lineHeight = this._getDOMNodeProperty(this.refMain, 'line-height').replace('px', '')
    // const height = this.getDOMNodeProperty(this.refMain, 'height').replace('px', '')
    const { height } = this.refMain.getBoundingClientRect();
    const numberOfLines = height / lineHeight

    if (numberOfLines > this.props.numberOfLines) {
      this.setState({
        height: this.props.numberOfLines * lineHeight,
        text: ''
      });
    }
  }

  startsWith (str, textToSearch) {
    return str.startsWith
      ? str.startsWith(textToSearch)
      : str.indexOf(textToSearch, 0) === 0
  }
  render() {
    if (isNative === true) {
      const style = this.props.style || {};
      if (typeof this.props.children === 'undefined' || this.props.children === null || this.props.children.length === 0) {
        return (
          <Text
            style={style}
          >{' '}</Text>
        );
      }
      if (typeof this.springValue !== 'undefined') {
        return (
          <Animated.Text
            numberOfLines={this.props.numberOfLines}
            style={[style, { transform: [{scale: this.springValue}]}]}>
            {this.props.children}
          </Animated.Text>
        );
      }
      return (
        <Text
          numberOfLines={this.props.numberOfLines}
          style={style}>{this.props.children}</Text>
      );
    }
    const dataWebProps = convertStyle(this.props.style);
    return (
      <span
        ref={ele => this.refMain = ele}
        {...dataWebProps}
      >
        {this.state.height > 0 ?
          <span style={{position: 'relative'}}>
            <span style={{height: this.state.height, display: 'inline-block', overflow: 'hidden'}}>{this.props.children}</span>
            <span style={{position: 'absolute', bottom: 0, right: 0, marginRight: 10, marginBottom: 5}}>...</span>
          </span>
          : this.props.children
        }
      </span>
    );
  }
}
