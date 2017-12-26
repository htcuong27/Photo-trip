import React from 'react';
import Div from '../../components/Div';
import Span from '../../components/Span';
import Icon from '../../components/Icon';
import styles from './styles.scss';

export default class Notifi extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Div style={[styles.Notifi]}>
        <Div style={[styles.icon]}>
          <Icon name="fi-notice-warning"></Icon>
        </Div>
        <Div><Span>{this.props.children}</Span></Div>
        <Div style={[styles.icon]}>
          <Icon name="fi-notice-warning"></Icon>
        </Div>
      </Div>
    );
  }
}
