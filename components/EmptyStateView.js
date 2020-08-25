import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'autoBind';

import { connectStyle } from '@shoutem/theme';

import { Icon } from './Icon';
import { View } from './View';
import { Button } from './Button';
import { Subtitle, Text } from './Text';

class EmptyStateView extends PureComponent {
  static propTypes = {
    ...EmptyStateView.propTypes,
    onRetry: PropTypes.func,
    message: PropTypes.string,
    icon: PropTypes.string,
    retryButtonTitle: PropTypes.string,
  };

  static defaultProps = {
    onRetry: undefined,
    message: undefined,
    icon: 'error',
    retryButtonTitle: 'TRY AGAIN',
  };

  constructor(props) {
    super(props);

    autoBind(this);
  }

  onRetry() {
    const { onRetry } = this.props;

    onRetry();
  }

  renderRetryButton() {
    const { retryButtonTitle } = this.props;

    // Show retry button at the bottom only if
    // there is a onRetry action passed.
    return (
      <View styleName="horizontal anchor-bottom">
        <Button styleName="full-width" onPress={this.onRetry}>
          <Text>{retryButtonTitle}</Text>
        </Button>
      </View>
    );
  }

  render() {
    const { icon, message, onRetry } = this.props;

    return (
      <View
        {...this.props}
        styleName="vertical flexible h-center v-center"
      >
        <View styleName="icon-placeholder">
          <Icon name={icon} />
        </View>

        <Subtitle styleName="h-center">{message}</Subtitle>

        {onRetry && this.renderRetryButton()}
      </View>
    );
  }
}

const StyledView = connectStyle('shoutem.ui.EmptyStateView')(EmptyStateView);

export {
  StyledView as EmptyStateView,
};
