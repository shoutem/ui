import React, { PureComponent } from 'react';
import { Share, Platform } from 'react-native';
import PropTypes from 'prop-types';
import autoBind from 'auto-bind/react';

import { connectStyle } from '@shoutem/theme';

import { Button } from './Button';
import { Icon } from './Icon';

const { string } = PropTypes;

/**
 * The ShareButton is a virtual component that wraps a button with a share icon.
 * It puts the sharing logic in one place. It's used in the navigation bar in the toolkit,
 * but it can be reused anywhere.
 *
 * It should have the style of its underlying button. That's why it's not connected to style
 * or animation.
 */
class ShareButton extends PureComponent {
  static propTypes = {
    // Animation name for share icon
    animationName: string,
    // Message to share
    message: string,
    // Title
    title: string,
    // Url to share
    url: string,
  };

  static defaultProps = {
    animationName: undefined,
    message: undefined,
    title: undefined,
    url: undefined,
  };

  constructor(props) {
    super(props);

    autoBind(this);
  }

  onShare() {
    const { message, title, url } = this.props;

    Share.share({
      title,
      // URL property isn't supported on Android, so we are
      // including it as the message for now.
      message: Platform.OS === 'android' ? url : message,
      url,
    });
  }

  render() {
    const { animationName } = this.props;

    return (
      <Button onPress={this.onShare}>
        <Icon name={Platform.OS === 'ios' ? 'share' : 'share-android'} animationName={animationName} />
      </Button>
    );
  }
}

const StyledShareButton = connectStyle('shoutem.ui.ShareButton', undefined, undefined,
  { virtual: true })(ShareButton);

export {
  StyledShareButton as ShareButton,
};
