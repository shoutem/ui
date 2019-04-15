import React, { PureComponent } from 'react';

import { connectStyle } from '@shoutem/theme';

import { View } from './View';
import { Spinner } from './Spinner';

/**
 * Renders a loading indicator (spinner) that fits into available space (container)
 */
class LoadingIndicator extends PureComponent {
  render() {
    return (
      <View styleName="flexible vertical v-center">
        <View styleName="horizontal h-center">
          <Spinner />
        </View>
      </View>
    );
  }
}

const StyledLoadingIndicator = connectStyle('shoutem.ui.LoadingIndicator')(LoadingIndicator);

export {
  StyledLoadingIndicator as LoadingIndicator,
};
