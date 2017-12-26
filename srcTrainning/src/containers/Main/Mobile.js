import React from 'react';
import Global from './Global';
import Div from '../../components/Div/';
import styles from './styles.scss';
export default class Mobile extends Global {
  render() {
    let activatedSearch = false;
    if (this.props.isNative === true) {
      const getLocation = this.props.route.getLocation();
      if (typeof getLocation.pathname !== 'string' || getLocation.pathname.indexOf('Search') === -1) {
        activatedSearch = true;
      }
    } else if (typeof this.props.location === 'undefined' || this.props.location.pathname.indexOf('Search') === -1) {
      activatedSearch = true;
    }

    const dataProps = {
      len: 0,
    };
    if (this.props.isNative !== true) {
      dataProps.isNative = this.props.isNative;
      dataProps.isDesktop = this.props.isDesktop;
      dataProps.footer = typeof this.props.footer !== 'undefined' ? React.cloneElement(this.props.footer, {
        isNative: this.props.isNative,
        isDesktop: this.props.isDesktop,
      }) : undefined;
      dataProps.len += 3;

      const routeType = this.props.routes[1].type;
      if (routeType === 'Home') {
        dataProps.setData = (obj) => {
          this.setData(obj);
        };
        dataProps.len += 1;
      } else if (routeType === 'Carts') {
        dataProps.onOpenAccount = (val) => {
          this.setState({ isOpenAccount: val });
        };
        dataProps.len += 1;
      }
    }
    return this._renderMain(
      <Div style={styles.mainMobile}>
        <Div style={{ flex: 1 }}>
          <Div
            style={styles.mainWeb}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              this._height = height;
            }}
          >
            <Div style={{ flex: 1 }}>
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
