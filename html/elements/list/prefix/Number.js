import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '../../../../components/Text';
import { ElementPropTypes } from '../../../Html';

export default function NumberPrefix({ element, style }) {
  const { index } = element.attributes;

  return <Text style={style}>{index}. </Text>;
}

NumberPrefix.propTypes = {
  style: PropTypes.object,
  element: PropTypes.shape({ ...ElementPropTypes }),
};
