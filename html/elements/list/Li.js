import React from 'react';

import { View } from '../../../components/View';
import { ElementPropTypes } from '../../Html';
import { Inline } from '../Inline';

/**
 * By default Li doesn't take props from parsed Li element.
 * @param childElements {Array}
 * @param renderElement {Function}
 * @param prefix {Component}
 * @param style {Object}
 * @returns {Component}
 */
function Li({ element, renderElement, style }) {
  const { childElements, attributes: { key } } = element;
  return (
    <Inline
      style={style}
      key={key}
      childElements={childElements}
      renderElement={renderElement}
      block
    />
  );
}

Li.propTypes = {
  ...ElementPropTypes,
  prefix: React.PropTypes.element,
};

export default Li;
