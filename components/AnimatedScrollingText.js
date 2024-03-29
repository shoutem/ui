import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { ScrollView } from './ScrollView';
import { Text } from './Text';

const DEFAULT_CONFIG = {
  animationDuration: widthDiff => Math.max(widthDiff * 50, 2000),
  waitDuration: 2000,
};

const AnimatedScrollingText = ({ text, config, style }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const [containerWidth, setContainerWidth] = useState();
  const [textWidth, setTextWidth] = useState();

  const widthDiff = textWidth - containerWidth;

  useEffect(() => {
    let animation;

    if (widthDiff > 0) {
      animation = Animated.loop(
        Animated.sequence([
          // Animate scroll to the end of the text
          Animated.timing(translateX, {
            toValue: -widthDiff,
            duration: config.animationDuration(widthDiff),
            useNativeDriver: true,
          }),
          // Animate scroll back to start of the text
          Animated.timing(translateX, {
            toValue: 0,
            duration: config.animationDuration(widthDiff),
            useNativeDriver: true,
          }),
          // Wait X sec before starting animation again
          Animated.timing(translateX, {
            toValue: 0,
            duration: config.waitDuration,
            useNativeDriver: true,
          }),
        ]),
      );

      animation.start();
    }

    return () => animation?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widthDiff]);

  const handleContainerLayout = e => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const handleTextLayout = e => {
    setTextWidth(e.nativeEvent.layout.width);
  };

  return (
    <ScrollView
      onLayout={handleContainerLayout}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={style.scrollContainer}
      contentContainerStyle={style.scrollContentContainer}
    >
      <Animated.View
        style={[
          style.textContainer,
          widthDiff > 0 ? { transform: [{ translateX }] } : {},
        ]}
      >
        <Text onLayout={handleTextLayout} style={style.text}>
          {text}
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

AnimatedScrollingText.propTypes = {
  text: PropTypes.string.isRequired,
  config: PropTypes.object,
  style: PropTypes.object,
};

AnimatedScrollingText.defaultProps = {
  config: DEFAULT_CONFIG,
  style: {},
};

const StyledAnimatedScrollingText = connectStyle(
  'shoutem.ui.AnimatedScrollingText',
)(AnimatedScrollingText);
export { StyledAnimatedScrollingText as AnimatedScrollingText };
