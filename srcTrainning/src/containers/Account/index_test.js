'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Desktop from './Desktop';
import Mobile from './Mobile';

class index extends Component {
  constructor(props) {
    super(props);
    this._getInfoRoute = (p) => {
      if (typeof this._isDesktop !== 'undefined') {
        return;
      }
      this._getInfo = {};
      this._isDesktop = p.isDesktop;
      if (p.route && p.route.getInfo) {
        this._getInfo = p.route.getInfo();
      }

      if (this._getInfo.type === 'web') {
       this._isDesktop = this._getInfo.device === 'mobile' ? false : true;
      }
    };
    this._getInfoRoute(props);
  }

  componentDidMount() {
    this._getInfoRoute(this.props);
  }

  render() {
    const isNative = this._getInfo.type === 'web' ? false : true;
    const isDesktop = this._isDesktop;
    const dataProps = {
      dispatch: this.props.dispatch,
      location: this.props.location,
    };
    if (isDesktop === true) {
      return (
        <Desktop
          isDesktop
          {...dataProps}
        />
      );
    }
    return (
      <Mobile
        isDesktop={false}
        {...dataProps}
      />
    );
  }
}
export default connect(
  state => {
    return {};
  },
  (dispatch) => {
    return {
      dispatch,
    };
  },
)(index);