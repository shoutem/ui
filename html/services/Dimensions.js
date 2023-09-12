import { Dimensions } from 'react-native';

export function resolveMaxWidth(style) {
  // parentContainerPadding - padding between screen & SimpleHtml. Parent container
  // can have it's own padding. If it does, we have to include it in calculation,
  // otherwise maxWidth will be more than max & images will go over the edge
  const parentContainerPadding = style.outerPadding || 0;
  const paddingValue =
    style.container.paddingLeft ||
    0 + style.container.paddingRight ||
    0 + parentContainerPadding;

  return Dimensions.get('window').width - paddingValue;
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
