import React from 'react';
import Div from '../../components/Div';
import TextIcon from '../../components/TextIcon';

export default class Box extends React.Component {
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
      	<TextIcon></TextIcon>
      </Div>
    );
  }
}
