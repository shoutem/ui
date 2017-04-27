import React from 'react';
import { connectStyle } from '@shoutem/theme';

import { ElementPropTypes, mapComponentProps, mapElementProps } from '../Html';
import { Inline } from './Inline';

class A extends React.Component {
  static propTypes = {
    ...ElementPropTypes,
    onLinkPress: React.PropTypes.func,
    href: React.PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    const { href, onLinkPress } = this.props;

    if (!onLinkPress) {
      console.log('No "onLinkPress" handle defined on the "a" element.');
      return;
    }

    onLinkPress(href);
  }

  render() {
    // Because the anchor has dynamic display nature
    // it can not use the TouchableOpacity component to wrap the children.
    // The TouchableOpacity component can not be nested within the "Text" component.
    return <Inline {...this.props} onPress={this.onPress} />;
  }
}

export default connectStyle('shoutem.ui.Html.a')(mapComponentProps(mapElementProps)(A));
