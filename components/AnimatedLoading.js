import React, { useCallback, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { animations } from '../assets';
import { usePreviousValue } from '../hooks';

const AnimatedView = Animated.createAnimatedComponent(View);

function AnimatedLoading({
  children,
  finishAnimationCallback,
  loading,
  style,
}) {
  const prevLoading = usePreviousValue(loading);
  const animateProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!prevLoading && loading) {
      startAnimation();
    }
  }, [prevLoading, startAnimation, loading]);

  const startAnimation = useCallback(() => {
    Animated.timing(animateProgress, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(finishAnimation);
  }, [animateProgress, finishAnimation]);

  const finishAnimation = useCallback(() => {
    Animated.timing(animateProgress, {
      toValue: 0,
      duration: 400,
      delay: 1500,
      useNativeDriver: false,
    }).start(() => {
      if (finishAnimationCallback) {
        finishAnimationCallback();
      }
    });
  }, [animateProgress, finishAnimationCallback]);

  return (
    <AnimatedView style={style.container}>
      {!loading && children}
      {loading && (
        <LottieView
          style={style.loading}
          source={animations.loading}
          colorFilters={style.animationFilters}
          autoPlay
          loop
        />
      )}
    </AnimatedView>
  );
}

AnimatedLoading.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
    PropTypes.node,
  ]),
  finishAnimationCallback: PropTypes.func,
  loading: PropTypes.bool,
  style: PropTypes.object,
};

AnimatedLoading.defaultProps = {
  children: undefined,
  finishAnimationCallback: undefined,
  loading: false,
  style: {},
};

const StyledAnimatedLoading = connectStyle('shoutem.ui.AnimatedLoading')(
  AnimatedLoading,
);
export { StyledAnimatedLoading as AnimatedLoading };
