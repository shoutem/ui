import React from 'react';

import { Stage } from './Stage';
import {
  View,
  TextInput,
} from '../../index';

export function FormComponents() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="TextInput / Full width">
        <TextInput
          placeholder="Username or Email"
        />
      </Stage>
      <Stage title="TextInput  / Full width secure entry">
        <TextInput
          placeholder="Password"
          secureTextEntry
        />
      </Stage>

    </View>
  );
}
