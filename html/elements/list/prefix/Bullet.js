import React from 'react';
import PropTypes from 'prop-types';

import { Text } from '../../../../components/Text';

export default function Bullet({ style }) {
  return <Text style={style}>• </Text>;
}

Bullet.propTypes = {
  style: PropTypes.object,
};

Bullet.defaultProps = {
  style: {},
};
