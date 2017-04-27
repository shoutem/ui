import React from 'react';
import { View } from '@shoutem/ui';
import { connectStyle } from '@shoutem/theme';
import { ElementPropTypes } from '../../RichMedia';
import { Inline } from '../Inline';

/**
 * Li parent must take care of Li props.
 * By default Li doesn't take props from parsed Li element.
 * @param childElements {Array}
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
