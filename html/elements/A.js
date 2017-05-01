import React from 'react';
import { Linking } from 'react-native';

import { ElementPropTypes, combineMappers, mapElementProps } from '../Html';
import { Inline } from './Inline';

class A extends React.Component {
  static propTypes = {
    ...ElementPropTypes,
    handleLinkPress: React.PropTypes.func,
    href: React.PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    const { href, handleLinkPress } = this.props;

    if (!handleLinkPress) {
      console.log('No "handleLinkPress" handle defined on the anchor element.');
      return;
    }

    handleLinkPress(href);
  }

  render() {
    // Because the anchor has dynamic display nature
    // it can not use the TouchableOpacity component to wrap the children.
    // The TouchableOpacity component can not be nested within the "Text" component.
    return <Inline {...this.props} onPress={this.onPress} />;
  }
}

function openLinkPress(Component) {
  return function (props) {
    function handleLinkPress(href) {
      Linking.openURL(href)
        .catch(err => console.log('An error occurred', err));
    }

    return <Component {...props} handleLinkPress={handleLinkPress} />;
  }
}

const EnhancedA = openLinkPress(A);

export default combineMappers(mapElementProps)(EnhancedA);
