import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

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

export const useColorInterpolation = (colors, percentage) => {
  const animatedPercentage = useRef(new Animated.Value(percentage)).current;

  const [interpolatedColor, setInterpolatedColor] = useState(colors[0]);

  useEffect(() => {
    Animated.timing(animatedPercentage, {
      toValue: percentage,
      duration: 100,
      useNativeDriver: false, // Color interpolation requires native driver to be false
    }).start();

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
  }, [percentage, colors, animatedPercentage]);

  return interpolatedColor;
};
