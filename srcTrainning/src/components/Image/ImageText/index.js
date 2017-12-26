import React from 'react';
import Div from '../../Div';
import Span from '../../Span';
import Icon from '../../Icon';
import ImageCircle from '../../Image/ImageCircle';
import Image from '../../Image/';
import styles from './styles.scss';

export default class ImageText extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const checkDisplay = this.props.checked;
    console.log('check', this.props.checked);
    return (
      <Div style={[styles.container]}>
      	<Div style={[styles.fillImage]}>
          <Image style={{height: '90px', width: '90px'}} src={'https://scontent.fsgn4-1.fna.fbcdn.net/v/l/t1.0-1/c0.0.719.719/22279928_365072373929674_2992063839592813403_n.jpg?oh=92f042a63ffe0381f9c8ea9f9a8ff24f&oe=5A718268'}></Image>
      	</Div>
        {checkDisplay === 'true' && 
        <Div style={[styles.underImage]}>
          <Div style={[styles.bottom_image]}>
            <Div>
              <Span>{this.props.children}</Span>
            </Div>
            
            <Div style={[styles.imageCir], {display: 'none', height: '15px'}}>
              <Icon name={'fi-content-location'}></Icon>
              <Span>Ho Chi Minh</Span>
            </Div>
            <Div style={[styles.imageCir]}>
              <ImageCircle sizeImage={'12px'}/>
              <Span>mikadonguyen</Span>
            </Div>
          </Div>
        </Div>
        }

        {checkDisplay === undefined && 
        <Div style={[styles.underImage]}>
          <Div style={[styles.bottom_image]}>
            <Div style={{paddingBottom: '2.5px', flex: '1',display: 'flex', whiteSpace: 'nowrap', height: '15px', textOverflow: 'ellipsis'}}>
              <Span style={{whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden'}}>{this.props.children}</Span>
            </Div>
            
            <Div style={[styles.imageCir], {display: 'block', height: '15px'}}>
              <Icon name={'fi-content-location'}></Icon>
              <Span>Ho Chi Minh</Span>
            </Div>
            <Div style={[styles.imageCir]}>
              <ImageCircle sizeImage={'12px'}/>
              <Span>mikadonguyen</Span>
            </Div>
          </Div>
        </Div>

        }
        
      </Div>
    );
  }
}
