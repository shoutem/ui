import React from 'react';
import { View } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { ElementPropTypes, mapComponentProps, mapElementProps } from '../../Html';
import renderItems from './helpers/renderItems';
import pickLiChildElements from './helpers/pickLiChildElements';
import Li from './Li';

export function Ul({ style, childElements, renderElement }) {
  // TODO (Braco) - handle list-style-type from inlineStyle prop
  const liItems = pickLiChildElements(childElements);
  return (
    <View style={style.container}>
      {renderItems(Li, liItems, renderElement)}
    </View>
  );
}

Ul.propTypes = {
  ...ElementPropTypes,
  style: React.PropTypes.object,
};

export default connectStyle('shoutem.ui.Html.ul')(mapComponentProps(mapElementProps)(Ul));
