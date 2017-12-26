import React, { Component } from 'react';
import config from '../../config';
import { map, range } from '../../utils/object';
import Div from '../Div/';
import Span from '../Span/';
import Icon from '../Icon/';
import Button from '../Button/';
import { ScrollView } from 'react-native';
import styles from './styles.scss';
import Link from '../Link/';
/*const Swiper = canUseDOM ? require('react-id-swiper') : undefined;*/

const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;

const SwipeableViews = isNative === true ? require('react-swipeable-views-native').default : require('react-swipeable-views').default;

import {  virtualize, bindKeyboard, autoPlay } from 'react-swipeable-views-utils';

export default class Swipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: props.initialPage || props.index || 0,
      widthRoot: 0,
      widthChild: 0,
    };
    this.currentScrollX = 0;
    this.aChilds = Array.isArray(props.children) ? props.children : [props.children]
  }
  componentDidMount() {
    this.setState({ scrollEnabled: false });
    this.aChilds = Array.isArray(this.props.children) ? this.props.children : [this.props.children]
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.initialPage !== nextProps.initialPage) {
      this.setState({
        index: nextProps.initialPage,
      });
    }
    if (this.props.children !== nextProps.children) {
      this.aChilds = Array.isArray(nextProps.children) ? nextProps.children : [nextProps.children]
    }
  }
  scrollTo = (x) => {
    this.scrollView.scrollTo({
        x,
        y: 0,
        animated: true,
    });
  }
  onBackNextSlide = (val) => {
    let currentScrollX = this.currentScrollX;
    if (val === true) {
      currentScrollX += this.widthSlide;
    } else {
      currentScrollX -= this.widthSlide;
    }
    let lamTron = Math.ceil(currentScrollX/this.widthSlide);
    if (lamTron >= this.aChilds.length - 1) {
      lamTron = 0;
    } else if (lamTron < 0) {
      lamTron = this.aChilds.length - 1;
    }
    const x = lamTron * this.widthSlide;
    this.currentScrollX = x;

    this.scrollTo(x);
  }
  handleChangeTabs = (index) => {
    this.setState({
      index,
    });
  };

  handleChangeIndex = (index) => {
    this.setState({
      index,
    });
  };
  render() {
    const {
      index,
    } = this.state;
    const style = this.props.style || {};
    
    if (typeof this.props.width !== 'undefined' &&
      typeof this.props.children === 'object' && typeof this.props.children[0] !== 'undefined') {
      if (this.state.widthChild < 1 || this.state.widthRoot < 1) {
        return (
        <Div
          style={style}
          onLayout={e => {
            const { layout } = e.nativeEvent;
            if (!isNaN(layout.width) && layout.width > 0 && layout.width !== this.state.widthRoot) {
              this.setState({widthRoot: layout.width});
            }
          }}
        >
          {React.cloneElement(this.props.children[0], {
            onLayout: (e) => {
              const { layout } = e.nativeEvent;
              if (typeof layout === 'undefined' || layout === null) {
                return;
              }
              if (!isNaN(layout.width) && layout.width > 0 && layout.width !== this.state.widthChild) {
                this.setState({widthChild: layout.width});
              }
            }
          })}
        </Div>
        );
      }
      const dataProps = {
        slideStyle: {
          width: this.state.widthChild,
          overflow: 'hidden',
        }
      }
      if (isNative) {
        dataProps.slideStyle.flex = 0;
      }
      const totalInRow = Math.ceil(this.state.widthRoot / this.state.widthChild);
      const maxTotal = Math.ceil(this.props.children.length / totalInRow);
      if (maxTotal === 1) {
        dataProps.disabled = true;
      }
      return (
        <Div style={style}>
          <SwipeableViews
            {...dataProps}
            style={{
              width: this.state.widthRoot
            }}
            index={this.state.index}
            hysteresis={0.1}
            ignoreNativeScroll={true}
            animateTransitions={true}

            resistance={true}
            onChangeIndex={(i) => {
              const totalInRow = Math.ceil(this.state.widthRoot / this.state.widthChild);
              if (i * totalInRow > this.props.children.length) {
                if ( i - 1 === 0) {
                  setTimeout(() => {
                    this.setState({index: 0});
                  }, 200)
                  // deny call back
                } else {
                  i = 0;
                }
              }
              this.setState({index: i});
              
              if (typeof this.props.onChangeIndex === 'function') {
                this.props.onChangeIndex(i);
              }
            }}
            enableMouseEvents={true}
          >
            {this.props.children}
          </SwipeableViews>
        </Div>
      );
    }
    if (isNative === true) {
      if (this.props.isProductRelative === true) {
        return (
          <Div style={{flex: 1}}>
            {this.props.isScrollEnabled === true &&
            <View>
              {this.state.scrollEnabled === true && <TouchableOpacity
                onPress={ () => {
                  this.onBackNextSlide(false);
                }}
                style={this.props.styleBack}
              >
                <Icon name="ios-arrow-back-outline" />
              </TouchableOpacity>}
              {this.state.scrollEnabled === true && <TouchableOpacity
                onPress={ () => {
                  this.onBackNextSlide(true);
                }}
                style={this.props.styleNext}
              >
                <Icon name="ios-arrow-forward-outline" />
              </TouchableOpacity>}
            </View>
            }
            <ScrollView 
              style={style}
              ref={ c => this.scrollView = c }
              horizontal={true}
              scrollEnabled={this.state.scrollEnabled}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              onScroll={(e) => {
                const currentScrollX = e.nativeEvent.contentOffset.x;
                clearTimeout(this._scrollTimeout);
                this._scrollTimeout = setTimeout(() => {
                  this.currentScrollX = currentScrollX;
                  this._scrollTimeout = null;
                }, 100);
              }}
            >
              <Div
                style={this.props.stylesLayout}
                onLayout={(e) => {
                  const width = e.nativeEvent.layout.width;
                  if (typeof this.aChilds !== 'undefined') {
                    this.widthSlide = width/this.aChilds.length;
                  }
                  this.setState({ scrollEnabled: true });
                }}>
                {typeof this.aChilds !== 'undefined' && this.aChilds.map((f) => {
                  return (
                    <Div style={{flex: 1}}>{f}</Div>
                  );
                })}
              </Div>
            </ScrollView>
          </Div>
        )
      }
      return (
        <Div style={{ flex: 1 }}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}          
          >
            <Div style={{ flexDirection: 'row' }}>
              {map(this.props.arrLabelTab, (label, i) => {
                return (
                  <Div
                    style={((this.props.isTab === true && typeof this.props.currentTab !== 'undefined') ? label.name_code === this.props.currentTab : index === i) ? styles.menuChildActive : styles.menuChild}
                    onClick={() => {
                      if (typeof this.props.handleChangeTabs === 'function') {
                        if (this.props.isAddress === true) {
                          this.props.handleChangeTabs(i);
                          this.handleChangeTabs(i);  
                          return;
                        }
                        this.props.handleChangeTabs(label.name_code);
                      } else {
                        this.handleChangeTabs(i);  
                      }
                    }}
                  >
                    <Span>
                      {this.props.isTab === true ? label.name : (i + 1)}
                    </Span>
                  </Div>
                )
              })}
            </Div>
          </ScrollView>
          {typeof this.props.arrContentTab !== 'undefined' &&
            <SwipeableViews
              index={index}
              disabled={true}
              /*onChangeIndex={(i) => {
                if (typeof this.props.handleChangeIndex === 'function') {
                  this.props.handleChangeIndex(i);
                } else {
                  this.handleChangeIndex(i);
                }
              }}*/
            >
              {map(this.props.arrContentTab, (content, i) => {
                return (
                  <Div style={[styles.slide, styles.slide1]}>
                    {content}
                  </Div>
                )
              })}
            </SwipeableViews>
          }
        </Div>
      )
    }
    
    if (typeof this.props.autoPlay !== 'undefined' && this.props.autoPlay === true &&
      typeof this.props.children === 'object' && typeof this.props.children[0] !== 'undefined') {
      const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
      return (
        <Div style={{flex: 1}}>
          <AutoPlaySwipeableViews
            interval={5000}
            index={index}
            onChangeIndex={(i) => {
              if (typeof this.props.handleChangeIndex === 'function') {
                this.props.handleChangeIndex(i);
              }
              this.handleChangeIndex(i);
            }}

            resistance={true}

            enableMouseEvents={true}
          >
            {this.props.children}
          </AutoPlaySwipeableViews>
          <Div style={{
            position: 'absolute',
            bottom: 18,
            left: 'calc(50% - ' + (this.props.children.length * 12) + 'px)',
            display: 'flex',
            flexDirection: 'row',
          }}>
          {map(range(this.props.children.length), i => 
            <Div
              style={[{
                backgroundColor: '#e4e6e7',
                height: 12,
                width: 12,
                borderRadius: 6,
                margin: 3,
              }, i === index ? {backgroundColor: '#319fd6'} : {}]}
              index={i}
              active={i === index}
              onClick={() => this.handleChangeIndex(i)}
            />
          )}
          </Div>
        </Div>
      );
    }
    return (
      <Div style={{ flex: 1 }}>
        <Div style={styles.tab}>
          {(this.props.isTabChild !== true && this.props.isAddress !== true) ? map(this.props.arrLabelTab, (label, i) => {
            return (
              <Link
                route={this.props.route}
                to={{
                  pathname: '/' + ((typeof this.props.info !== 'undefined' && typeof this.props.info.username !== 'undefined') ?
                    '@' + this.props.info.username + '/' + label.name_code : ''),
                  state: {
                    id: typeof this.props.info !== 'undefined' ? this.props.info.id : '',
                    type: 'profile' + label.name_code,
                  }
                }}
                style={((this.props.isTab === true && typeof this.props.currentTab !== 'undefined') ? label.name_code === this.props.currentTab : index === i) ? styles.menuChildActive : styles.menuChild}
                onClick={() => {
                  if (typeof this.props.handleChangeTabs === 'function') {
                    this.props.handleChangeTabs(label.name_code);
                  } else {
                    this.handleChangeTabs(i);  
                  }
                }}
              >
                <Span>
                  {label.name}
                </Span>
              </Link>
            )
          }) :
          map(this.props.arrLabelTab, (label, i) => {
            return (
              <Div
                style={index === i ? styles.menuChildActive : styles.menuChild}
                onClick={() => {
                  if (typeof this.props.handleChangeTabs === 'function') {
                    if (this.props.isAddress === true) {
                      this.props.handleChangeTabs(i);
                      this.handleChangeTabs(i);  
                      return;
                    }
                    this.props.handleChangeTabs(label.name_code);
                  } else {
                    this.handleChangeTabs(i);  
                  }
                }}
              >
                <Span>
                  {this.props.isTab === true ? label.name : (i + 1)}
                </Span>
              </Div>
            )
          })
        }
        </Div>
        {typeof this.props.arrContentTab !== 'undefined' &&
          <SwipeableViews
            index={index}
            disabled={true}
            slideCount={5}
            /*onChangeIndex={(i) => {
              if (typeof this.props.handleChangeIndex === 'function') {
                this.props.handleChangeIndex(i);
              } else {
                this.handleChangeIndex(i);
              }
            }}*/
          >
            {map(this.props.arrContentTab, (content, i) => content)}
          </SwipeableViews>
        }
      </Div>
    )
  }
}
