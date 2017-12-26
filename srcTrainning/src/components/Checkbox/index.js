import React from 'react';
import Icon from '../../components/Icon/';
import Div from '../../components/Div';
import Span from '../../components/Span';
import Input from '../../components/Input';
import styles from './styles.scss';

export default class Checkbox extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
  }  

  render() {
    const checkDisplay = this.state.checked;
    return (
      <Div style={[styles.checkbox]} onClick={() => {this.setState({checked: !this.state.checked})}}>
        {this.state.checked === true &&
          <Div style={{display: 'flex'}}>
            <Div style={{position: 'relative'}}>
              <Icon name = 'fi-radius'></Icon>
            </Div>
            <Div style={{display:'flex',position: 'fixed'}}>
              <Icon name = 'fi-radius-select'></Icon>
            </Div>
              <Span>{this.props.children}</Span>
          </Div>
        }

        {this.state.checked === false &&
          <Div style={{display: 'flex'}}>
            <Div style={{display:'flex',position: 'relative'}}>
              <Icon name = 'fi-radius'></Icon>
            </Div>
              <Span>{this.props.children}</Span>
          </Div>
        }
      </Div>
    );
  }
}
