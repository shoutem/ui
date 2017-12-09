import React from 'react';
import { View, Text } from '@shoutem/ui';

export default function ({ element, style }) {
  const { index } = element.attributes;

  return <Text style={style}>{index}. </Text>;
};
