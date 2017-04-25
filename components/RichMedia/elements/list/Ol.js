import React from 'react';
import { View, Text } from '@shoutem/ui';
import renderItems from './helpers/renderItems';
import pickLichildElements from './helpers/pickLiChildElements';
import { ElementPropTypes, mapComponentProps, mapElementProps } from '../../components/RichMedia';
import { connectStyle } from '@shoutem/theme';
import Li from './Li';

function createPrefixCreator(type, prefixStyle) {
  return function (element, index) {
    // TODO (Braco) - Handle all types
    return <Text style={prefixStyle}>{index}</Text>;
  };
}

export function Ol({ style, childElements, type, renderElement }) {
  const liItems = pickLichildElements(childElements);
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

export default connectStyle('shoutem.ui.RichMedia.ol')(mapComponentProps(mapElementProps)(Ol));
