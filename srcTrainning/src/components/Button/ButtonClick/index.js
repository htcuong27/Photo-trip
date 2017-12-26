import React from 'react';
import Button from '../../Button/';
import Div from '../../Div';
import styles from './styles.scss';
import InputIcon from '../../Input/InputIcon/';

export default class ButtonClick extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.arrTab = [
      'Email',
      'Password'
    ]
    this.state = {
      tabActive: 0,
      buttonEnabled: true,
    };
  }

  // handelButton_Email = function(){
  //   let x = 'none';
  //   if(this.state.buttonEnabled === true && this.props.children === 'Email'){
  //       x = 'none';
  //   }
  //   else if(this.state.buttonEnabled === false && this.props.children === 'Email'){
  //     x = 'block';
  //   }
    
  //   return x;
  //   console.log(x);
    
    
  // }
  // handelButton_Phone = function(){
  //   let x = 'none';
  //   if(this.state.buttonEnabled === true && this.props.children === 'Phone number'){
  //       x = 'none';
  //   }
  //   else if(this.state.buttonEnabled === false && this.props.children === 'Phone number'){
  //     x = 'block';
  //   }
  //   return x;
  //   console.log(x);
    
  // }
  // handelType = function() {
  //   let x = 'password';
  //   if(this.state.name_Placeholder === 'Password' && this.state.buttonEnabled === true){
  //     x = 'password'
  //   }
      
  //   else if(this.state.name_Placeholder === 'Password' && this.state.buttonEnabled === false){
  //     x = 'text';
  //   }
  //   return x;
  // }
  // 
  // t

  render() {
    const { tabActive } = this.state;
    const checkDisplay = this.state.buttonEnabled ? 'flex' : 'none';
    return (
        <Div>
          <Div style={{display: checkDisplay, flexDirection: 'column' }}>
            {this.arrTab.map((tab, i) => {
              return (
                <Button 
                  key={i}
                  style={[styles.buttonclick]}
                  onClick={() => {
                    this.setState({
                      tabActive: i,
                      buttonEnabled: false,
                    })}}
                    >{tab}
                </Button> 
              )
            })}
          </Div>
          {this.state.buttonEnabled === false && tabActive === 0 &&
            <Div>
              <InputIcon name_Type={'text'} name_Placeholder={'Email'}></InputIcon>
              <InputIcon name_Type={'password'} name_Placeholder={'Password'}></InputIcon>
              <Button style={[styles.buttonclick]}>LOGIN</Button>
            </Div>
          }
            
          {this.state.buttonEnabled === false && tabActive === 1 &&
            <Div>
              <InputIcon name_Type={'text'} name_Placeholder={'+84 - VietNam'}></InputIcon>
              <InputIcon name_Type={'text'} name_Placeholder={'Phone number'}></InputIcon>
              <InputIcon name_Type={'password'} name_Placeholder={'Password'}></InputIcon>
              <Button style={[styles.buttonclick]}>LOGIN</Button>
            </Div>
          }
        </Div>
    );
  }
}
