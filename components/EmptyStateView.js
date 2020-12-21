import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button } from './Button';
import { Icon } from './Icon';
import { Subtitle, Text } from './Text';
import { View } from './View';

class EmptyStateView extends PureComponent {
  static defaultProps = {
    retryButtonTitle: 'TRY AGAIN',
    icon: 'error',
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onRetry() {
    this.props.onRetry();
  }

  renderRetryButton() {
    const { retryButtonTitle } = this.props;

    // Show retry button at the bottom only if there is an onRetry action passed.
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
      <View {...this.props} styleName="vertical flexible h-center v-center">
        <View styleName="icon-placeholder">
          <Icon name={icon} />
        </View>

        <Subtitle styleName="h-center">{message}</Subtitle>

        {onRetry && this.renderRetryButton()}
      </View>
    );
  }
}

EmptyStateView.propTypes = {
  ...EmptyStateView.propTypes,
  onRetry: PropTypes.func,
  message: PropTypes.string,
  icon: PropTypes.string,
};

const StyledView = connectStyle('shoutem.ui.EmptyStateView')(EmptyStateView);

export { StyledView as EmptyStateView };
