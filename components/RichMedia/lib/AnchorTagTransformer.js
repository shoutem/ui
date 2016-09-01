import React from 'react';
import {
  TouchableOpacity,
  Linking,
} from 'react-native';

import { Text } from '../../Text';

import type {
  NodeType,
} from './types';

function followLink(node) {
  if (node.attribs && node.attribs.href) {
    const url = node.attribs.href;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }
}

function AnchorTagTransformer(containsMediaElement) {
  return {
    canTransform(node: NodeType): boolean {
      return node.name === 'a';
    },

    transform(renderChildren: any, node: NodeType) {
      const ContainerComponent = !containsMediaElement(node) ? Text : TouchableOpacity;
      const openURL = followLink.bind(null, node);
      return (
        <ContainerComponent
          onPress={openURL}
        >
        {renderChildren()}
        </ContainerComponent>
      );
    },
  };
}

export default AnchorTagTransformer;
