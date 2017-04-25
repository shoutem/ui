import React from 'react';
import { ElementPropTypes, mapComponentProps, mapElementProps } from '../components/RichMedia';
import { Inline } from './Inline';
import { connectStyle } from '@shoutem/theme';

class A extends React.Component {
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
    // Because the "A" has dynamic display nature
    // it can not use the TouchableOpacity component to wrap children.
    // The TouchableOpacity component can not be nested within the "Text" component.
    return <Inline {...this.props} onPress={this.onPress} />;
  }
}

A.propTypes = {
  ...ElementPropTypes,
};

export default connectStyle('shoutem.ui.RichMedia.a')(mapComponentProps(mapElementProps)(A));
