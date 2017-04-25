import React from 'react';
import { View } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { ElementPropTypes } from '../../components/RichMedia';
import { Inline } from '../Inline';

/**
 * Li always have parent component that must take care for props.
 * It is not planned to pick props from element.
 * @param childElements {Array} List of elements
 * @param renderElement {Function}
 * @param prefix {Component}
 * @param style {Object}
 * @returns {Component}
 */
function Li({ childElements, renderElement, prefix, style }) {
  return (
    <View style={style}>
      {prefix || null}
      <Inline
        childElements={childElements}
        renderElement={renderElement}
      />
    </View>
  );
}

Li.propTypes = {
  ...ElementPropTypes,
  prefix: React.PropTypes.element,
};

export default connectStyle('shoutem.ui.RichMedia.li')(Li);
