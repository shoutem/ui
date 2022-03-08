import React, { useMemo, useState } from 'react';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { animations } from '../assets';

function LoadingContainer({
  animation,
  children,
  loading,
  animationScale,
  style,
}) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  function onLayoutChange(event) {
    const { width, height } = event.nativeEvent.layout;

    if (width === 0 && height === 0) {
      return;
    }

    setDimensions({ width, height });
  }

  const lottieViewDimensions = useMemo(
    () => ({
      width: dimensions.width * animationScale,
      height: dimensions.height * animationScale,
    }),
    [animationScale, dimensions],
  );

  if (!children) {
    return null;
  }

  return (
    <View style={style.container}>
      {!loading && <View onLayout={onLayoutChange}>{children}</View>}
      {loading && (
        <View style={[style.container, dimensions]}>
          <LottieView
            style={lottieViewDimensions}
            source={animation}
            colorFilters={style.animationFilters}
            autoPlay
            loop
          />
        </View>
      )}
    </View>
  );
}

LoadingContainer.propTypes = {
  animation: PropTypes.object,
  animationScale: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
    PropTypes.node,
  ]),
  loading: PropTypes.bool,
  style: PropTypes.object,
};

LoadingContainer.defaultProps = {
  animationScale: 1,
  children: undefined,
  animation: animations.loadingDots,
  loading: false,
  style: {},
};

const StyledLoadingContainer = connectStyle('shoutem.ui.LoadingContainer')(
  LoadingContainer,
);
export { StyledLoadingContainer as LoadingContainer };
