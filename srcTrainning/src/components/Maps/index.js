import React from 'react';
import Div from '../../components/Div/';
import Icon from '../../components/Icon/';
import styles from './styles.scss';

export default class Map extends React.Component {
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
      <Div style={[styles.map]}> 

      </Div>
    );
  }
}