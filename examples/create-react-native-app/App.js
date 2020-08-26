import React from 'react';
import { StatusBar } from 'react-native';

import { View, Examples } from '@shoutem/ui';

export default function App() {
  return (
    <View styleName="flexible">
      <Examples />
      <StatusBar barStyle="default" hidden={false} />
    </View>
  );
}
