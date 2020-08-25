import React, { PureComponent } from 'react';
import { Text as RNText } from 'react-native';

import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

class Text extends PureComponent {
  static propTypes = {
    ...RNText.props,
  };

  render() {
    return (
      <RNText {...this.props} />
    );
  }
}

const AnimatedText = connectAnimation(Text);
const StyledText = connectStyle('shoutem.ui.Text')(AnimatedText);
const Heading = connectStyle('shoutem.ui.Heading')(AnimatedText);
const Title = connectStyle('shoutem.ui.Title')(AnimatedText);
const Subtitle = connectStyle('shoutem.ui.Subtitle')(AnimatedText);
const Caption = connectStyle('shoutem.ui.Caption')(AnimatedText);

export {
  StyledText as Text,
  Heading,
  Title,
  Subtitle,
  Caption,
};
