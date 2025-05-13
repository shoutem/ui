import React, { useContext, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { AnimationDriverContext, ScrollDriver } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

const ScrollView = ({ driver, onScroll, primary, style, ...otherProps }) => {
  const animationDriver = useRef(
    driver ||
      new ScrollDriver(
        { useNativeDriver: true, nativeScrollEventThrottle: 20 },
        onScroll,
      ),
  );
  const animationDriverContext = useContext(AnimationDriverContext);

  // When transition to and back from the screen containing the scrollview,
  // we want to switch to appropriate animation driver. We use the following hook
  // to derive the new driver and cascading styles before the actual navigation transition is done
  // to avoid rerendering when the actual nav transition completes
  useFocusEffect(() => {
    const {
      animationDriver: prevAnimationDriver,
      setAnimationDriver,
    } = animationDriverContext;

    if (setAnimationDriver) {
      setAnimationDriver(animationDriver.current, primary);
    }

    return () => {
      if (prevAnimationDriver) {
        setAnimationDriver(prevAnimationDriver);
      }
    };
  });

  useEffect(() => {
    if (driver && animationDriver.current !== driver) {
      animationDriver.current = driver;
    }
  }, [driver]);

  const { scrollViewProps } = animationDriver?.current;
  const { contentContainerStyle, ...otherStyle } = style;

  return (
    <Animated.ScrollView
      contentContainerStyle={contentContainerStyle}
      {...scrollViewProps}
      {..._.omit(otherProps, 'onScroll')}
      style={otherStyle}
    />
  );
};

ScrollView.propTypes = {
  ...Animated.ScrollView.propTypes,
  primary: PropTypes.bool,
};

ScrollView.defaultProps = {
  primary: false,
};

const StyledScrollView = connectStyle('shoutem.ui.ScrollView')(ScrollView);

export { StyledScrollView as ScrollView };
