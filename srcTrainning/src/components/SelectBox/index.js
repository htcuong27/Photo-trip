import React, { Component } from 'react';
import { convertStyle } from '../../utils/utils';
import {
  Picker,
  ActionSheetIOS,
  Platform
} from 'react-native';
import Div from '../../components/Div/';
import Icon from '../../components/Icon/';
import { each } from '../../utils/object';

export default class SelectBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || 0
    };
  }

  render() {
    if (typeof this.props.options === 'undefined' || this.props.options === null || this.props.options.length < 1) {
      return <Div />;
    }
    if (typeof Platform !== 'undefined' && Platform.OS === 'ios' ) {
      return (
        <Div style={this.props.style || {flexDirection: 'row', display: 'flex', position: 'relative', width: 150}}>
          <Div
            onClick={() => {
              const arr = [];
              let isSelect = this.props.options.length;
              each(this.props.options, (s, i) => {
                arr.push(s.name);
                /*if (s.value === this.state.value) {
                  isSelect = i;
                }*/
              });
              arr.push('Cancel');

              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: arr,
                  cancelButtonIndex: this.props.options.length,
                  destructiveButtonIndex: isSelect,
                },
                (buttonIndex) => {
                  if (buttonIndex === this.props.options.length) {
                    return;
                  }
                  const item = this.props.options[buttonIndex];
                  if (typeof item === 'undefined' || typeof item.value === 'undefined') {
                    return;
                  }
                  this._handleChange(item.value);
                }
              );
            }}
            style={{flex: 1, height: this.props.height}}
          >
            {each(this.props.options, s => {
              if (s.value !== this.state.value) {
                return;
              }
              return <Div isText>{s.name}</Div>;
            })}
          </Div>
          <Div
            pointerEvents={'none'}
            style={{
              position: 'absolute',
              top: 0,
              right: 2,
              width: 28,
              height: 30,
              borderLeftStyle: 'solid',
              borderLeftWidth: 1,
              borderLeftColor: '#ddd',
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Icon size={14} color='#ddd' name="fi-chevron-down-1" />
          </Div>
        </Div>
      );
    }
    
  	if (typeof Picker !== 'undefined') {	
	    return (
        <Div style={this.props.style || {flexDirection: 'row', display: 'flex', position: 'relative', width: 150}}>
  	      <Picker
            style={{flex: 1, height: this.props.height}}
  				  selectedValue={this.state.value}
  				  onValueChange={(itemValue) => this._handleChange(itemValue)}
          >
            {each(this.props.options, s => <Picker.Item key={'item' + s.value} label={s.name} value={s.value} />)}
  				</Picker>
          <Div
            pointerEvents={'none'}
            style={{
              position: 'absolute',
              top: 0,
              right: 2,
              width: 28,
              height: 30,
              borderLeftStyle: 'solid',
              borderLeftWidth: 1,
              borderLeftColor: '#ddd',
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Icon size={14} color='#ddd' name="fi-chevron-down-1" />
          </Div>
        </Div>
	    );
  	}
    const dataWebProps = convertStyle(this.props.style);
    return (
      <Div style={{flexDirection: 'row', display: 'flex', position: 'relative', width: '100%'}}>
        <select
          {...dataWebProps}
          disabled={this.props.disabled}
          value={this.props.value}
          onChange={(e) => {
            if (typeof this.props.handleChange !== 'undefined') {
              this.props.handleChange(e.target.value);
            }
          }}
        >
          {each(this.props.options, s => {
            return (
              <option value={s.id}>{s.name}</option>
            )
          })}
        </select>
        <Div
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            width: '30px',
            height: '28px',
            borderLeft: '1px solid #ddd',
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            pointerEvents: 'none',
          }}
        >
          <Icon size={14} color='#ddd' name="fi-chevron-down-1" />
        </Div>
      </Div>
    )
  }
}
