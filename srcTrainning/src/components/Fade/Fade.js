import React from 'react';
import Div from '../../components/Div/';

export default class Fade extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Div>
      	<Icon></Icon>
      </Div>
    );
  }
}
