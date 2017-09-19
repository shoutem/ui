import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

import { Alert } from 'react-native';

import Share from 'react-native-share';

import { connectStyle } from '@shoutem/theme';

import { Button } from './Button';
import { Icon } from './Icon';

const USER_CANCELLED_ERROR = 'User did not share';

const { func, string } = PropTypes;

const showErrorMessage = (error) => {
  if (error.error === USER_CANCELLED_ERROR) {
    return;
  }

  Alert.alert(
    'Sharing error',
    error.error,
  );
};

/**
 * The ShareButton is a virtual component that wraps a button with a share icon.
 * It puts the sharing logic in one place. It's used in the navigation bar in the toolkit,
 * but it can be reused anywhere.
 *
 * It should have the style of its underlying button. That's why it's not connected to style
 * or animation.
 */
class ShareButton extends Component {
  static propTypes = {
    // Animation name for share icon
    animationName: string,
    // Message to share
    message: string,
    // Called when there was a sharing error
    onError: func,
    // Title
    title: string,
    // Url to share
    url: string,
  };

  static defaultProps = {
    onError: showErrorMessage,
  };

  constructor(props) {
    super(props);

    this.onShare = this.onShare.bind(this);
  }

  onShare() {
    const { onError, title, message, url } = this.props;

    Share.open({
      title,
      message,
      url,
    }).catch((error) => {
      onError(error);
    });
  }

  render() {
    const { animationName } = this.props;

    return (
      <Button
        onPress={this.onShare}
      >
        <Icon name="share" animationName={animationName} />
      </Button>
    );
  }
}

const StyledShareButton = connectStyle('shoutem.ui.ShareButton', undefined, undefined,
  { virtual: true })(ShareButton);

export {
  StyledShareButton as ShareButton,
};
