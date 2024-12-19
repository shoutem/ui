/* eslint-disable react/require-default-props */
import React from 'react';
import { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { changeColorAlpha } from '@shoutem/theme';
import { PROGRESS_RING_DEFAULT_PROPS } from './const';
import { circlePath } from './svgCalculations';

const ProgressRing = ({
  index,
  width = PROGRESS_RING_DEFAULT_PROPS.width,
  backgroundWidth = PROGRESS_RING_DEFAULT_PROPS.backgroundWidth,
  progressLineCap = PROGRESS_RING_DEFAULT_PROPS.progressLineCap,
  backgroundLineCap = PROGRESS_RING_DEFAULT_PROPS.backgroundLineCap,
  percentage = PROGRESS_RING_DEFAULT_PROPS.percentage,
  hasBackgroundColor = PROGRESS_RING_DEFAULT_PROPS.hasBackgroundColor,
  arcSweepAngle = PROGRESS_RING_DEFAULT_PROPS.arcSweepAngle,
  size = PROGRESS_RING_DEFAULT_PROPS.size,
  color = PROGRESS_RING_DEFAULT_PROPS.color,
}) => {
  const halfSize = size / 2;

  const maxWidthCircle = backgroundWidth
    ? Math.max(width, backgroundWidth)
    : width;

  const radius = halfSize - maxWidthCircle / 2 - index * maxWidthCircle;

  const currentFillAngle =
    (arcSweepAngle * Math.min(100, Math.max(0, percentage))) / 100;

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
      {hasBackgroundColor && (
        <Path
          d={backgroundPath}
          stroke={changeColorAlpha(color, 0.2)}
          strokeWidth={backgroundWidth || width}
          strokeLinecap={backgroundLineCap}
          fill="transparent"
        />
      )}
      {percentage > 0 && (
        <Path
          d={progressPath}
          stroke={color}
          strokeWidth={width}
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
  backgroundWidth: PropTypes.number,
  color: PropTypes.string,
  hasBackgroundColor: PropTypes.bool,
  percentage: PropTypes.number,
  progressLineCap: PropTypes.string,
  size: PropTypes.number,
  width: PropTypes.number,
};

export default ProgressRing;
