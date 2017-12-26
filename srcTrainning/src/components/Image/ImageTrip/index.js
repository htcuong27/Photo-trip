import React from 'react';
import Div from '../../Div';
import Span from '../../Span';
import Icon from '../../Icon';
import Image from '../../Image';
import ImageCircle from '../../Image/ImageCircle';
import ImageText from '../../Image/ImageText';
import styles from './styles.scss';

export default class ImageTrip extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Div style={[styles.container]}>
        <Div style={[styles.top]}>
          <Div style={[styles.top__1]}>
            <Span style={{fontSize: '10px'}}>
              Chuyến du lịch vườn quốc gia những ngày cuối. text dài hơn
            </Span>
            <Div style={{fontSize: '8px'}}>
              <Icon size={9} color={'#000'} name="fi-back"/>
            </Div>
            
          </Div>
          <Div style={[styles.top__2]}>
            <Span style={{fontSize: '8px'}}>2 photos.</Span>
            <Div>
              <ImageCircle sizeImage={'12px'}></ImageCircle>
              <Span>mikadonguyen</Span>
            </Div>
          </Div>
        </Div>
        <Div style={[styles.bot]}>
          <Div style={[styles.bot__1]}>
            <Image style={{height: '20px', width: '50%'}} src={'https://scontent.fsgn4-1.fna.fbcdn.net/v/l/t1.0-1/c0.0.719.719/22279928_365072373929674_2992063839592813403_n.jpg?oh=92f042a63ffe0381f9c8ea9f9a8ff24f&oe=5A718268'}></Image>
          </Div>
          <Div style={[styles.bot__2]}>
            <Div>
              <Image style={{height: '20px', width: '20px'}} src={'https://scontent.fsgn4-1.fna.fbcdn.net/v/l/t1.0-1/c0.0.719.719/22279928_365072373929674_2992063839592813403_n.jpg?oh=92f042a63ffe0381f9c8ea9f9a8ff24f&oe=5A718268'}></Image>
            </Div>
            <Div>
              <Div>
                <Image style={{height: '20px', width: '20px'}} src={'https://scontent.fsgn4-1.fna.fbcdn.net/v/l/t1.0-1/c0.0.719.719/22279928_365072373929674_2992063839592813403_n.jpg?oh=92f042a63ffe0381f9c8ea9f9a8ff24f&oe=5A718268'}></Image>
              </Div>
              <Div>
                <Image style={{height: '20px', width: '20px'}} src={'https://scontent.fsgn4-1.fna.fbcdn.net/v/l/t1.0-1/c0.0.719.719/22279928_365072373929674_2992063839592813403_n.jpg?oh=92f042a63ffe0381f9c8ea9f9a8ff24f&oe=5A718268'}></Image>
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>
    );
  }
}
