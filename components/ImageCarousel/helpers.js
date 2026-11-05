import _ from 'lodash';

/**
 * Computes the scroll offset each slide snaps to. Every slide rests centered in
 * the container, except that the offsets are clamped to the scrollable range, so
 * the first slide rests against the left edge and the last against the right.
 *
 * @param {Object} options
 * @param {number} options.itemCount The number of slides.
 * @param {number} options.containerWidth The measured container width.
 * @param {number} options.cardWidth The width of a card.
 * @param {number} options.cardSpacing The total horizontal gap around a card.
 * @param {number} [options.edgeInset] The list content's own horizontal padding.
 * @returns {number[]} One snap offset per slide; empty until the container is
 *   measured or when there are no slides.
 */
export function resolveSnapOffsets({
  itemCount,
  containerWidth,
  cardWidth,
  cardSpacing,
  edgeInset = 0,
}) {
  if (!containerWidth || !itemCount) {
    return [];
  }

  const snapInterval = cardWidth + cardSpacing;
  const contentWidth = itemCount * snapInterval + 2 * edgeInset;
  const maxOffset = Math.max(contentWidth - containerWidth, 0);

  return _.times(itemCount, index => {
    const centeredOffset =
      edgeInset +
      index * snapInterval +
      cardSpacing / 2 -
      (containerWidth - cardWidth) / 2;

    return _.clamp(centeredOffset, 0, maxOffset);
  });
}

/**
 * Finds the slide whose snap offset is closest to the given scroll offset.
 *
 * @param {number[]} snapOffsets The slides' snap offsets.
 * @param {number} offsetX The current horizontal scroll offset.
 * @returns {number} The nearest slide index (lowest on ties); 0 when empty.
 */
export function getNearestSnapIndex(snapOffsets, offsetX) {
  let nearestIndex = 0;
  let nearestDistance = Infinity;

  _.forEach(snapOffsets, (snapOffset, index) => {
    const distance = Math.abs(snapOffset - offsetX);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}

/**
 * Builds the strictly increasing `[previous, current, next]` input range used to
 * animate a card as the scroll position approaches and leaves its snap offset.
 * A missing or equal (clamped) neighbour is replaced by `current ∓ snapInterval`.
 *
 * @param {number[]} snapOffsets The slides' snap offsets.
 * @param {number} index The card's slide index.
 * @param {number} snapInterval Distance between two card centers.
 * @returns {number[]} The three-value input range.
 */
export function getSnapInputRange(snapOffsets, index, snapInterval) {
  const current = snapOffsets[index] ?? index * snapInterval;
  const previous = snapOffsets[index - 1];
  const next = snapOffsets[index + 1];

  return [
    previous === undefined || previous >= current
      ? current - snapInterval
      : previous,
    current,
    next === undefined || next <= current ? current + snapInterval : next,
  ];
}
