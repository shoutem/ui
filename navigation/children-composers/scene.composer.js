import React from 'react';
import {
  View,
  Button,
  Icon,
} from '../../index';

const createSceneComposer = navBarProps => sceneProps => (
  <View virtual styleName="container">
    <Button onPress={sceneProps.onNavigateBack}>
      <Icon name="back" animationName={navBarProps.animationName} />
    </Button>
  </View>
);

const SceneComposer = {
  canCompose(navBarProps) {
    return !(navBarProps.scene.index === 0 || !navBarProps.onNavigateBack);
  },
  compose(navBarProps) {
    return {
      renderLeftComponent: createSceneComposer(navBarProps),
    };
  },
};

export default SceneComposer;
