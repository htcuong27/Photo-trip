import React, { PropTypes } from 'react';
import config from '../../config';
import styles from './styles.scss';
import { convertStyle } from '../../utils/utils';

// const styles = require(typeof config.type !== 'undefined' && config.type === 'app' ? './styles.js' : './styles.scss');
const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;
const TextInput = isNative === true ? require('react-native').TextInput : undefined;
const View = isNative === true ? require('react-native').View : undefined;

export default class Input extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  focus = () => {
    if (typeof this._root === 'undefined' || this._root === null) {
      return;
    }
    this._root.focus();
  }

  clearValue = () => {
    if (typeof this._root === 'undefined' || this._root === null) {
      return;
    }
    if (isNative) {
      this._root.clear();
    } else {
      this._root.value = '';
    }
  }

  /*isFocused = () => {
    if (typeof this._root === 'undefined' || this._root === null) {
      return;
    }
    if (isNative) {
      this._root.isFocused();
    } else {

    }
  }*/

  render() {
    if (isNative === true) {
      const style = this.props.style || {
        height: 40,
        borderColor: '#000033',
        borderWidth: 1,
        borderRadius: 5,
      };
      const secureTextEntry = this.props.secureTextEntry === true ? true : (type === 'password' ? true : undefined);

      let type;
      switch (this.props.type) {
        case 'number':
          type = 'numeric';
          break;
        case 'tel':
          type = 'phone-pad';
          break;
        case 'url':
          type = 'url'; // ios only
          break;
        case 'email':
          type = 'email-address';
          break;
        case 'radio':
          type = 'radio';
        default:
          type = 'default';
      }

      const underline = (typeof this.props.underline !== 'undefined') ? this.props.underline : 'transparent';
      return (
        <View
          style={style}
        >
          <TextInput
            ref={ele => this._root = ele}
            multiline={this.props.multiline}
            autoFocus={this.props.autoFocus}
            placeholderTextColor={this.props.placeholderTextColor}
            underlineColorAndroid={underline}
            placeholderStyle={this.props.placeholderStyle}
            keyboardType={type}
            value={this.props.value}
            editable={this.props.disabled === true ? false : undefined}
            maxLength={this.props.maxLength}
            placeholder={this.props.placeholder}
            secureTextEntry={secureTextEntry}
            onChangeText={(value) => this.props.onChange && this.props.onChange(value) }
            onFocus={this.props.onFocus}
            style={{flex: 1}}
            onContentSizeChange={(event) => {
              if (typeof this.props.onContentSizeChange !== 'undefined') {
                this.props.onContentSizeChange(event)
              }
            }}
            onSubmitEditing={typeof this.props.onEnter === 'function' ? this.props.onEnter : undefined}
            returnKeyType={typeof this.props.onEnter === 'function' ? 'done' : undefined}
          />
        </View>
      )
    }
    const type = this.props.secureTextEntry === true ? 'password' : this.props.type;
    const dataWebProps = convertStyle(this.props.style);
    return (
      <input
        ref={ele => this._root = ele}
        type={type}
        autoFocus={this.props.autoFocus}
        value={this.props.value}
        readonly={this.props.disabled}
        disabled={this.props.disabled}
        maxLength={this.props.maxLength}  
        placeholder={this.props.placeholder}
        onChange={(e) => this.props.onChange && this.props.onChange(e.target.value) }
        onFocus={this.props.onFocus}
        onKeyUp={(typeof this.props.onEnter === 'function') ? (e) => {
          if (e.keyCode === '13' || e.key === 'Enter') {
            requestAnimationFrame(() => {
              this.props.onEnter();
            });
          }
        } : undefined}
        {...dataWebProps}
      />
    )
  }
}
