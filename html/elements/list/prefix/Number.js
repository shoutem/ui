import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '../../../../components/Text';
import { ElementPropTypes } from '../../../Html';

export default function NumberPrefix({ element, style }) {
  const { index } = element.attributes;

  return <Text style={style}>{index}. </Text>;
}

NumberPrefix.propTypes = {
  element: PropTypes.shape({ ...ElementPropTypes }),
  style: PropTypes.object,
};

NumberPrefix.defaultProps = {
  element: undefined,
  style: undefined,
};
