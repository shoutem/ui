import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '../../../../components/Text';

export default function BulletPrefix({ style }) {
  return <Text style={style}>• </Text>;
}

BulletPrefix.propTypes = {
  style: PropTypes.object,
};

BulletPrefix.defaultProps = {
  style: undefined,
};
