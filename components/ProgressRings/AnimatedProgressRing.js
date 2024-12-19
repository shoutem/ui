/* eslint-disable react/require-default-props */
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useColorInterpolation } from '../../hooks';
import { DEFAULT_PROGRESS_COLORS, PROGRESS_RING_DEFAULT_PROPS } from './const';
import ProgressRing from './ProgressRing';

const AnimatedProgressRing = props => {
  const {
    percentage = PROGRESS_RING_DEFAULT_PROPS.percentage,
    progressColors = DEFAULT_PROGRESS_COLORS,
  } = props;

  const interpolatedColor = useColorInterpolation(progressColors, percentage);

  return (
    <ProgressRing
      {..._.omit(props, ['progressColors'])}
      color={interpolatedColor}
    />
  );
};

AnimatedProgressRing.propTypes = {
  ..._.omit(ProgressRing.propTypes, ['color']),
  progressColors: PropTypes.arrayOf(PropTypes.string),
};

export default AnimatedProgressRing;
