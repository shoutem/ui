/* eslint-disable react/require-default-props */
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { DEFAULT_PROGRESS_COLORS } from '../../const';
import { useColorAndPercentageInterpolation } from '../../hooks';
import { PROGRESS_RING_DEFAULT_PROPS } from './const';
import ProgressRing from './ProgressRing';

const AnimatedProgressRing = props => {
  const {
    progressPercentage = PROGRESS_RING_DEFAULT_PROPS.progressPercentage,
    progressColors = DEFAULT_PROGRESS_COLORS,
  } = props;

  const {
    interpolatedColor,
    interpolatedPercentage,
  } = useColorAndPercentageInterpolation(progressColors, progressPercentage);

  return (
    <ProgressRing
      {..._.omit(props, ['progressColors'])}
      color={interpolatedColor}
      progressPercentage={interpolatedPercentage}
    />
  );
};

AnimatedProgressRing.propTypes = {
  ..._.omit(ProgressRing.propTypes, ['color']),
  progressColors: PropTypes.arrayOf(PropTypes.string),
};

export default AnimatedProgressRing;
