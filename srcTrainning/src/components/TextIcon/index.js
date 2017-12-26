import React from 'react';
import Div from '../../components/Div';
import Span from '../../components/Span';
import Icon from '../../components/Icon';

export default class TextIcon extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Div>
      	<Span>{this.props.children}</Span>
      	<Icon></Icon>
      </Div>
    );
  }
}
