import React from 'react';
import { connect } from 'react-redux';
import Desktop from './Desktop';
import Mobile from './Mobile';
class GlobalMain extends React.Component {
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
    if (isDesktop) {
      return (
        <Desktop
          ref={ele => this.refMain = ele}
          {...this.props}
          isDesktop={isDesktop}
          isNative={isNative}
        />
      );
    }
    return (
      <Mobile
        ref={ele => this.refMain = ele}
        {...this.props}
        isDesktop={isDesktop}
        isNative={isNative}
      />
    );
  }
}
export default connect(
  state => {
    const { serverData } = state;
    const isDataServer = typeof serverData !== 'undefined' ? true : false;
    const user = isDataServer ? {} : state.Auth.user;
    const notShowSlideCart = isDataServer ? true : state.Cart.notShowSlideCart;
    const resultDomain = isDataServer ? serverData.Global.domain.data : state.Main.resultDomain;
    return {
      isDataServer,
      resultDomain,
      user,  // neu co user se render lan` 5
      notShowSlideCart,
      dataAddCategoryFromProduct: state.Category.dataAddCategoryFromProduct,
    };
  },
  (dispatch) => {
    return {
      dispatch,
    };
  }, null, { withRef: true }
) (GlobalMain);
