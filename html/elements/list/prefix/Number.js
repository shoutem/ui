import React from 'react';

import { View } from '../../../../components/View';
import { Text } from '../../../../components/Text';

export default function ({ element, style }) {
  const { index } = element.attributes;

  return <Text style={style}>{index}. </Text>;
};
