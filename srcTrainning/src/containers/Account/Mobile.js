import React from 'react';
import Global from './Global';
import Div from '../../components/Div/';
import Span from '../../components/Span/';
import Icon from '../../components/Icon/';
import Button from '../../components/Button/';
import ButtonClick from '../../components/Button/ButtonClick/';
import InputIcon from '../../components/Input/InputIcon/';
import CheckBox from '../../components/Checkbox/';
import SelectBox from '../../components/SelectBox/';
import Input from '../../components/Input/';
import styles from './styles.scss';
import Notifi from '../../components/Notifi/';

// onClick={() => this.setState({checked: !this.state.checked})}
export default class MobileAccount extends Global {
  constructor(props) {
    super(props);
    this.arrTab = [
      'Login',
      'Register',
      'Forgotten account?'
    ]
    this.state = {
      checked: false,
      button: false,
      tabActive: 0
    };
  }


  render(){ 
    const isChecked = this.state.checked
    const isButton = this.state.button;
    const { tabActive } = this.state;
    return(
    <Div style={[styles.container]}> 
      <Div style={[styles.header]}> 
        
          
          {tabActive === 0 &&
          <Div style={[styles.header_around]}> 
            <Span>LOGIN</Span>
            <Div style={[styles.header_inside]}> 
              <Icon size={9} color={'#000'} name="fi-back"/>
            </Div> 
          </Div>  
          }

          {tabActive === 1 &&
          <Div style={[styles.header_around]}> 
            <Span>REGISTER</Span>
            <Div style={[styles.header_inside]}> 
              <Icon size={9} color={'#000'} name="fi-back"/>
            </Div> 
          </Div>  
          }

          {tabActive === 2 && 
          <Div style={[styles.header_around]}> 
            <Span>FORGOTTEN?</Span>
            <Div style={[styles.header_inside]}> 
              <Icon size={9} color={'#000'} name="fi-back"/>
            </Div> 
          </Div>  
          }
      </Div>
      <Div style={[styles.middel]}>
        <ButtonClick/>
      </Div>

      <Div style={[styles.bottom]}>
      {this.arrTab.map((tab, i) => {
        return (
          <Div
            key={i}
            style={[styles.bottom_item]}
            onClick={() => {
              this.setState({
                tabActive: i
              })
            }}
          >
            <CheckBox>{tab}</CheckBox>
          </Div>
        )
      })}
      </Div>
    </Div>
    );
  }
}
