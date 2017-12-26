import React from 'react';
import Div from '../../Div';
export default class ButtonCircle extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Div>
      	<Button>{this.props.children}</Button>
      </Div>
    );
  }
}
