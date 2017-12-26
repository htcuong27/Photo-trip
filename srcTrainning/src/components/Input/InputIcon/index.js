import React from 'react';
import Input from '../../Input/';
import Div from '../../Div';
import styles from './styles.scss';
import Icon from '../../Icon/';

export default class InputIcon extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      checked: true
    }
  }

  handelType = function(name_Placeholder, name_Type) {
    let x = 'password';
    if(name_Type === 'text'){
      x = 'text';
    }
    else if(name_Type === 'password'){
      if(this.state.checked === true){
        x = 'password'
      }
      else {
        x = 'text';
      }
    }
    return x;
  }

  render() {
  	const { name_Type, name_Placeholder } =this.props;
    const handel = this.handelType(name_Placeholder, name_Type);
    return (
      <Div style={[styles.inputicon]}>
        <Input type={handel} placeholder={name_Placeholder}></Input>
        <Div onClick={() => {this.setState({checked: !this.state.checked})}}>
          <Icon name="fi-notice-warning"></Icon>
        </Div>
      </Div>
    );
  }
}
