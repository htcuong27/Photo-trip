import React from 'react';
import Global from './Global';
import Div from '../../components/Div/';
import Span from '../../components/Span/';
import styles from './styles.scss';
import config from '../../config';

export default class DesktopAccount extends Global {
  render() {
    return (
      <Div style={{ flex: 1 }}>
        {this.props.helmet}
        <Span>Home</Span>
        {this.props.footer}
      </Div>
    );
  }
}