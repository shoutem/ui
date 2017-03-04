import React from 'react';

import { Stage } from './Stage';
import {
  ShareButton,
  View,
} from '../../index';

export function ShareButtons() {
  return (
    <View styleName="vertical collapsed">
      <Stage title="Share button">
        <ShareButton
          message="Supercharge your React Native development!"
          title="Shoutem"
          url="http://www.shoutem.com"
        />
      </Stage>
    </View>
  );
}
