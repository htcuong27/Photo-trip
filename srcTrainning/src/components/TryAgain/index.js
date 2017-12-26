import React from 'react';
import Div from '../../components/Div';
import Span from '../../components/Span';
import Image from '../../components/Image';
import styles from './styles.scss';
export default class TryAgain extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Div style={[styles.tryAgain]}>
        <Div>
          <Image src={'https://orig00.deviantart.net/1d75/f/2009/220/b/0/spongebob_4_150x150_png_by_somemilk.png'}></Image>
        </Div>
      	<Span>try again</Span>
      </Div>
    );
  }
}
