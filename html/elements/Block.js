import React from 'react';

import { View } from '../../components/View';
import { ElementPropTypes, mapComponentProps, mapElementProps } from '../Html';
import { Inline } from './Inline';

/**
 * Should be used for the block HTML elements.
 * The Block behaves the same as the HTML block element,
 * it moves the content into a new line.
 * @param props {Object} Element attributes
 * @returns {Component}
 * @constructor
 */
export function Block(props) {
  const { style } = props;

  return (
    <View style={style.container}>
      <Inline {...props} />
    </View>
  );
}

Block.propTypes = {
  ...ElementPropTypes,
};

export default mapComponentProps(mapElementProps)(Block);
