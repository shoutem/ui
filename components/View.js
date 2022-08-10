import React, { PureComponent } from 'react';
import { View as RNView } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import PropTypes from 'prop-types';
import { connectAnimation } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';
import { LinearGradient } from './LinearGradient';

class View extends PureComponent {
  render() {
    const { children, style } = this.props;
    const { backgroundGradient, ...viewStyle } = style;

    return (
      <RNView {...this.props} style={viewStyle}>
        {!!backgroundGradient && (
          <LinearGradient styleName="fill-parent" style={backgroundGradient} />
        )}
        {children}
      </RNView>
    );
  }
}

View.propTypes = {
  ...ViewPropTypes,
  style: PropTypes.object.isRequired,
};

const AnimatedView = connectAnimation(View);
const StyledView = connectStyle('shoutem.ui.View')(AnimatedView);

export { StyledView as View };
