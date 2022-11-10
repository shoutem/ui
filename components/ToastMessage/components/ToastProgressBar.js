import React, { useEffect, useRef, useCallback } from 'react';
import { Animated, View } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';

function ToastProgressBar({ duration, style, onProgressComplete, color, visible }) {
  const progressValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      progressValue.setValue(0);
      return;
    }

    Animated.timing(progressValue, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start(handleAnimationEnd);
  }, [visible]);

  const handleAnimationEnd = useCallback(() => {
    progressValue.setValue(0);
    if (onProgressComplete) {
      onProgressComplete();
    }
  });

  return (
    <View style={style.container}>
      <Animated.View
        style={[
          style.progressBar,
          {
            backgroundColor: color,
            width: progressValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

ToastProgressBar.propTypes = {
  style: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  color: PropTypes.string,
  duration: PropTypes.number,
  onProgressComplete: PropTypes.func,
};

ToastProgressBar.defaultProps = {
  color: '#00AADF',
  duration: 4000,
  onProgressComplete: undefined,
};

export default connectStyle('shoutem.ui.ToastProgressBar')(ToastProgressBar);
