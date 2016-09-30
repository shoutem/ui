import React from 'react';

import {
  Platform,
} from 'react-native';

import { Text } from '../Text';

// Use two line breaks on Android because it renders small newlines
const LINE_BREAK = Platform.OS === 'android' ? '\n\n' : '\n';

const BULLET = '\u2022 ';

const tagTransformers = [
  {
    canTransform(node) {
      return node.name === 'p';
    },

    transform(renderChildren) {
      return [
        renderChildren(),
      ];
    },
  },
  {
    canTransform(node) {
      return node.name === 'pre';
    },

    transform(renderChildren) {
      return [,
        renderChildren(),
      ];
    },
  },
  {
    canTransform(node) {
      return node.name === 'li';
    },

    transform(renderChildren) {
      return [
        <Text key={0}>{BULLET}</Text>,
        renderChildren(),
      ];
    },
  },
  {
    canTransform(node) {
      return node.name === 'br';
    },

    transform() {
      return [
        <Text key="br">{LINE_BREAK}</Text>,
      ];
    },
  },
  {
    canTransform(node) {
      return ['h1', 'h2', 'h3', 'h4', 'h5'].some(tag => tag === node.name);
    },

    transform(renderChildren) {
      return [
        renderChildren(),
      ];
    },
  },
];

const HtmlTagTransformer = {
  canTransform(node) {
    return tagTransformers.some(transformer => transformer.canTransform(node));
  },

  transform(renderChildren, node) {
    return tagTransformers.find(transformer => transformer.canTransform(node))
                          .transform(renderChildren, node);
  },
};

function transformHtmlTag(node, style, renderChildren) {
  if (!HtmlTagTransformer.canTransform(node)) {
    return null;
  }

  return HtmlTagTransformer.transform(renderChildren, node);
}

export default transformHtmlTag;
