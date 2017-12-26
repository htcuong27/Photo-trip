import React from 'react';

// import { firstValue } from '../../utils/utils';
// import { getListPriceCategory } from '../../redux/modules/Category';
// import { saveToCart } from '../../redux/modules/Cart';
// import { loadBanner } from '../../redux/modules/Main';
class GlobalHome extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {};
    this.refComponent = {};
    this.link = {};
    this.loaded = false;
    this.state = {
      active: 0,
      sideTab: 0,
      footerOpen: null,
      listIdGetPrice: [],
    };
    this.signalSmall = {};
    this.loaded = false;
    // this._handleprops(props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.statusBanner === 0 && nextProps.statusBanner === 1) {
      this.loaded = false;
      // this._handleprops(nextProps);
    }
    /*if (this.props.statusCategoryPrice === 0 && nextProps.statusCategoryPrice === 1 
      && nextProps.resultgetListCategoryPrice) {
      const result = firstValue(nextProps.resultgetListCategoryPrice)
      for (let key in this.link) {
        if (typeof this.refComponent[this.link[key]] !== 'undefined' && this.refComponent[this.link[key]] !== null) {
          if (this.link[key][0] === 'myListItem') {
            if (typeof this.refComponent[this.link[key]].refChildBanner.dataProduct[key] !== 'undefined') {
              this.refComponent[this.link[key]].refChildBanner.dataProduct[key]._onChangePrice(result[key])
            }
          } else {
            this.refComponent[this.link[key]].dataProduct[key]._onChangePrice(result[key]);
          }
        }
      }
    }*/
  }
  _handleprops = (props) => {
    return;
    if (props.statusBanner !== 1) {
      return;
    }
    if (this.loaded === true) {
      return;
    }
    this.loaded = true;

    const listIdGetPrice = [];
    for (let key in props.banner) {
      if (key.indexOf('banner') > -1 || key.indexOf('Banner') > -1 || key.indexOf('slide') > -1) {
        continue;
      }
      const data = props.banner[key];
      if (typeof data.list !== 'undefined') {
        for (let k in data.list) {
          if (typeof data.list[k].value !== 'undefined') {
            const val = firstValue(data.list[k].value);
            if (typeof this.link[val.id] === 'undefined') {
              this.link[val.id] = [];
            }
            this.link[val.id].push(key);
            const obj = {
              aid: val.id,
              vid: 7,
            }
            listIdGetPrice.push(obj);
          }
        }
      }
    }
    props.getListPriceCategory(listIdGetPrice);
    this.startGetPrice = true;
    return;
  }/*
  _saveToCart = ({ id, sku, different, checkShowCart, curQuality, price_custom }) => {
    if (curQuality === 1 && different === -1) {
      this.setShowCart(id, false);
      this.props.dispatch(removeItem({ sku: sku, checkShowCart: checkShowCart }));
    } else {
      this.props.dispatch(saveToCart({ id: id, price_custom, sku: sku, different: different, checkShowCart: checkShowCart }));
    }
  }*/
  
}
export default GlobalHome;
