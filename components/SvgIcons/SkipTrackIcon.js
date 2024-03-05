import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';

const SkipTrackIcon = ({ style }) => {
  const { container, icon = {} } = style;

  const {
    size = 0,
    color,
    strokeWidth = 0,
    triangleHeight = 0,
    triangleWidth = 0,
  } = icon;

  const halfTriangleHeight = triangleHeight / 2;

  return (
    <View style={container}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d={`M0 ${12 -
            halfTriangleHeight} l${triangleWidth} ${halfTriangleHeight} l-${triangleWidth} ${halfTriangleHeight} Z`}
          fill={color}
        />
        <Path
          d={`M${triangleWidth} ${12 - halfTriangleHeight} v${triangleHeight}`}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      </Svg>
    </View>
  );
};

SkipTrackIcon.propTypes = {
  style: PropTypes.object,
};

SkipTrackIcon.defaultProps = {
  style: {},
};

const StyledSkipTrackIcon = connectStyle('shoutem.ui.SkipTrackIcon')(
  SkipTrackIcon,
);
export { StyledSkipTrackIcon as SkipTrackIcon };
