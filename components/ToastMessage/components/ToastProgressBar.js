import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';

function ToastProgressBar({ duration, style, onProgressComplete, color }) {
  const progressValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start(onProgressComplete);
  });

  return (
    <View style={style.container}>
      <Animated.View
        style={[
          style.progressBar,
          {
            backgroundColor: color,
            transform: [
              {
                scaleX: progressValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

ToastProgressBar.propTypes = {
  style: PropTypes.object.isRequired,
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
