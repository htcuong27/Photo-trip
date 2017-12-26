import React from 'react';
import { Dimensions, Animated, Easing } from 'react-native';
import Div from '../../components/Div/';
import Span from '../../components/Span/';

import { domain } from '../../utils/utils';
import { getDevice, loadMenu, getTypeDomain, loadBanner, load as loadSID, renewSID } from '../../redux/modules/Main';
import { getUserInfo, putUserInfo, logout } from '../../redux/modules/Auth';
import { initialize as initializeCart, initializeWithUser as initializeWithUserCart } from '../../redux/modules/Cart';
import Icon from '../../components/Icon/';
import Image from '../../components/Image/';


import config from '../../config';
import styles from './styles.scss';
import '../../theme/ProximaFont.scss';
import '../../theme/iconfi.scss';

import { abortAll } from '../../redux/modules/Download';

const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;

const elementClass = isNative !== true ? require('element-class') : undefined;

class GlobalMain extends React.Component {
  static propTypes = {
    content: React.PropTypes.object,
    header: React.PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.lastTimeBack = 0;
    const { height, width } = isNative === true ? Dimensions.get('window') :
      (typeof window !== 'undefined' ? { height: window.innerHeight, width: window.innerWidth } : {});
    this._deviceWidth = width;
    this._currentWidth = Math.min(width, height);
    this._maxWidth = Math.max(width, height) - this._currentWidth;
    this._getInfo = {};
    const orientation = (width < height ? 'portrait' : 'landscape');

    this.HEADER_MAX_HEIGHT = props.isDesktop === true ? 40 : 80;
    this.HEADER_MIN_HEIGHT = 35;
    this.HEADER_SCROLL_DISTANCE = this.HEADER_MAX_HEIGHT - this.HEADER_MIN_HEIGHT;
    const maxOpacity = 0.5;
    this.state = {
      isDeviceId: 0,
      isOpenAccount: '',
      openSideCart: false,
      activatedSideCart: false,
      openAccount: false,
      forceOpenAccount: false,
      slimNavbar: false,
      initialType: 0,
      opennav: false,
      popupMessage: '',
      selectedItem: 'About',
      orientation,
      sidebarOpen: false,
      openProduct: 0,
      showNavUser: true,
      isOpenAddModal: false,
      isOpenAddModalMore: false,
      isOpenAddModalContent: false,
      modalPrice: {
        isOpen: false,
        data: {}
      },
      modalSearch: {
        isOpen: false,
        data: {}
      },
      isOpenSidebar: false,
      isOpenSideCart: false,
      heightNavUser: 34,

      scrollY: props.isNative ? new Animated.Value(0) : 0,
      fadeAnim: props.isNative ? new Animated.Value(0) : 0,

      maxOpacity,
      showOverlay: false,
      scaleValue: props.isNative ? new Animated.Value(0.01) : 0,
      opacityValue: props.isNative ? new Animated.Value(maxOpacity) : 0,
    };

    // scroll
    this.currentScroll = 0;

    this.titleTranslate = props.isNative ? this.state.scrollY.interpolate({
      inputRange: [0,  this.HEADER_SCROLL_DISTANCE],
      outputRange: [0, (this.HEADER_SCROLL_DISTANCE - 5) * -1],
      extrapolate: 'clamp',
    }) : undefined;
    // scroll
    
    this._loadedHandle = false;
    this._getInfo = props.route.getInfo();
    if (!isNative) {
      props.route.setOpenProduct({
        setData: this.setData,
      });
    }
    this.onScroll = props.isNative ? Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
      { listener: (e) => {
        const y = e.nativeEvent.contentOffset.y;
        //this._onScroll(y);

        cancelAnimationFrame(this.timeoutScroll);
        this.timeoutScroll = requestAnimationFrame(() => {
          let toValue = -1;
          const currentValue = this.state.fadeAnim._value;
          if (y === 0 && currentValue !== 0) {
            toValue = 0;
          } else if (y !== 0 && currentValue === 0) {
            toValue = 1;
          }
          if (toValue !== -1) {
            Animated.timing(  // Animate over time
              this.state.fadeAnim,  // The animated value to drive
              { toValue }  // Animate to opacity: 1, or fully opaque
            ).start();
          }
          this.props.onScroll(y);
        });
      } },
    ).bind(this) : undefined;


    if (typeof props.setChild !== 'undefined') {
      props.setChild({
        onClickAll: this.onClickAll,
        onActive: (val) => {
          if (val === true) {
            this._renewSID(0);
          } else {
            clearTimeout(this.toRenewSID);
          }
        },
        setData: this.setData,
        onScroll: this.onScroll,
      });
    }
    this.handleprops = p => {
      if (this._loadedHandle === true || this.state.isDeviceId !== 2) {
        return;
      }
      this._loadedHandle = true;
      p.dispatch(loadMenu());
      p.dispatch(initializeCart());
      p.dispatch(getTypeDomain({ domain: domain() }));
      p.dispatch(loadBanner());
      let indexCut;
      let ext;
      if (typeof p.location !== 'undefined' &&
        typeof p.location.pathname !== 'undefined') {
        indexCut = p.location.pathname.lastIndexOf('.');
        ext = p.location.pathname.substr(indexCut + 1);
        if (ext === 'html' && this.state.openProduct === 0) {
          this.setData({ type: 'product', data: 1 });
        }
      }
    }
    if (props.isDataServer === true) {
      this.state.isDeviceId = 2;
      this._loadedHandle = true;
    } else {
      this.props.dispatch(getDevice({ tokenId: props.deviceToken, platform: props.platform })).then((result) => {
        if (typeof result === 'undefined' || typeof result.status !== 'string') {
          this.setState({ isDeviceId: 1 });
          return;
        }
        if (result.status !== 'success') {
          if (result.code !== 1000) {
            this.setState({ isDeviceId: 1 });
          }
          return;
        }
        this.setState({ isDeviceId: 3 });
        this.props.dispatch(getUserInfo()).then(async (result) => {
          const user = (typeof result.data !== 'undefined') ? result.data : {};
          let isLogin = true;
          if (typeof user === 'undefined' || typeof user.info === 'undefined' || typeof user.info.uid === 'undefined' || user.info.uid < 1) {
            isLogin = false;
          }
          if (isLogin) {
            await this.props.dispatch(putUserInfo(result));
            this._loadSID();
          } else {
            clearTimeout(this.toRenewSID);
            this.setState({ isDeviceId: 2 });
            this.handleprops(this.props);
          }
        });
      });
    }
  }
  componentDidMount() {
    this.handleprops(this.props);
    if (this.props.isDataServer !== true && this.props.isNative !== true) {
      window.addEventListener('scroll', this._hanldeScroll);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      typeof this.refHeader !== 'undefined' &&
      this.refHeader !== null &&
      (
        (
          typeof nextProps.routes !== 'undefined' &&
          nextProps.routes !== this.props.routes
        ) ||
        (
          typeof nextProps.routes[nextProps.routes.length - 1].key !== 'undefined' &&
          nextProps.routes[nextProps.routes.length - 1].key !== 'home'
        ) ||
        (
          typeof nextProps.routes[nextProps.routes.length - 1].type !== 'undefined' &&
          nextProps.routes[nextProps.routes.length - 1].type !== 'Home'
        )
      )
    ) {
      const routes = nextProps.routes;
      const isOpenBtnBack = Array.isArray(routes) && routes.length > 1 && (this.props.isNative === true && routes[routes.length - 1].key !== 'home' || routes[routes.length - 1].type !== 'Home') ? true : false;
      if (
        isOpenBtnBack === false &&
        this._checkModal(['openProduct', 'modalPrice', 'modalSearch']).length === 0
      ) {
        this.refHeader.onShowBack(false);
      } else {
        this.refHeader.onShowBack(true);
      }
    }

    if (this.props.notShowSlideCart !== nextProps.notShowSlideCart && nextProps.notShowSlideCart === false) {
      const data = { pathname: '/Carts', state: { id: '', type: 'carts' } };
      if (isNative === true) {
        this.props.route.setLocation(data);
      } else {
        this.props.router.push(data);
      }
      
    }
    if (this.props.location !== nextProps.location) {
      let openProduct = 0;
      let indexCut;
      let ext;
      if (typeof nextProps.location !== 'undefined' &&
        typeof nextProps.location.pathname === 'string') {
        indexCut = nextProps.location.pathname.lastIndexOf('.');
        ext = nextProps.location.pathname.substr(indexCut + 1);
        if (ext === 'html') {
          openProduct = 1;
        }
      }
      if (this.state.openProduct !== openProduct) {
        this.setData({ type: 'product', data: openProduct });
      }
    }
    if (
      (
        typeof nextProps.user.info !== 'undefined' &&
        (
          typeof this.props.user.info === 'undefined' ||
          this.props.user.info.id !== nextProps.user.info.id
        )
      ) ||
      (
        typeof this.props.user.info !== 'undefined' &&
        (
          typeof nextProps.user.info === 'undefined' ||
          this.props.user.info.id !== nextProps.user.info.id
        )
      )
    ) {
      if (this.state.isOpenAccount !== '') {
        this.setState({ isOpenAccount: '' });
      }
      this.props.dispatch(initializeCart(true));
      this.props.dispatch(loadBanner(true));

      const { user } = nextProps;
      let isLogin = true;
      if (typeof user === 'undefined' || typeof user.info === 'undefined' || typeof user.info.uid === 'undefined' || user.info.uid < 1) {
        isLogin = false;
      }
      if (isLogin) {
        this.props.dispatch(initializeWithUserCart(true));
        this._renewSID(10 * 600 * 1000);
      } else {
        clearTimeout(this.toRenewSID);
      }
    }
    this.handleprops(nextProps);
  }
  componentWillUnmount() {
    if (this.props.isDataServer !== true && this.props.isNative !== true) {
      window.removeEventListener('scroll', this._hanldeScroll);
    }
  }
  openCart = (type) => {
    if (typeof this._drawer !== 'undefined') {
      if (this.state.isOpenSideCart === true) {
        this._drawer.close();
      } else {
        this._drawer.open();
      }
    }
    this._onActionSiderBar(!this.state.isOpenSideCart);
    this.setState({
      isOpenSideCart: !this.state.isOpenSideCart,
      isOpenChat: type === 'chat' ? true : false,
    })
  }
  isOpenSidebar = () => {
    if (typeof this._drawerMenu !== 'undefined') {
      if (this.state.isOpenSideCart === true) {
        this._drawerMenu.close();
      } else {
        this._drawerMenu.open();
      }
    }
    this._onActionSiderBar(!this.state.isOpenSidebar);
    this.setState({isOpenSidebar: !this.state.isOpenSidebar})
  }
  onLayoutChange = (e) => {
    const {height, width} = Dimensions.get('window');
    const orientation = (width < height ? 'portrait' : 'landscape');
    if (orientation !== this.state.orientation) {
      this.setState({ orientation });
    }
  }
  _openAccount = (type) => {
    this.setState({ isOpenAccount: type });
  }
  _showRipple = () => {
    if (this.props.isNative !== true) {
      this.setState({ showOverlay: true });
      setTimeout(() => {
        this.setState({ showOverlay: false });
      }, 200);
      return;
    }
    setTimeout(() => {
      this.setState({ showOverlay: true });
      Animated.timing(this.state.scaleValue, {
        toValue: 1,
        duration: 225,
        easing: Easing.bezier(0.0, 0.0, 0.2, 1),
      }).start();
      setTimeout(() => {
        Animated.timing(this.state.opacityValue, {
          toValue: 0,
        }).start(() => {
          this.state.scaleValue.setValue(0.01);
          this.state.opacityValue.setValue(this.state.maxOpacity);
          this.setState({ showOverlay: false });
        });
      }, 500);
    }, 100);
  }
  setData = (obj) => {
    if (typeof obj.type === 'undefined') {
      return false;
    }
    
    let showBack = false;
    if (obj.type === 'showBack') {
      if (typeof obj.data === 'undefined' || obj.data !== false) {
        showBack = true;
      }
    } else if (obj.type === 'openAccount') {
      this.setState({ isOpenAccount: obj.data });
      return;
    } else if (obj.type === 'search') {
      if (obj.isOpen === true && typeof obj.data.layout === 'undefined') {
        if (typeof this.refHeader !== 'undefined' && this.refHeader !== null) {
          this.refHeader.onShowLargeSearch();
        }
      } else {
        if (obj.isOpen === false && typeof this.refHeader !== 'undefined' && this.refHeader !== null) {
          this.refHeader.onCloseSearch();
        }
        this.setState({
          modalSearch: {
            isOpen: obj.isOpen,
            data: {
              type: obj.type,
              data: obj.data
            },
          },
        });
      }
      if (obj.isOpen) {
        this._showRipple();
      }
    } else if (obj.type === 'product') {
      let openProduct = obj.data;
      if (openProduct === -1) {
        openProduct = 0;
      }
      if (openProduct === this.state.openProduct) {
        return false;
      }
      if (obj.data < 1) {
        const numberBack = typeof this.props.location !== 'undefined' && typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.numberBack !== 'undefined' && this.props.location.state.numberBack < 0 ? this.props.location.state.numberBack : -1;
        const { countEnter } = this.props.route;
        if (countEnter > 0) { // neu không phải enter link
          if (this.props.isNative) {
          } else {
            if (typeof this.props.router !== 'undefined' && typeof this.props.router.go !== 'undefined') {
              this.props.router.go(numberBack);
            }
          }
        } else { // nếu enter link
          const data = typeof this.props.location !== 'undefined' ?
            this.props.location :
            {
              pathname: '/',
              state: {
                type: 'home',
              }
            }
          ;
          if (this.props.isNative) {
            if (this._isHandleBack !== true) {
              this.props.route.setLocation(data);
            }
          } else {
            this.props.router.push(data);
          }
        }
      } else {
        this._showRipple();
      }
      this.setState({ openProduct });
    } else if (obj.type === 'buysuccess') {
      if (this.state.isOpenOrder === true) {
        this.setState({ isOpenOrder: false });
      }
      clearTimeout(this.toOpenOrder);
      this.toOpenOrder = setTimeout(() => {
        this.setState({ isOpenOrder: true });
        let timeout = obj.data.timeoutClose;
        if (timeout < 100) {
          timeout = 1500;
        }
        timeout = 1200;
        if (timeout > 0) {
          this.toOpenOrder = setTimeout(() => {
            this.setState({ isOpenOrder: false });
          }, timeout);
        }
      }, 600);
    } else {
      if (obj.isCheck === true) {
        return this.state.modalPrice.isOpen;
      }
      this.setState({ modalPrice: {
        isOpen: obj.isOpen,
        data: {
          type: obj.type,
          data: obj.data
        }
      }});
      if (obj.isOpen) {
        this._showRipple();
      }
    }
    
    requestAnimationFrame(() => {
      if (
        typeof this.refHeader !== 'undefined' &&
        this.refHeader !== null
      ) {
        // check co the back
        const arr = this._checkModal(['openProduct', 'modalPrice', 'modalSearch']);
        if (arr.length > 0 || showBack === true) {
          this.refHeader.onShowBack(true);
        } else {
          this.refHeader.onShowBack(false);
        }
      }
    });
    return;
  }
  getData = (obj) => {
    const output = {};
    for (let i = 0; i < obj.length; i++) {
      if (!obj.hasOwnProperty(i)) {
        continue;
      }
      const key = obj[i];
      const state = this.state[key];
      if (typeof state === 'undefined') {
        continue;
      }
      output[key] = state;
    }
    return output;
  }

  _loadSID = (status = 0) => {
    if (status === 3) {
      this.setState({ isDeviceId: 3});
    }
    this.props.dispatch(loadSID()).then((resultSID) => {
      if (resultSID.status !== 'success') {
        this.setState({ isDeviceId: 1});
        return;
      }
      this.props.dispatch(initializeWithUserCart());
      this._renewSID(10 * 600 * 1000);
      this.setState({ isDeviceId: 2 });
      this.handleprops(this.props);
    });
  }
  _renewSID = (timeActive) => {
    // 10 phut goi ham 1 lan, neu apiclient co thoi gian het han hon 10 phut thi bo qua
    clearTimeout(this.toRenewSID);
    this.toRenewSID = setTimeout(() => {
      this.props.dispatch(renewSID()).then(async result => {
        let time = 0;
        if (result.status !== 'success') {
          await this.props.dispatch(logout());
          this._loadSID(3);
          return;
        }

        if (
          typeof result.is_renew !== 'undefined' &&
          result.is_renew === true
        ) {
          this._loadSID(3);
          return;
        }
        if (
          typeof result.data === 'object' &&
          typeof result.data.time !== 'undefined'
        ) {
          time = result.data.time * 1000;
          if (isNaN(time) || time < 1) {
            time = 0;
          }
        }
        if (time < 100) {
          time = 60 * 1000;
        }
        this._renewSID(time);
      });
    }, timeActive);
  }
  _hanldeScroll = () => {
    clearTimeout(this._tohandleScroll);
    this._tohandleScroll = setTimeout(() => {
      const y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

      let val = 34 - y;
      if (val < 0) {
        val = 0;
      }
      if (this.state.heightNavUser !== val) {
        this.setState({ heightNavUser: val });
      }
    }, 20);
  }
  _checkModal = (arrList) => {
    const arr = this.getData(arrList) || {};
    const output = [];
    if (typeof arr['isOpenAccount'] !== 'undefined' && arr['isOpenAccount'] !== '') {
      output.push('isOpenAccount');
    }
    if (typeof arr['openProduct'] !== 'undefined' && arr['openProduct'] !== 0) {
      output.push('openProduct');
    }
    if (typeof arr['modalPrice'] !== 'undefined' && arr['modalPrice']['isOpen'] === true) {
      output.push('modalPrice');
    }
    if (typeof arr['modalSearch'] !== 'undefined' && arr['modalSearch']['isOpen'] === true) {
      output.push('modalSearch');
    }
    return output;
  }
  _hanldeProcessLogout = (rs) => {
    if (rs.status === 'success') {
      const type = typeof this.props.location !== 'undefined' &&
        typeof this.props.location.state !== 'undefined' && typeof this.props.location.state.type !== 'undefined' ?
        this.props.location.state.type : '';
      if (type !== '' && type !== 'category' && type !== 'hone') {
        const data = {
          pathname: '/',
          state: {
            id: 0,
            type: 'home',
          }
        };
        if (this.props.isDesktop === true) {
          this.props.router.push(data);
        } else {
          this.props.route.setLocation(data);
        }
      }
    }
  }
  onClickAll = (obj) => {
    let arrList = ['modalPrice', 'modalSearch', 'isOpenAccount'];
    if (typeof obj === 'undefined' || typeof obj.isCheckModal === 'undefined') {
      arrList.push('openProduct');
    }
    const arr = this._checkModal(arrList);
    if (
      typeof arr !== 'object' ||
      arr === null ||
      !Array.isArray(arr) ||
      arr.length < 1
    ) {
      return false;
    }
    if (arr.indexOf('isOpenAccount') !== -1) {
      this.setData({ type: 'openAccount', isOpen: false, data: '' });
      return true;
    }
    if (arr.indexOf('modalPrice') !== -1) {
      this.setData({ type: 'price', isOpen: false, data: {} });
      return true;
    }
    if (arr.indexOf('openProduct') !== -1) {
      this.setData({ type: 'product', data: 0 });
      return true;
    }
    if (arr.indexOf('modalSearch') !== -1) {
      this.setData({ type: 'search', isOpen: false, data: {} });
      return true;
    }
    return false;
  }
  _scrollTo = (elementScrollTop, to, duration) => {
    if (duration <= 0) {
      return;
    }
    const pos = elementScrollTop > window.innerHeight ? window.innerHeight : elementScrollTop;
    var difference = to - pos;
    var perTick = difference / duration * 10;

    setTimeout(() => {
      window.scrollTo(0, pos + perTick);
      // elementScrollTop = pos + perTick;
      if (pos + perTick <= to) {
        return;
      }
      this._scrollTo(pos + perTick, to, duration - 10);
    }, 10);
  }
  _onActionSiderBar = (isOpen) => {
    if (typeof document === 'undefined' || typeof document.body === 'undefined' || typeof elementClass === 'undefined') {
      return;
    }
    if (isOpen) {
      setTimeout(() => {
        elementClass(document.body).add('ReactModal__Body--open');
      }, 200)
      // document.body.classList.add('ReactModal__Body--open');
    } else {
      elementClass(document.body).remove('ReactModal__Body--open');
      // document.body.classList.remove('ReactModal__Body--open');
    }
  }
  _onOpenBack = () => {
    if (new Date().getTime() - this.lastTimeBack < 600 || this.lastTimeBack < 0) {
      return;
    }
    this.lastTimeBack = -1;
    // chan chuyen trang
    this._isHandleBack = true;
    const result = this.onClickAll();
    this._isHandleBack = false;
    if (result === true) {
      requestAnimationFrame(() => {
        const routes = this.props.routes;
        const isOpenBtnBack = Array.isArray(routes) && routes.length > 1 && (this.props.isNative === true && routes[routes.length - 1].key !== 'home' || routes[routes.length - 1].type !== 'Home') ? true : false;
        if (
          isOpenBtnBack === false &&
          this._checkModal(['openProduct', 'modalPrice', 'modalSearch']).length === 0
        ) {
          this.refHeader.onShowBack(false);
        } else {
          this.refHeader.onShowBack(true);
        }
      });
      this.lastTimeBack = new Date().getTime();
      return;
    }

    if (this.props.isNative === true) {
      this.props.onOpenBack().then(() => {
        this.lastTimeBack = new Date().getTime();
      });
      return true;
    }
    
    this.props.dispatch(abortAll()).then(result => {
      const numberBack = -1;
      if (typeof this.props.router !== 'undefined' && typeof this.props.router.go !== 'undefined') {
        if (this.props.route.isEnter()) {
          this.props.router.push({
            pathname: '/',
            state: {
              type: 'home'
            }
          });
        } else {
          this.props.router.go(numberBack);
        }
      }
      this.lastTimeBack = new Date().getTime();
    })
    return true;
  }
  _renderRippleView() {
    if (this.props.isNative !== true) {
      return;
    }
    const { height, width } = Dimensions.get('window');
    const { scaleValue, opacityValue } = this.state;

    return (
      <Animated.View
        style={{
          width,
          height,
          borderRadius: 5,
          transform: [{ scale: scaleValue }],
          opacity: opacityValue,
          backgroundColor: 'red',
        }}
      />
    );
  }
  _renderHeader = (iObj) => {
    const { isLogin } = iObj;
    const header = React.cloneElement(this.props.header, {
      setChild: (ele) => {
        this.refHeader = ele;
      },
      user: this.props.user,
      router: this.props.router,
      route: this.props.route,
      onClickAll: this.onClickAll,
      isDataServer: this.props.isDataServer,
      onOpenBack: this._onOpenBack,
      onSearch: (v) => {
        this.isOpenSidebar(v);
      },
      openCart: () => {
        this.openCart();
      },
      setData: this.setData,
      backgroundColor: "#ee0054",
      OpenMenu: () => {
        this.isOpenSidebar()
      },
      openUser: (val) => {
        this.setState({isOpenAccount: val})
      },
      srcImg: this.props.isNative ? require('../../../images/logo-menu.png') : 'http://img.umbala.vn/logo-menu.png',
      isNative: this.props.isNative,
      isDesktop: this.props.isDesktop,
    });
    
    
  }
  _renderMain = (childComponent) => {
    if (typeof this === 'undefined' || this.state.isDeviceId !== 2) {
      return <Div style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {this.props.isNative === true && <Div>
          {this.state.isDeviceId === 0 && <Span>Đang cài đặt thiết bị</Span>}
          {this.state.isDeviceId === 1 && <Span>Không thể cài đặt thiết bị</Span>}
          {this.state.isDeviceId === 3 && <Span>Đang cài đặt phiên làm việc</Span>}
        </Div> || <Div>
          {this.state.isDeviceId === 0 && <Span>Loading... (80%)</Span>}
          {this.state.isDeviceId === 1 && <Span>Can not install device ID</Span>}
          {this.state.isDeviceId === 3 && <Span>Loading... (90%)</Span>}
        </Div>}
      </Div>
    }
    let isLogin = true;
    if (typeof user === 'undefined' || typeof user.info === 'undefined' || typeof user.info.uid === 'undefined' || user.info.uid < 1) {
      isLogin = false;
    }
    if (typeof this.getInfo !== 'undefined' && typeof this.getInfo.device === 'undefined') {
      return (
        <Div><Span>Lỗi trang chủ</Span></Div>
      );
    }
    const children = <Div style={{ flex: 1 }}>
        {childComponent}
        {this._renderHeader({isLogin})}
      </Div>
    ;
    if (this._getInfo.type === 'app') {
      return (
        <Drawer
          ref={(ref) => { this._drawerMenu = ref; }}
          content={Menu}
          onChange={val => {
            this.setState({isOpenSidebar: val})
          }}
        >
          {this.state.orientation === 'landscape' &&
            <Div
              style={{ flex: 1, flexDirection: 'row' }}
              onLayout={ this.onLayoutChange }
            >
              <Div style={{ width: this._currentWidth }}>
                {children}
              </Div>
              <Div isScrollView><Div style={{width: this._maxWidth}}>{MenuRight}</Div></Div>
            </Div>
            ||
            <Drawer
              ref={(ref) => { this._drawer = ref; }}
              side="right"
              captureGestures={false}
              onChange={val => {
                this.setState({ isOpenSideCart: val })
              }}
              /*openDrawerOffset={0.001}
              rightSide={true}
              captureGestures={true}*/
              content={MenuRight}
            >
              <Div
                onLayout={ this.onLayoutChange }
                style={{ flex: 1 }}>
                {children}
              </Div>
            </Drawer>
          }
        </Drawer>
      );
    }
    if (this._getInfo.type === 'web') {

      return (
        <Div>
          {children}
        </Div>
      );
    }
    return children;
  }
}
export default GlobalMain;
