import React, { useCallback, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { animations } from '../assets';

const AnimatedView = Animated.createAnimatedComponent(View);

function LoadingContainer({
  children,
  customAnimation,
  onAnimationFinished,
  loading,
  style,
}) {
  const animateProgress = useRef(new Animated.Value(0)).current;

  const containerDimensions = useRef(style.defaultContainerDimensions);

  useEffect(() => {
    if (loading) {
      startAnimation();
    }
  }, [startAnimation, loading]);

  const startAnimation = useCallback(() => {
    if (customAnimation) {
      customAnimation();
      return;
    }

    Animated.timing(animateProgress, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (onAnimationFinished) {
        onAnimationFinished();
      }
    });
  }, [animateProgress, customAnimation, onAnimationFinished]);

  function onLayoutChange(event) {
    const { width, height } = event.nativeEvent.layout;

    containerDimensions.current = { width, height };
  }

  return (
    <AnimatedView style={style.container}>
      {!loading && <View onLayout={onLayoutChange}>{children}</View>}
      {loading && (
        <LottieView
          style={[
            containerDimensions.current,
            { flex: 1, justifyContent: 'center', alignItems: 'center' },
          ]}
          source={animations.loading}
          colorFilters={style.animationFilters}
          autoPlay
          loop
        />
      )}
    </AnimatedView>
  );
}

LoadingContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
    PropTypes.node,
  ]),
  customAnimation: PropTypes.func,
  loading: PropTypes.bool,
  style: PropTypes.object,
  onAnimationFinished: PropTypes.func,
};

LoadingContainer.defaultProps = {
  children: undefined,
  customAnimation: undefined,
  onAnimationFinished: undefined,
  loading: false,
  style: {},
};

const StyledLoadingContainer = connectStyle('shoutem.ui.LoadingContainer')(
  LoadingContainer,
);
export { StyledLoadingContainer as LoadingContainer };
