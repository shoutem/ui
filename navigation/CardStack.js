import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import NavigationBar from '../components/NavigationBar';

export default class CardStack extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    inlineNavigationBar: PropTypes.bool,
    navigationBar: PropTypes.node,
    style: PropTypes.object,
  };

  static defaultProps = {
    inlineNavigationBar: false,
  };

  render() {
    const {
      children,
      inlineNavigationBar,
      navigationBar,
      style,
    } = this.props;

    const containerStyle = [
      style.container,
      { flex: 1, flexDirection: 'column' },
    ];
    const sceneStyle = [style.scene, { flex: 1 }];

    return (
      <View style={containerStyle}>
        {!inlineNavigationBar && navigationBar}
        <View style={sceneStyle}>
          {children}
        </View>
        {inlineNavigationBar && navigationBar}
      </View>
    );
  }
}
