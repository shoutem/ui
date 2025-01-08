/* eslint-disable no-bitwise */
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { DEFAULT_PROGRESS_COLORS } from '../const';

const resolveInputRange = colors => {
  if (colors.length === 1) {
    // If only one color is given, color will always be the same, no matter of percentage.
    return [0, 100];
  }

  const numSteps = colors.length - 1;
  const stepSize = 100 / numSteps;

  return colors.map((_, index) => Math.round(index * stepSize));
};

const resolveOutputRange = colors => {
  if (colors.length === 1) {
    // If only one color is given, color will always be the same, no matter of percentage.
    return [colors[0], colors[0]];
  }

  return colors;
};

const resolveInterpolationRange = colors => {
  return {
    inputRange: resolveInputRange(colors),
    outputRange: resolveOutputRange(colors),
  };
};

export const useColorInterpolation = (
  colors,
  progressPerecentage,
  animatedConfig = {
    toValue: progressPerecentage,
    duration: 200,
    useNativeDriver: true,
  },
) => {
  const animatedPercentage = useRef(new Animated.Value(0)).current;

  const [interpolatedColor, setInterpolatedColor] = useState(
    !animatedConfig
      ? getInterpolatedColor(colors, progressPerecentage)
      : colors[0],
  );

  useEffect(() => {
    if (!animatedConfig) {
      return () => null;
    }

    Animated.timing(animatedPercentage, animatedConfig).start();

    // Listen to animatedPercentage value changes and update the interpolated color
    const listener = animatedPercentage.addListener(() => {
      const colorInterpolation = animatedPercentage.interpolate(
        resolveInterpolationRange(colors),
      );

      // Resolve the interpolated color to a valid color string
      setInterpolatedColor(colorInterpolation.__getValue());
    });

    return () => {
      animatedPercentage.removeListener(listener);
    };
  }, [progressPerecentage, colors, animatedPercentage, animatedConfig]);

  return interpolatedColor;
};

export const useColorAndPercentageInterpolation = (
  colors,
  progressPerecentage,
  animatedConfig = {
    toValue: progressPerecentage,
    duration: 200,
    useNativeDriver: true,
  },
) => {
  const animatedPercentage = useRef(new Animated.Value(0)).current;

  const [interpolatedColor, setInterpolatedColor] = useState(
    !animatedConfig
      ? getInterpolatedColor(colors, progressPerecentage)
      : colors[0],
  );
  const [interpolatedPercentage, setInterpolatedPercentage] = useState(
    !animatedConfig ? progressPerecentage : 0,
  );

  useEffect(() => {
    if (!animatedConfig) {
      return () => null;
    }

    Animated.timing(animatedPercentage, animatedConfig).start();

    // Listen to animatedPercentage value changes and update the interpolated color
    const listener = animatedPercentage.addListener(({ value }) => {
      const colorInterpolation = animatedPercentage.interpolate(
        resolveInterpolationRange(colors),
      );

      // Resolve the interpolated color to a valid color string
      setInterpolatedColor(colorInterpolation.__getValue());
      setInterpolatedPercentage(value);
    });

    return () => {
      animatedPercentage.removeListener(listener);
    };
  }, [progressPerecentage, colors, animatedPercentage, animatedConfig]);

  return { interpolatedColor, interpolatedPercentage };
};

/**
 * Convert hex color to RGB array
 */
const hexToRgb = hex => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

/**
 * Convert RGB array to hex color
 */
const rgbToHex = ([r, g, b]) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};

/**
 * Linearly interpolate between two numbers
 */
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Get interpolated color based on percentage
 */
export const getInterpolatedColor = (
  colors = DEFAULT_PROGRESS_COLORS,
  percentage,
) => {
  const numColors = colors.length;

  if (percentage <= 0) return colors[0];
  if (percentage >= 100) return colors[numColors - 1];

  const totalSegments = numColors - 1; // Total segments between colors
  const segment = (percentage / 100) * totalSegments; // Determine segment index as float
  const startIndex = Math.floor(segment); // Start color index
  const endIndex = startIndex + 1; // End color index
  const t = segment - startIndex; // Interpolation factor

  const startColor = hexToRgb(colors[startIndex]);
  const endColor = hexToRgb(colors[endIndex]);

  // Interpolate each RGB component
  const interpolatedColor = [
    Math.round(lerp(startColor[0], endColor[0], t)),
    Math.round(lerp(startColor[1], endColor[1], t)),
    Math.round(lerp(startColor[2], endColor[2], t)),
  ];

  return rgbToHex(interpolatedColor);
};
