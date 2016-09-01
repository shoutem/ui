/**
 * @flow
 */

import React from 'react';

import {
  Platform,
} from 'react-native';

import { Text } from '../../Text';

import type {
  NodeType,
} from './types';

// Use two line breaks on Android because it renders small newlines
const LINE_BREAK = Platform.OS === 'android' ? '\n\n' : '\n';
const PARAGRAPH_BREAK = Platform.OS === 'android' ? '\n\n' : '\n';

const BULLET = '\u2022 ';

// TODO(Vladimir) - split into multiple files, each implementing the TagTransformer interface
const tagTransformers = [
  {
    canTransform(node: NodeType): boolean {
      return node.name === 'p';
    },

    transform(renderChildren, node) {
      const index = node.children ? node.children.length : 0;
      return [
        renderChildren(),
        <Text key={index}>{PARAGRAPH_BREAK}</Text>,
      ];
    },
  },
  {
    canTransform(node: NodeType): boolean {
      return node.name === 'pre';
    },

    transform(renderChildren) {
      return [
        <Text key={0}>{LINE_BREAK}</Text>,
        renderChildren(),
      ];
    },
  },
  {
    canTransform(node: NodeType): boolean {
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
    canTransform(node: NodeType): boolean {
      return node.name === 'br';
    },

    transform(renderChildren, node) {
      const index = node.children ? node.children.length : 0;
      return [
        renderChildren(),
        <Text key={index}>{LINE_BREAK}</Text>,
      ];
    },
  },
  {
    canTransform(node: NodeType): boolean {
      return ['h1', 'h2', 'h3', 'h4', 'h5'].some(tag => tag === node.name);
    },

    transform(renderChildren, node) {
      const index = node.children ? node.children.length : 0;
      return [
        renderChildren(),
        <Text key={index}>{PARAGRAPH_BREAK}</Text>,
      ];
    },
  },
];

const HtmlTagTransformer = {
  canTransform(node: NodeType): boolean {
    return tagTransformers.some(transformer => transformer.canTransform(node));
  },

  transform(renderChildren: any, node: NodeType): any {
    return tagTransformers.find(transformer => transformer.canTransform(node))
                          .transform(renderChildren, node);
  },
};

export default HtmlTagTransformer;
