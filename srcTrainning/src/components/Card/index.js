'use strict';

import React, { Component } from 'react';
import Div from '../../components/Div/';
import Span from '../../components/Span/';
import Button from '../../components/Button/';
import Image from '../../components/Image/';
import Input from '../../components/Input/';
import Icon from '../../components/Icon/';
import styles from './styles.scss';
import { map } from '../../utils/object';
import config from '../../config';
class index extends Component {
  render() {
    const StyleCard = this.props.StyleCard;
    const ArrIcon = this.props.ArrIcon || [];
    return (
      <Div
        style={[styles.ViewCard, StyleCard]}
        onClick={() => {
          if (typeof this.props.onClick !== 'undefined') {
            this.props.onClick();
          }
        }}
      >
      	{this.props.title &&
  	      <Div style={[styles.ViewCardTitle, this.props.subtitleStyle]}>
                <Div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  {this.props.CirkeBorder &&
                    <Div style={[styles.ViewCirkeBorder, {borderColor: this.props.BorderColor || '#00bcd4'}]}>
                      <Span style={[styles.ViewCirkeBg, {backgroundColor: this.props.BgColor || '#00bcd4'}]}></Span>
                    </Div>
                  }
      	      	<Span style={[styles.TitleSpan, {color: this.props.subtitleColor || '#00bcd4'}]}>{this.props.title}</Span>
                </Div>
                <Div style={[{display: 'flex', flexDirection: 'row'}, this.props.StyleCardIcon]}>
                  {ArrIcon.map((createItem, key) => {
                    return (
                      <Button style={[styles.btnCard, this.props.btnStyle]} key={'icon' + createItem + key}
                        onClick={() =>{
                          if(typeof this.props.onClick !== 'undefined') {
                            this.props.onClick(key);
                          }
                        }}
                      >
                        <Icon name={createItem}/>
                      </Button>
                    );
                  })}
                </Div>
  	       </Div>
      	}
        {this.props.children &&
          <Div style={[{padding: 10}, this.props.containerStyle]}>
        	 {this.props.children}
          </Div>
        }
      </Div>
    );
  }
}
export default index;