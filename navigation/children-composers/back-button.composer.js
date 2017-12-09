import React from 'react';
import {
  View,
  Button,
  Icon,
} from '../../index';

const createBackButton = navBarProps => sceneProps => {
  if (sceneProps.scene.index === 0 || !sceneProps.onNavigateBack) {
    return null;
  }

  return (
    <View virtual styleName="container">
      <Button onPress={sceneProps.onNavigateBack}>
        <Icon name="back" animationName={navBarProps.animationName} />
      </Button>
    </View>
  );
};

const SceneComposer = {
  canCompose() {
    return true;
  },
  compose(navBarProps) {
    return {
      renderLeftComponent: createBackButton(navBarProps),
    };
  },
};

export default SceneComposer;
