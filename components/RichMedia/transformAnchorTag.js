import React from 'react';
import {
  TouchableOpacity,
  Linking,
} from 'react-native';

import { Text } from '../Text';

function defaultOpenUrl(url) {
  Linking.openURL(url).catch(err => console.error(`Unable to open URL from RichMedia ${url}`, err));
}

function transformAnchorTag(containsElement, openUrl = defaultOpenUrl) {
  function onPress(node) {
    if (node.attribs && node.attribs.href) {
      const url = node.attribs.href;
      openUrl(url);
    }
  }

  return function transform(node, style, renderChildren) {
    if (node.name !== 'a') {
      return null;
    }

    const ContainerComponent = !containsElement(node) ? Text : TouchableOpacity;
    const onPressNode = onPress.bind(null, node);
    return (
      <ContainerComponent onPress={onPressNode}>
        {renderChildren()}
      </ContainerComponent>
    );
  };
}

export default transformAnchorTag;
