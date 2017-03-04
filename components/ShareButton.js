import React, {
  Component,
} from 'react';

import { Alert } from 'react-native';

import Share from 'react-native-share';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

import { Button } from './Button';
import { Icon } from './Icon';

const USER_CANCELLED_ERROR = 'User did not share';

const { func, string } = React.PropTypes;

const showErrorMessage = (message) => {
  Alert.alert(
    'Sharing error',
    message,
  );
};

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
      if (onError) {
        return onError(error);
      } else if (error.error === USER_CANCELLED_ERROR) {
        return;
      }
      showErrorMessage(error.error);
    });
  }

  render() {
    const { animationName } = this.props;

    return (
      <Button
        virtual
        onPress={this.onShare}
      >
        <Icon name="share" animationName={animationName} />
      </Button>
    );
  }
}

const AnimatedShareButton = connectAnimation(ShareButton);
const StyledShareButton = connectStyle('shoutem.ui.ShareButton')(AnimatedShareButton);

export {
  StyledShareButton as ShareButton,
};
