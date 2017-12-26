import React, { Component, PropTypes } from 'react';
import config from '../../config';
import { convertStyle, objectCompare } from '../../utils/utils';

const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Animated } from 'react-native';

export default class Div extends Component {

  constructor(props) {
    super(props);
    this.refDiv = undefined;
    this.scrollTo = this._scrollTo.bind(this);
    this.animated = false;
    if (isNative === true && props.animated === true) {
      this.animated = true;
    }
    this._pos = {};
    this._isLoaded = false;
    this._handleProps = (props) => {
      if (isNative === true || typeof props === 'undefined') {
        return;
      }
      if (this._isLoaded === true) {
        return;
      }
      if (typeof this.refDiv !== 'undefined' && typeof props.onLayout === 'function') {
        this._isLoaded = true;
        const pos = this._getLayout();
        if (pos.y >= this._pos - 1 && pos.y <= this._pos + 1) {
          pos.y = this._pos.y;
        }
        this._pos = pos;
        props.onLayout({
          nativeEvent: {
            layout: pos,
          }
        })
      }
    }
    this._handleProps(props);
  }
  componentDidMount() {
    this._handleProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (typeof this.props.onLayout !== 'function') {
      return;
    }
    this._denyUpdateLayout = true;
  }
  componentDidUpdate(prevProps, prevState) {
    if (isNative === true) {
      return;
    }

    if (typeof this.props.onLayout !== 'function') {
      return;
    }
    if (this._denyUpdateLayout === true) {
      this._denyUpdateLayout = false;
      return;
    }
    // loi voi Modal
    return;
    clearTimeout(this._toLayout);
    this._toLayout = setTimeout(() => {
      if (typeof this.refDiv === 'undefined' || this.refDiv === null) {
        return;
      }
      const pos = this._getLayout();
      if (pos.y >= this._pos - 1 && pos.y <= this._pos + 1) {
        pos.y = this._pos.y;
      }
      if (objectCompare(this._pos, pos)) {
        return;
      }
      this._pos = pos
      this.props.onLayout({
        nativeEvent: {
          layout: pos,
        }
      })
    }, 20);
  }
  _getLayout = (arr) => {
    const layout = this.refDiv.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;

    const scrollbarWidth = typeof arr === 'object' && arr !== null && arr.length > 0 && arr.indexOf('width') > -1 ? (typeof window !== 'undefined' ? (window.innerWidth - document.body.clientWidth) : 0) : 0;
    const pos = {
      width: Math.round(layout.width) + scrollbarWidth, //
      height: Math.round(layout.height),
      x: Math.round(layout.left + scrollLeft),
      y: Math.round(layout.top + scrollTop), // lay current scrollbar cong vao
    }
    return pos;
  }
  getBoundingClientRect = (arr) => new Promise((resolve) => {
    if (typeof this.refDiv === 'undefined') {
      resolve({});
    }
    if (isNative === true) {
      this.refDiv.measure((fx, fy, width, height, px, py) => {
        const pos = {
          width: Math.round(width),
          height: Math.round(height),
          x: Math.round(px),
          y: Math.round(py),
        }
        resolve(pos);
      })
      return;
    }
    const pos = this._getLayout(arr);
    if (pos.y >= this._pos - 1 && pos.y <= this._pos + 1) {
      pos.y = this._pos.y;
    }

    resolve(pos);
  })
  _onScroll = (y) => {
    const pos = (this.height || 0) - (this.heightScroll || 0);

    const percent = ( y / pos );
    this.props.route.callEventListener('scroll', {percent: Math.floor(percent * 100, 2), y: this.height * percent});
  }
  _scrollTo = (height) => {
    if (typeof this.refDiv !== 'undefined') {
      if (isNative === true) {
        if(this.animated) {
          return this.refDiv._component.scrollTo({ y: height });
        }
        this.refDiv.scrollTo({ y: height })
      } else {
        this.refDiv.scrollTop += height;  
      }
    }
  }
  _onLayout = (e) => {
    const { layout } = e.nativeEvent;
    this.layout = layout;
    if (typeof this.props.onLayout !== 'undefined') {
      this.props.onLayout(e);
    }
  }
  render() {
    if (isNative === true) {
      const style = this.props.style || {};
      if (typeof this.props.onClick === 'function') {
        return (
          <TouchableOpacity
            ref={(ele) => this.refDiv = ele}
            onLayout={this._onLayout}
            onPress={() => {
              this.props.onClick();
            }}
            style={style}
          >
            {this.props.children}
          </TouchableOpacity>
        );
      }
      if (this.props.isScrollView === true) {
        const contentContainerStyle = this.props.contentContainerStyle || {};
        const keyboardShouldPersistTaps = typeof this.props.keyboardShouldPersistTaps !== 'undefined' ? this.props.keyboardShouldPersistTaps : undefined;
        const scrollEnabled = typeof this.props.scrollEnabled !== 'undefined' ? this.props.scrollEnabled : undefined;
        const scrollEventThrottle = typeof this.props.scrollEventThrottle !== 'undefined' ? this.props.scrollEventThrottle : undefined;
        
        if (this.animated === true) {
          return (
            <Animated.ScrollView
              horizontal={this.props.horizontal ? true : false}
              scrollEnabled={scrollEnabled}
              scrollEventThrottle={scrollEventThrottle}
              // showsHorizontalScrollIndicator={this.props.horizontal ? false : true}
              keyboardShouldPersistTaps={keyboardShouldPersistTaps}
              ref={(ele) => this.refDiv = ele}
              style={style}
              contentContainerStyle={contentContainerStyle}
              onScroll={this.props.onScroll}
              onLayout={this._onLayout}
              onContentSizeChange={(width, height) => {
                if (typeof this.props.onContentSizeChange !== 'undefined') {
                  this.props.onContentSizeChange(width, height);
                }
              }}
            >
              {this.props.children}
            </Animated.ScrollView>
          );
        }
        const dataProps = {};
        if (typeof this.props.refreshControl !== 'undefined') {
            dataProps.refreshControl = <RefreshControl refreshing={this.props.refreshControl.refreshing} onRefresh={this.props.refreshControl.onRefresh} />
        }
        
        return (
          <ScrollView
            {...dataProps}
            scrollEnabled={scrollEnabled}
            scrollEventThrottle={scrollEventThrottle}
            horizontal={this.props.horizontal ? true : false}
            showsHorizontalScrollIndicator={this.props.horizontal ? false : true}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            ref={(ele) => this.refDiv = ele}
            style={style}
            contentContainerStyle={contentContainerStyle}
            onScroll={(e) => {
              if (typeof this.props.onScroll === 'function') {
                this.props.onScroll(e);
              }
            }}
            onLayout={this._onLayout}
            onContentSizeChange={(width, height) => {
              if (typeof this.props.onContentSizeChange !== 'undefined') {
                this.props.onContentSizeChange(width, height);
              }
            }}
          >
            {this.props.children}
          </ScrollView>
        );
      }
      if (this.props.isText === true) {
        return (
          <Text ref={(ele) => this.refDiv = ele} style={style} numberOfLines={this.props.numberOfLines}>{this.props.children}</Text>
        );
      }

      const onStartShouldSetResponderCapture = typeof this.props.onStartShouldSetResponderCapture !== 'undefined' ? this.props.onStartShouldSetResponderCapture : null;

      if (this.animated === true) {
        return (
          <Animated.View
            pointerEvents={this.props.pointerEvents}
            // accessibilityComponentType={this.props.accessibilityComponentType}          
            accessibilityLabel={this.props.accessibilityLabel}          
            // accessibilityTraits={this.props.accessibilityTraits}          
            accessible={this.props.accessible}          
            onResponderGrant={this.props.onResponderGrant}          
            onResponderMove={this.props.onResponderMove}          
            onResponderRelease={this.props.onResponderRelease}          
            onResponderTerminate={this.props.onResponderTerminate}          
            onResponderTerminationRequest={this.props.onResponderTerminationRequest}          
            onStartShouldSetResponder={this.props.onStartShouldSetResponder}
            ref={(ele) => this.refDiv = ele}
            onLayout={this._onLayout}
            onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
            style={style}
          >{this.props.children}</Animated.View>
        );
      }
      return (
        <View
          shouldRasterizeIOS={this.props.shouldRasterizeIOS}
          renderToHardwareTextureAndroid={this.props.renderToHardwareTextureAndroid}
          pointerEvents={this.props.pointerEvents}
          // accessibilityComponentType={this.props.accessibilityComponentType}          
          accessibilityLabel={this.props.accessibilityLabel}          
          // accessibilityTraits={this.props.accessibilityTraits}          
          accessible={this.props.accessible}          
          onResponderGrant={this.props.onResponderGrant}          
          onResponderMove={this.props.onResponderMove}          
          onResponderRelease={this.props.onResponderRelease}          
          onResponderTerminate={this.props.onResponderTerminate}          
          onResponderTerminationRequest={this.props.onResponderTerminationRequest}          
          onStartShouldSetResponder={this.props.onStartShouldSetResponder}
          ref={(ele) => this.refDiv = ele}
          onLayout={this._onLayout}
          onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
          style={style}
        >{this.props.children}</View>
      );
    }
    
    const dataWebProps = convertStyle(this.props.style);
    /*if (this.props.isScrollView === true) {
      if (typeof dataWebProps.style === 'undefined') {
        dataWebProps.style = {};
      }
      dataWebProps.style.overflow = 'auto';
    }*/
    return (
      <div
        ref={(ele) => this.refDiv = ele}
        onClick={() => {
          if (typeof this.props.onClick !== 'undefined') {
            this.props.onClick();
          }
        }}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        {...dataWebProps}
        title={this.props.title}
        >
        {this.props.children}
      </div>
    );
  }
}
