import React from 'react';
import Div from '../../components/Div/';
import Icon from '../../components/Icon/';
import styles from './styles.scss';
import Span from '../../components/Span/';
import Input from '../../components/Input';

export default class FormSearch extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Div>
        <Div style={[styles.formSearch]}>
          <Div style={[styles.formSearch__TextIcon]}>
            <Input type='text'/>
            <Div style={[styles.formSearch__Search]}>
              <Icon name='fi-search-1'></Icon>
            </Div>
            
            <Div style={[styles.formSearch__Clear]}>
              <Icon name='fi-xoa'></Icon>
            </Div>
          </Div>
          <Div style={[styles.cancel]}>
            <Span>Cancel</Span>
          </Div>
        </Div>
      </Div>
    );
  }
}
