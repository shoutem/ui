/* eslint-disable react/require-default-props */
import React from 'react';
import { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { changeColorAlpha } from '@shoutem/theme';
import { PROGRESS_RING_DEFAULT_PROPS } from './const';
import { circlePath } from './svgCalculations';

const ProgressRing = ({
  index,
  progressPercentage = PROGRESS_RING_DEFAULT_PROPS.progressPercentage,
  size = PROGRESS_RING_DEFAULT_PROPS.size,
  color = PROGRESS_RING_DEFAULT_PROPS.color,
  progressLineWidth = PROGRESS_RING_DEFAULT_PROPS.progressLineWidth,
  backgroundLineWidth = PROGRESS_RING_DEFAULT_PROPS.backgroundLineWidth,
  progressLineCap = PROGRESS_RING_DEFAULT_PROPS.progressLineCap,
  backgroundLineCap = PROGRESS_RING_DEFAULT_PROPS.backgroundLineCap,
  arcSweepAngle = PROGRESS_RING_DEFAULT_PROPS.arcSweepAngle,
}) => {
  const halfSize = size / 2;

  const maxWidthCircle = backgroundLineWidth
    ? Math.max(progressLineWidth, backgroundLineWidth)
    : progressLineWidth;

  const radius = halfSize - maxWidthCircle / 2 - index * maxWidthCircle;

  const currentFillAngle =
    (arcSweepAngle * Math.min(100, Math.max(0, progressPercentage))) / 100;

  const backgroundPath = circlePath(
    halfSize,
    halfSize,
    radius,
    currentFillAngle,
    arcSweepAngle,
  );

  const progressPath = circlePath(
    halfSize,
    halfSize,
    radius,
    0,
    currentFillAngle,
  );

  return (
    <>
      {backgroundLineWidth > 0 && (
        <Path
          d={backgroundPath}
          stroke={changeColorAlpha(color, 0.2)}
          strokeWidth={backgroundLineWidth || progressLineWidth}
          strokeLinecap={backgroundLineCap}
          fill="transparent"
        />
      )}
      {progressPercentage > 0 && (
        <Path
          d={progressPath}
          stroke={color}
          strokeWidth={progressLineWidth}
          strokeLinecap={progressLineCap}
          fill="transparent"
        />
      )}
    </>
  );
};

ProgressRing.propTypes = {
  index: PropTypes.number.isRequired,
  arcSweepAngle: PropTypes.number,
  backgroundLineCap: PropTypes.string,
  backgroundLineWidth: PropTypes.number,
  color: PropTypes.string,
  progressLineCap: PropTypes.string,
  progressLineWidth: PropTypes.number,
  progressPercentage: PropTypes.number,
  size: PropTypes.number,
};

export default ProgressRing;
