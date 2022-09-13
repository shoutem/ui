import React, { PureComponent } from 'react';
import { Platform, Share } from 'react-native';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button } from './Button';
import { Icon } from './Icon';

/**
 * The ShareButton is a virtual component that wraps a button with a share icon.
 * It puts the sharing logic in one place. It's used in the navigation bar in the toolkit,
 * but it can be reused anywhere.
 *
 * It should have the style of its underlying button. That's why it's not connected to style
 * or animation.
 */
class ShareButton extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onShare() {
    const { title, message, url } = this.props;

    if (!url) {
      // eslint-disable-next-line no-console
      console.warn('Share URL not specified.');
      return null;
    }

    return Share.share({
      title,
      // URL property isn't supported on Android, so we are
      // including it as the message for now.
      message: Platform.OS === 'android' ? url : message,
      url,
    });
  }

  render() {
    const { animationName, iconProps, ...otherProps } = this.props;

    return (
      <Button onPress={this.onShare} {...otherProps}>
        <Icon
          name={Platform.OS === 'ios' ? 'share' : 'share-android'}
          animationName={animationName}
          {...iconProps}
        />
      </Button>
    );
  }
}

ShareButton.propTypes = {
  // Animation name for share icon
  animationName: PropTypes.string,
  // Additional props for Icon component
  iconProps: PropTypes.object,
  // Message to share
  message: PropTypes.string,
  // Title
  title: PropTypes.string,
  // Url to share
  url: PropTypes.string,
};

ShareButton.defaultProps = {
  animationName: undefined,
  iconProps: undefined,
  message: undefined,
  title: undefined,
  url: undefined,
};

const StyledShareButton = connectStyle(
  'shoutem.ui.ShareButton',
  undefined,
  undefined,
  { virtual: true },
)(ShareButton);

export { StyledShareButton as ShareButton };
