import { Dimensions } from 'react-native';

/**
 * Returns the width available to HTML content: the window width minus the
 * SimpleHtml container's horizontal padding and `outerPadding`, the horizontal
 * space the parent containers take between the screen edge and SimpleHtml.
 * Embedded images and videos are capped at this width so they don't overflow.
 *
 * @param {Object} style Resolved SimpleHtml style.
 * @param {Object} [style.container] Container style; `paddingLeft` and
 *   `paddingRight` (expanded from `padding` by the theme) are subtracted.
 * @param {number} [style.outerPadding] Total horizontal space (both sides)
 *   taken by parent containers.
 * @returns {number}
 */
export function resolveMaxWidth(style) {
  const { paddingLeft = 0, paddingRight = 0 } = style.container || {};
  const outerPadding = style.outerPadding || 0;

  return (
    Dimensions.get('window').width - paddingLeft - paddingRight - outerPadding
  );
}

export function resolveDimensions(objectToResize, style) {
  const { width, height } = objectToResize;

  if (!width || !height) {
    return { width, height };
  }

  const maxWidth = resolveMaxWidth(style);
  const objectToResizeRatio = height / width;
  const resolvedWidth = width > maxWidth ? maxWidth : width;
  const resolvedHeight = Math.round(resolvedWidth * objectToResizeRatio);

  return { width: resolvedWidth, height: resolvedHeight };
}
