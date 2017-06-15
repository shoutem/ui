import React from 'react';
import {
  View,
  Button,
  Icon,
} from '../../index';

export const SceneComposer = {
  propName: 'scene',
  canCompose(navBarProps) {
    if (navBarProps.scene.index === 0 || !navBarProps.onNavigateBack) {
      return false;
    }
    return true;
  },
  compose(navBarProps) {
    return { renderLeftComponent(sceneProps) {
      return (
        <View virtual styleName="container">
          <Button onPress={sceneProps.onNavigateBack}>
            <Icon name="back" animationName={navBarProps.animationName} />
          </Button>
        </View>
      );
    } };
  },
};
