import React, { useMemo } from 'react';
import { View } from 'react-native';
import { G, Svg } from 'react-native-svg';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import AnimatedProgressRing from './AnimatedProgressRing';
import ProgressRing from './ProgressRing';

/**
 * Component rendering given number of rings, which are filled depending on given
 * percentage values.
 * It is possible to either specify definite color for each ring by passing ring.color prop,
 * or give and array of ring.progressColors and component will then interpolate between given
 * colors, based on given percentage value.
 */
const ProgressRings = ({ rings, size, rotation, children, style }) => {
  const renderRings = useMemo(
    () =>
      rings.map((ring, index) => {
        const ResolvedRingComponent = ring.progressColors
          ? AnimatedProgressRing
          : ProgressRing;

        return (
          <ResolvedRingComponent
            key={ring.id}
            index={index}
            size={size}
            {...ring}
          />
        );
      }),
    [rings, size],
  );

  return (
    <View style={style.container}>
      <Svg width={size} height={size}>
        <G rotation={rotation} originX={size / 2} originY={size / 2}>
          {renderRings}
        </G>
      </Svg>
      {children && <View style={style.childrenContainer}>{children}</View>}
    </View>
  );
};

ProgressRings.propTypes = {
  rings: PropTypes.arrayOf(
    // Omitting color to stop errors, but implementation has to define either color or progressColors,
    // depending on which component they're using - ProgressRing or AnimatedProgressRing, respectively.
    PropTypes.shape({ ..._.omit(ProgressRing.propTypes, ['index', 'color']) }),
  ).isRequired,
  children: PropTypes.func,
  rotation: PropTypes.number,
  size: PropTypes.number,
  style: PropTypes.object,
};

ProgressRings.defaultProps = {
  children: undefined,
  size: 80,
  rotation: 0,
  style: {},
};

export default connectStyle('shoutem.ui.ProgressRings')(ProgressRings);
