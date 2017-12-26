import React, { Component } from 'react';
import config from '../../config';
import ModalBox from 'react-native-modalbox';
import Modal from 'react-modal';
import { Modal as ModalRN } from 'react-native';
const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;

export default class modal extends Component {
  close = () => {
    if (typeof this._root === 'undefined' || this._root === null) {
      return;
    }
    this._root.close();
  }
  render() {
    if (isNative === true) {
      const style = this.props.style || {};
      if (this.props.isModalNative === true) {
        return (
          <ModalRN
            style={style}
            animationType={"slide"}
            transparent={true}
            visible={this.props.viewModal}
            pointerEvents={this.props.pointerEvents}
            onRequestClose={() => this.props.onRequestClose && this.props.onRequestClose()}
          >
            {this.props.children}
          </ModalRN>
        )
      }
      return (
        <ModalBox
          ref={ele => this._root = ele}
          swipeThreshold={250}
          swipeArea={250}
          animationDuration={400}
          style={style}
          position={this.props.position}
          pointerEvents={this.props.pointerEvents}
          animationType={"slide"}
          transparent={true}
          isOpen={this.props.viewModal}
          backdropOpacity={this.props.backdropOpacity}
          onClosed={() => this.props.onRequestClose && this.props.onRequestClose()}
          onOpened={() => this.props.onOpened && this.props.onOpened()}
        >
          {this.props.children}
        </ModalBox>
      );
    }
    // sua react-modal them bodyOpenClassName
    /* sua ModalPortal
      focusContent: function() {
      if (this.props.disabledFocus === true) {
        return;
      }

      them:
      onScroll: this.props.onScroll,
    */
    const style = this.props.style || '';
    return (
      <Modal
        isOpen={this.props.viewModal}
        style={style}
        bodyOpenClassName={this.props.bodyOpenClassName}
        onRequestClose={() => this.props.onRequestClose && this.props.onRequestClose()}
        onAfterOpen={() => this.props.onOpened && this.props.onOpened()}
        onScroll={this.props.onScroll}
      >
        {this.props.children}
      </Modal>
    );
  }
}
