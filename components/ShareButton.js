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

const showErrorMessage = (error) => {
  if (error.error === USER_CANCELLED_ERROR) {
    return;
  }

  Alert.alert(
    'Sharing error',
    error.error,
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

const AnimatedShareButton = connectAnimation(ShareButton);
const StyledShareButton = connectStyle('shoutem.ui.ShareButton', {}, () => {},
  { virtual: true })(AnimatedShareButton);

export {
  StyledShareButton as ShareButton,
};
