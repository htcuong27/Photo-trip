import React, { Component, PropTypes } from 'react';
import 'cropperjs/dist/cropper.css';
import { canUseDOM } from 'exenv';
import shallowCompare from 'react-addons-shallow-compare';

import Cropper from 'react-cropper';

export default class CropperImageViewer extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    style: PropTypes.object,
    aspectRatio: PropTypes.number,
    guides: PropTypes.bool,
    crop: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shallowCompare.bind(this, this);
  }

  render() {
    if (!canUseDOM) {
      return null;
    }
    return (
      <div>
        <Cropper
          ref="cropper"
          src={this.props.src}
          style={this.props.style}
          crop={(e) => {
            console.log(e.detail);
            if (typeof e === 'undefined') {
              return;
            }
          }}
          guides={false}
          cropBoxMovable={false}
          cropBoxResizable={false}
          movable={true}
          dragMode={'move'}
          minCropBoxHeight={this.props.style.height}
          minCropBoxWidth={this.props.style.width}
          zoomable={false}
        />
        <button onTouchTap={() => { console.log(1); this.refs.cropper.rotate(90); }}>Rotate-Right</button>
        <button onTouchTap={() => { console.log(1); this.refs.cropper.rotate(270); }}>Rotate-Left</button>
        <button onTouchTap={() => { console.log(1); this.refs.cropper.scale(-1, 1); }}>horizontal</button>
        <button onTouchTap={() => { console.log(1); this.refs.cropper.scale(1, -1); }}>vertical</button>
        <button onTouchTap={() => { console.log(1); this.refs.cropper.reset(); }}>Re</button>
      </div>
    );
  }
}
