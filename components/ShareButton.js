import React, {
  Component,
} from 'react';

import Share from 'react-native-share';

import { Button } from './Button';
import { Icon } from './Icon';

import { connectStyle } from '@shoutem/theme';
import { connectAnimation } from '@shoutem/animation';

const onShare = (title, message, url) =>
  Share.open({
    title,
    message,
    url,
  }).catch((error) => {
    console.log(error);
  });

const { string } = React.PropTypes;

class ShareButton extends Component {
  static propTypes = {
    // Animation name for share icon
    iconAnimation: string,
    // Message to share
    message: string,
    // Title
    title: string,
    // Url to share
    url: string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { iconAnimation, title, message, url } = this.props;

    return (
      <Button onPress={() => onShare(title, message, url)}>
        <Icon name="share" animationName={iconAnimation} />
      </Button>
    );
  }
}

const AnimatedShareButton = connectAnimation(ShareButton);
const StyledShareButton = connectStyle('shoutem.ui.ShareButton')(AnimatedShareButton);

export {
  StyledShareButton as ShareButton,
};
