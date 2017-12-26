import React from 'react';
import Div from '../../components/Div/';
import Icon from '../../components/Icon/';
import styles from './styles.scss';
import Maps from '../../components/Maps/';

export default class Menu extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        <Div style={[styles.item]}>
          <Icon size={10} color='#8e8a8a' name={this.props.children} />
        </Div>

    );
  }
}
