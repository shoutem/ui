import React from 'react';
import { ElementPropTypes, mapComponentProps, mapElementProps } from '../components/RichMedia';
import { Text } from 'react-native';

function removeNewLines(childElements) {
  return childElements.filter(child => child !== '\n');
}

export function TextElement(props) {
  const textualchildElements = removeNewLines(props.childElements);

  if (textualchildElements.length === 0) {
    // Even if there is no children to render, the Text must be rendered
    // because otherwise RN may render a View to wrap a "null" which may lead to
    // case where a View is in the Text.
    return <Text style={{ height: 0 }} />;
  }

  // Must be the RN Text so that style inheritance chain
  // doesn't break with additional layer.
  return <Text {...props}> {textualchildElements} </Text>;
}

TextElement.propTypes = {
  ...ElementPropTypes,
};

export default mapComponentProps(mapElementProps)(TextElement);
