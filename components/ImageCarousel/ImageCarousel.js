import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon } from '../Icon';
import { PageIndicators } from '../PageIndicators';
import { TouchableOpacity } from '../TouchableOpacity';
import { View } from '../View';
import {
  getNearestSnapIndex,
  getSnapInputRange,
  resolveSnapOffsets,
} from './helpers';
import { ImageCarouselSlide } from './ImageCarouselSlide';

/**
 * Default `keyExtractor` used when the caller doesn't provide one - falls back to
 * the item's own `id`, then its index.
 *
 * @param {Object} item The slide data item.
 * @param {number} index The item's index in `data`.
 * @returns {string} A stable key for the slide.
 */
const defaultKeyExtractor = (item, index) => item.id ?? String(index);

/**
 * Default `getImageSource` used when the caller doesn't provide one - reads the
 * item's `source` field.
 *
 * @param {Object} item The slide data item.
 * @returns {Object|number} A React Native image source.
 */
const defaultGetImageSource = item => item.source;

/**
 * A horizontally-swipeable image carousel: pages through `data` as fixed-width
 * image cards that snap one by one, with neighbouring cards peeking in and
 * scaling/fading with the scroll position. The first and last slides rest
 * against the list edges; every other slide rests centered. Also owns page
 * indicator dots, arrows, and autoplay. Renders a placeholder until it has
 * measured its own width, and nothing at all when `data` is empty. Callers
 * customize slides through `renderOverlay` and `renderImagePlaceholder`.
 *
 * @param {Array} [data] The slides to render.
 * @param {Function} [getImageSource] `(item) => imageSource`. Defaults to the
 *   item's `source` field.
 * @param {Function} [keyExtractor] `(item, index) => string`. Defaults to the
 *   item's `id`, falling back to its index.
 * @param {number} [cardAspectRatio] The shape of every slide as width / height.
 * @param {number} [initialIndex] The 0-based slide index to open on, applied by
 *   scrolling once the carousel has measured its width.
 * @param {boolean} [autoplay] Whether to automatically advance slides on a
 *   timer. Paused while the user is dragging.
 * @param {number} [autoplayIntervalMs] The autoplay interval, in milliseconds.
 * @param {boolean} [showPageIndicators] Whether to render the dot indicators.
 *   Hidden automatically when there's only one slide.
 * @param {number} [maxPageIndicators] The maximum number of dots to render.
 * @param {boolean} [showArrows] Whether to render left/right arrow buttons.
 *   Each arrow hides at its own end of the list, so there is no wrap-around.
 * @param {Function} [renderOverlay] `(item, { index, isActive }) => JSX.Element`
 *   rendered inside the slide card, on top of the image.
 * @param {Function} [renderImagePlaceholder] `(item, { index }) => JSX.Element`
 *   rendered over a slide's image until it has loaded.
 * @param {Function} [renderPlaceholder] `({ cardAspectRatio }) => JSX.Element`
 *   rendered instead of the list until the width is measured. Defaults to an
 *   empty view with the height the loaded carousel will have.
 * @param {Function} [onIndexChange] `(index) => void`, called when the active
 *   slide changes (not on mount).
 * @param {Object} style Resolved styles, injected by connectStyle. Geometry is
 *   read from the `cardWidth`, `cardSpacing`, `inactiveScale` and
 *   `inactiveOpacity` scalars. A `style` prop passed by the caller is merged
 *   over the theme styles by connectStyle.
 * @returns {JSX.Element|null}
 */
const ImageCarousel = ({
  data,
  getImageSource,
  keyExtractor,
  cardAspectRatio,
  initialIndex,
  autoplay,
  autoplayIntervalMs,
  showPageIndicators,
  maxPageIndicators,
  showArrows,
  renderOverlay,
  renderImagePlaceholder,
  renderPlaceholder,
  onIndexChange,
  style,
}) => {
  const listRef = useRef(null);
  const isFirstSnapRender = useRef(true);
  const isFirstIndexRender = useRef(true);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isInteracting, setIsInteracting] = useState(false);

  const { cardWidth, cardSpacing, inactiveScale, inactiveOpacity } = style;
  const snapInterval = cardWidth + cardSpacing;
  const snapOffsets = useMemo(
    () =>
      resolveSnapOffsets({
        itemCount: data.length,
        containerWidth,
        cardWidth,
        cardSpacing,
      }),
    [data.length, containerWidth, cardWidth, cardSpacing],
  );

  const itemWrapperStyle = useMemo(
    () => ({
      width: cardWidth,
      marginHorizontal: cardSpacing / 2,
      aspectRatio: cardAspectRatio,
    }),
    [cardWidth, cardSpacing, cardAspectRatio],
  );

  const scrollToIndex = useCallback(
    index => {
      listRef.current?.scrollToOffset({
        offset: snapOffsets[index] ?? 0,
        animated: true,
      });
    },
    [snapOffsets],
  );

  useEffect(() => {
    if (!autoplay || data.length < 2 || !snapInterval || isInteracting) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      scrollToIndex((activeIndex + 1) % data.length);
    }, autoplayIntervalMs);

    return () => clearInterval(intervalId);
  }, [
    autoplay,
    autoplayIntervalMs,
    activeIndex,
    isInteracting,
    data.length,
    snapInterval,
    scrollToIndex,
  ]);

  useEffect(() => {
    if (isFirstIndexRender.current) {
      isFirstIndexRender.current = false;
      return;
    }

    if (onIndexChange) {
      onIndexChange(activeIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    if (isFirstSnapRender.current) {
      isFirstSnapRender.current = false;
      return;
    }

    if (!snapInterval || containerWidth === 0) {
      return;
    }

    // Positions the list on the active slide whenever the measured width
    // changes: the first measured render lands on `initialIndex` (the list
    // deliberately has no `initialScrollIndex` - the list's own mount-time
    // scroll pass renders a frame with the content shifted a full card before
    // it self-corrects), and a device rotation re-snaps to the slide that was
    // already active, read at fire time (as are the snap offsets).
    listRef.current?.scrollToOffset({
      offset: snapOffsets[activeIndex] ?? 0,
      animated: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerWidth]);

  const handleLayout = useCallback(event => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  const handleScroll = useCallback(
    event => {
      if (!snapInterval) {
        return;
      }

      const nextIndex = getNearestSnapIndex(
        snapOffsets,
        event.nativeEvent.contentOffset.x,
      );

      setActiveIndex(prevIndex =>
        prevIndex === nextIndex ? prevIndex : nextIndex,
      );
    },
    [snapInterval, snapOffsets],
  );

  const handleScrollEvent = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
        listener: handleScroll,
      }),
    [scrollX, handleScroll],
  );

  const handleScrollBeginDrag = useCallback(() => {
    setIsInteracting(true);
  }, []);

  const handleScrollEndDrag = useCallback(() => {
    setIsInteracting(false);
  }, []);

  const handleMomentumScrollEnd = useCallback(() => {
    setIsInteracting(false);
  }, []);

  const handlePrevArrowPress = useCallback(() => {
    scrollToIndex(Math.max(activeIndex - 1, 0));
  }, [activeIndex, scrollToIndex]);

  const handleNextArrowPress = useCallback(() => {
    scrollToIndex(Math.min(activeIndex + 1, data.length - 1));
  }, [activeIndex, data.length, scrollToIndex]);

  const getItemLayout = useCallback(
    (_data, index) => ({
      length: snapInterval,
      offset: snapInterval * index,
      index,
    }),
    [snapInterval],
  );

  const renderSlide = useCallback(
    ({ item, index }) => {
      const inputRange = getSnapInputRange(snapOffsets, index, snapInterval);
      // Scaling a card down leaves (1 - scale) * cardWidth / 2 of empty space
      // on each of its sides, since the layout slot keeps the full width. The
      // translate pulls a shrunken neighbour back toward the focused card by
      // exactly that amount, so the visible gap stays `cardSpacing`.
      const scaleShift = ((1 - inactiveScale) * cardWidth) / 2;
      const animatedStyle = {
        opacity: scrollX.interpolate({
          inputRange,
          outputRange: [inactiveOpacity, 1, inactiveOpacity],
          extrapolate: 'clamp',
        }),
        transform: [
          {
            translateX: scrollX.interpolate({
              inputRange,
              outputRange: [-scaleShift, 0, scaleShift],
              extrapolate: 'clamp',
            }),
          },
          {
            scale: scrollX.interpolate({
              inputRange,
              outputRange: [inactiveScale, 1, inactiveScale],
              extrapolate: 'clamp',
            }),
          },
        ],
      };

      return (
        <Animated.View style={[itemWrapperStyle, animatedStyle]}>
          <ImageCarouselSlide
            item={item}
            index={index}
            isActive={index === activeIndex}
            source={getImageSource(item)}
            renderOverlay={renderOverlay}
            renderImagePlaceholder={renderImagePlaceholder}
          />
        </Animated.View>
      );
    },
    [
      getImageSource,
      renderOverlay,
      renderImagePlaceholder,
      itemWrapperStyle,
      scrollX,
      snapOffsets,
      snapInterval,
      cardWidth,
      inactiveScale,
      inactiveOpacity,
      activeIndex,
    ],
  );

  if (_.isEmpty(data)) {
    return null;
  }

  const placeholderStyle = [
    style.placeholder,
    { height: cardWidth / cardAspectRatio },
  ];
  const placeholder = renderPlaceholder ? (
    renderPlaceholder({ cardAspectRatio })
  ) : (
    <View style={placeholderStyle} />
  );

  return (
    <View style={style.container} onLayout={handleLayout}>
      {containerWidth === 0 && placeholder}
      {containerWidth > 0 && (
        <Animated.FlatList
          ref={listRef}
          horizontal
          data={data}
          renderItem={renderSlide}
          keyExtractor={keyExtractor}
          showsHorizontalScrollIndicator={false}
          snapToOffsets={snapOffsets}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum
          getItemLayout={getItemLayout}
          scrollEnabled={data.length > 1}
          bounces={false}
          scrollEventThrottle={16}
          removeClippedSubviews={false}
          onScroll={handleScrollEvent}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          contentContainerStyle={style.listContent}
        />
      )}
      {showPageIndicators && data.length > 1 && (
        <PageIndicators
          activeIndex={activeIndex}
          count={data.length}
          maxCount={maxPageIndicators}
          style={style.pageIndicators}
        />
      )}
      {showArrows && activeIndex > 0 && (
        <TouchableOpacity
          style={style.leftArrow}
          onPress={handlePrevArrowPress}
        >
          <Icon name="left-arrow" style={style.arrowIcon} />
        </TouchableOpacity>
      )}
      {showArrows && activeIndex < data.length - 1 && (
        <TouchableOpacity
          style={style.rightArrow}
          onPress={handleNextArrowPress}
        >
          <Icon name="right-arrow" style={style.arrowIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

ImageCarousel.propTypes = {
  autoplay: PropTypes.bool,
  autoplayIntervalMs: PropTypes.number,
  cardAspectRatio: PropTypes.number,
  data: PropTypes.array,
  getImageSource: PropTypes.func,
  initialIndex: PropTypes.number,
  keyExtractor: PropTypes.func,
  maxPageIndicators: PropTypes.number,
  renderImagePlaceholder: PropTypes.func,
  renderOverlay: PropTypes.func,
  renderPlaceholder: PropTypes.func,
  showArrows: PropTypes.bool,
  showPageIndicators: PropTypes.bool,
  style: PropTypes.object,
  onIndexChange: PropTypes.func,
};

ImageCarousel.defaultProps = {
  autoplay: false,
  autoplayIntervalMs: 5000,
  cardAspectRatio: 16 / 9,
  data: [],
  getImageSource: defaultGetImageSource,
  initialIndex: 0,
  keyExtractor: defaultKeyExtractor,
  maxPageIndicators: 10,
  renderImagePlaceholder: undefined,
  renderOverlay: undefined,
  renderPlaceholder: undefined,
  showArrows: false,
  showPageIndicators: true,
  style: {},
  onIndexChange: undefined,
};

const StyledImageCarousel = connectStyle('shoutem.ui.ImageCarousel')(
  ImageCarousel,
);

export { StyledImageCarousel as ImageCarousel };
