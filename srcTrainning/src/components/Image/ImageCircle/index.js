import React from 'react';
import Div from '../../Div';
import Image from '../../Image';
import styles from './styles.scss';

export default class ImageCircle extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { sizeImage } = this.props;
    return (
      <Div >
      	<Image style={{borderRadius: '50%', height: sizeImage, width: sizeImage}} src={'https://scontent.fsgn4-1.fna.fbcdn.net/v/l/t1.0-1/c0.0.719.719/22279928_365072373929674_2992063839592813403_n.jpg?oh=92f042a63ffe0381f9c8ea9f9a8ff24f&oe=5A718268'}></Image>
      </Div>
    );
  }
}
