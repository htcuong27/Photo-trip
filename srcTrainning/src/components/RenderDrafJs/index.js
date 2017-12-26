import React, { Component } from 'react';
import Div from '../../components/Div/';
import config from '../../config';
const isNative = typeof config.type !== 'undefined' && config.type === 'app' ? true : false;

const Editor = require('draft-js').Editor;
const EditorState = require('draft-js').EditorState;
const convertFromRaw = require('draft-js').convertFromRaw;
const RNDraftJSRender = require('react-native-draftjs-render');


const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

const customStyles = {
  unstyled: {
    fontSize: 18,
    fontWeight: 'normal',
    letterSpacing: -0.75,
    lineHeight: 32,
    marginBottom: 21,
  },
  link: {
    color: '#c4170c',
    fontWeight: 'bold',
    textDecorationLine: 'none',
  },
  unorderedListItemContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  unorderedListItemBullet: {
    marginRight: 18,
    position: 'relative',
    top: 14,
    width: 6,
    height: 6,
    alignSelf: 'flex-start',
  },
  'unordered-list-item': {
    fontSize: 18,
    lineHeight: 32,
    alignSelf: 'flex-start',
    flex: 1,
  },
  orderedListContainer: {
    marginBottom: 16,
  },
  orderedListItemNumber: {
    fontSize: 18,
    lineHeight: 32,
    marginRight: 11,
    alignSelf: 'flex-start',
    color: '#c4170c',
  },
  'ordered-list-item': {
    alignSelf: 'flex-start',
    fontSize: 18,
    lineHeight: 32,
    flex: 1,
  },
  'code-block': {
    backgroundColor: '#e2e2e2',
  },
  blockquote: {
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 33,
    paddingTop: 24,
    marginBottom: 24,
    fontSize: 33,
    letterSpacing: -2,
  },
  viewAfterList: {
    marginBottom: 32,
  },
};

class RenderDrafJs extends Component {
  constructor(props) {
    super(props);
    let editorState;
    if (typeof EditorState !== 'undefined') {
      editorState = EditorState.createEmpty();
    }
    this.state = {
      editorState,
      val: '',
      listLinkAdd: [],
      listProduct: [],
      dataLink: '',
    };
  }
  render() {
    if (this.props.dataRender.indexOf('{"blocks":[{"entityRanges"') === -1 && typeof this.props.dataRender === 'string') {
      return (
        <Div>
          <Div isText style={{marginTop: 5}}>{this.props.dataRender}</Div>
        </Div>
      )
    }
    if (isNative === true && typeof RNDraftJSRender !== 'undefined') {
      let insertContent = this.props.dataRender.replace(/&quot;/g, '"');
      const dataRender = typeof this.props.dataRender !== 'undefined' ? JSON.parse(insertContent) : {};
      return (
        <RNDraftJSRender
          contentState={dataRender}
          customStyles={customStyles}
        />
      )
    }
    return (
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
        readOnly={true}
        customStyleMap={customStyles}
      />
    );
  }
}

export default RenderDrafJs;
