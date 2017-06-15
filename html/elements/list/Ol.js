import React from 'react';

import { View } from '../../../components/View';
import { Text } from '../../../components/Text';
import renderItems from './helpers/renderItems';
import pickLiChildElements from './helpers/pickLiChildElements';
import { ElementPropTypes, combineMappers, mapElementProps } from '../../Html';
import Li from './Li';

function createPrefixCreator(type, prefixStyle) {
  return function (element, index) {
    // TODO (Braco) - Handle all types
    return <Text style={prefixStyle}>{index}</Text>;
  };
}

export function Ol({ style, childElements, type, renderElement }) {
  const liItems = pickLiChildElements(childElements);
  return (
    <View style={style.container}>
      {renderItems(Li, liItems, renderElement, createPrefixCreator(type, style.prefix))}
    </View>
  );
}

Ol.propTypes = {
  ...ElementPropTypes,
  style: React.PropTypes.object,
  type: React.PropTypes.string,
};

export default combineMappers(mapElementProps)(Ol);
