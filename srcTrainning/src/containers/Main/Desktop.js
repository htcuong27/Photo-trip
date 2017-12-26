import React from 'react';
import Global from './Global';
import Div from '../../components/Div/';
import styles from './styles.scss';

export default class DesktopMain extends Global {
  render() {
    const dataProps = {
      len: 0,
    };
    return this._renderMain(
      <Div style={[styles.app, { flex: 1 }]}>
        <Div style={[styles.middletop, { flex: 1 }]}>
          <Div
            style={[styles.layoutContainerWrapper, { flex: 1 }]}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              this._height = height;
            }}
          >
            <Div style={[styles.middle, { flex: 1, zIndex: 120 }]}>
              {
                dataProps.len > 0 &&
                (typeof this.props.content !== 'undefined' ?
                  React.cloneElement(this.props.content, dataProps) : undefined) ||
                this.props.content
              }
            </Div>
          </Div>
        </Div>
      </Div>
    );
  }
}
