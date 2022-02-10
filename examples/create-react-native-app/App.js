import React, { PureComponent } from 'react';
import { StatusBar } from 'react-native';
import { Examples, View } from '@shoutem/ui';

export default class App extends PureComponent {
  render() {
    return (
      <View styleName="flexible">
        <Examples />
        <StatusBar barStyle="default" hidden={false} />
      </View>
    );
  }
}
