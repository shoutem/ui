import React, { PureComponent } from 'react';
import { View, Dimensions } from 'react-native';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

class NavigationBar extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      windowWidth: Dimensions.get('window').width,
    };
  }

  componentDidMount() {
    this.subscription = Dimensions.addEventListener('change', this.onDimensionsChange);
  }

  componentWillUnmount() {
    this.subscription?.remove();
  }

  onDimensionsChange = ({ window }) => {
    this.setState({ windowWidth: window.width });
  };

  render() {
    const { style, styleName, leftComponent, centerComponent, rightComponent } = this.props;
    const { windowWidth } = this.state;

    const isInline = _.includes(styleName, 'inline');
    const containerStyle = isInline
      ? [style.container, { width: windowWidth }]
      : style.container;

    const centerStyle = isInline
      ? [style.centerComponent, { position: 'absolute', left: 0, right: 0 }]
      : style.centerComponent;

    return (
      <View style={containerStyle}>
        <View style={style.leftComponent}>{leftComponent}</View>
        <View style={centerStyle}>{centerComponent}</View>
        <View style={style.rightComponent}>{rightComponent}</View>
      </View>
    );
  }
}

NavigationBar.propTypes = {
  leftComponent: PropTypes.node,
  centerComponent: PropTypes.node,
  rightComponent: PropTypes.node,
  style: PropTypes.object,
  styleName: PropTypes.string,
};

export default connectAnimation(connectStyle('shoutem.ui.NavigationBar')(NavigationBar));
