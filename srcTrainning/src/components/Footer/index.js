import React from 'react';
import { connect } from 'react-redux';
import { formatMenu } from '../../utils/utils';
import Desktop from './Desktop';
import Mobile from './Mobile';
class GlobalFooter extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };
  render() {
    if (this.props.isDesktop) {
      return (
        <Desktop
          isDesktop={true}
          {...this.props}
        />
      );
    }
    return (
      <Mobile
        isDesktop={false}
        {...this.props}
      />
    );
  }
}
export default connect(
  state => {
    const { serverData } = state;
    const isDataServer = typeof serverData !== 'undefined' ? true : false;

    const menuFooter = isDataServer ? serverData.Global.menu.data['get-menu'][1].value : (state.Main.menuFooter && state.Main.menuFooter.value ? state.Main.menuFooter.value : {});
    return {
      isDataServer,
      menuFooter: formatMenu(menuFooter),
    };
  },
  (dispatch) => {
    return {
      dispatch,
    };
  },
) (GlobalFooter);
